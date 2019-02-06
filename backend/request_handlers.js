import jwt from 'jsonwebtoken';
import bcrypt, { compareSync } from 'bcrypt';
import date from 'date-and-time';

import config from './config';
import sqls from './sqls.js';
import {incrementLockCount, resetLockCount, checkLock, checkIPBasedFrequentUserGeneration, modifyIPBasedUserGenerationTime} from './lock_handler.js';
import databaseActionMySQL from './database_action_mysql.js';
import mailer from './mailer.js';
import validations from './validations.js';
import {nvl} from './generic_library.js';


export default class requestHandlers {

	constructor(){

	}

	testConnection(p_req, p_res){
		let l_retval = nvl(p_req.body, {});
		l_retval['result'] = "OK";
		l_retval['handler'] = "testConnection";
		return p_res.json(l_retval);
	}

	async checkJWT(p_req, p_res){
		if (checkLock(p_req.ip) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip);
		let l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
		// JWT expected either in Bearer or JWT header
		if (l_token_from_header.startsWith('Bearer ')) {
			l_token_from_header = l_token_from_header.slice(7, l_token_from_header.length);
		}
		if (l_token_from_header.startsWith('JWT ')) {
			l_token_from_header = l_token_from_header.slice(4, l_token_from_header.length);
		}

		if (l_token_from_header) {
			jwt.verify(l_token_from_header, config.jwtSecret, (err, decoded) => {
				if (err) {
					return p_res.json(config.signalsFrontendBackend.tokenNotValid);
				}
				else {
					resetLockCount(p_req.ip);
					let l_response_json = config.signalsFrontendBackend.tokenValid;
					l_response_json['email'] = decoded.email;
					return p_res.json(l_response_json);
				};
			});
		} 
		else {
			return p_res.json(config.signalsFrontendBackend.tokenNotSupplied);
		}
	}

	async login(p_req, p_res){
		let l_email = p_req.body.email.toLowerCase();;
		if (checkLock(p_req.ip, l_email) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip, l_email);
		let l_password = p_req.body.password;
		let l_params = [];
		l_params.push(l_email);
		let l_user_data = await databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		let l_hashed_pwd_from_db
		if (l_user_data.length > 0) l_hashed_pwd_from_db = nvl(l_user_data[0]['encrypted_password'], "xx");
		else l_hashed_pwd_from_db = "xx";
		//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
		bcrypt.compare(l_password, l_hashed_pwd_from_db, function(err, res) {
			if (res) {
				resetLockCount(p_req.ip, l_email);
				let l_retval_as_json = config.signalsFrontendBackend.authenticationSuccessful;
				l_retval_as_json['JWT'] = jwt.sign(
					{email: l_user_data[0]['email']},
					config.jwtSecret,
					{expiresIn: config.jwtExpire}
				);
				return p_res.json(l_retval_as_json);
			}
			else {
				return p_res.json(config.signalsFrontendBackend.wrongPassword);
			}
		});
	}

	async generateResetPwdToken(p_req, p_res){
		let l_email = p_req.body.email;
		if (checkLock(p_req.ip, l_email) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip, l_email);
		let l_params = [];
		l_params.push(l_email);
		let l_user_data = await databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		if (l_user_data.length < 1) {
			return p_res.json(config.signalsFrontendBackend.pwdResetError);
		};
		let l_retval_as_json = config.signalsFrontendBackend.pwdResetTokenGenerated;
		let l_second_token = Math.ceil(Math.random() * 1000000000).toString();
		let l_now_str = date.format(new Date(), 'YYYYMMDDHHmmss');
		let l_params2 = [];
		l_params2.push(l_second_token);
		l_params2.push(l_now_str);
		l_params2.push(l_email);
		await databaseActionMySQL.execute_updatedeleteinsert(sqls.updateResetPasswordSecondToken, l_params2);
		l_retval_as_json['resetPwdJWT'] = jwt.sign(
			{
				userEMail: l_user_data[0]['email']
			},
			config.jwtSecret,
			{expiresIn: config.jwtExpirePasswordReset}
		);
		let l_email_body = config.passwordResetEMail
			.replace("[TAG_CODE]", l_second_token.toString())
			.replace("[TAG_USER]", nvl(l_user_data[0]["name"], "") + " " + ((nvl(l_user_data[0]["midname"], "").length == 0) ? "" : l_user_data[0]["midname"] + " ") + nvl(l_user_data[0]["surname"], ""));
		let l_mail_result = await mailer.sendMail(
			config.passwordResetEMailFrom, 
			l_email,
			config.passwordResetEMailSubject, 
			"", 
			l_email_body);
		if (l_mail_result == "OK") return p_res.json(l_retval_as_json);
		else return p_res.json(config.signalsFrontendBackend.pwdResetError);
	}

	async resetPwd(p_req, p_res){
		if (checkLock(p_req.ip) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip);
		let l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
		// JWT expected either in Bearer or JWT header
		if (l_token_from_header.startsWith('Bearer ')) {
			l_token_from_header = l_token_from_header.slice(7, l_token_from_header.length);
		}
		else if (l_token_from_header.startsWith('JWT ')) {
			l_token_from_header = l_token_from_header.slice(4, l_token_from_header.length);
		}
		else {
			return p_res.json(config.signalsFrontendBackend.pwdResetError);
		}

		if (l_token_from_header) {
			jwt.verify(l_token_from_header, config.jwtSecret, async (err, decoded) => {
				if (err) {
					return p_res.json(config.signalsFrontendBackend.pwdResetError);
				}
				else {
					let l_email = decoded.userEMail;
					let l_params = [];
					l_params.push(l_email);
					let l_saved_token_rows = await databaseActionMySQL.execute_select(sqls.readResetPasswordSecondToken, l_params);
					if (l_saved_token_rows.length < 1) {
						return p_res.json(config.signalsFrontendBackend.pwdResetError);
					};
					let l_saved_token_from_user = p_req.body.saved_token;
					if (l_saved_token_rows[0]['ResetPasswordSecondToken'] != l_saved_token_from_user){
						return p_res.json(config.signalsFrontendBackend.pwdResetError);
					};
					if (Number(l_saved_token_rows[0]['ResetPasswordSecondTokenValidFrom']) + config.passwordResetSecondTokenExpire < Number(date.format(new Date(), 'YYYYMMDDHHmmss'))){
						return p_res.json(config.signalsFrontendBackend.pwdResetTokenExpired);
					};
					let l_plain_password = p_req.body.password;
					let l_plain_password2 = p_req.body.password2;
					if (validations.password(l_plain_password, l_plain_password2) != "OK") {
						return p_res.json(config.signalsFrontendBackend.passwordStrengthTestFailed);
					};
					// Now password can be updated
					bcrypt.hash(l_plain_password, config.bcryptSaltRounds, async function(err, hash) {
						// Store hash in your password DB.
						let l_params = [];
						l_params.push(l_email);
						l_params.push(hash);
						let l_update_result = await databaseActionMySQL.execute_updatedeleteinsert(sqls.updateEncryptedPassword, l_params);
						if (l_update_result == "OK") {
							resetLockCount(p_req.ip);
							let l_retval_as_json = config.signalsFrontendBackend.pwdResetCompleted;
							l_retval_as_json['JWT'] = jwt.sign(
								{email: decoded.email},
								config.jwtSecret,
								{expiresIn: config.jwtExpire}
							);
							return p_res.json(l_retval_as_json);
						}
						else {
							return p_res.json(config.signalsFrontendBackend.pwdResetError);
						}
					});
				};
			});
			//Should be completed asyncronously within bcrypt
		} 
		else {
			return p_res.json(config.signalsFrontendBackend.tokenNotSupplied);
		}
	}

	async signUp(p_req, p_res){
		let l_email = p_req.body.email.toLowerCase();
		if (checkLock(p_req.ip, l_email) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		//Special precaution againist excessive user generation from same ip
		if (checkIPBasedFrequentUserGeneration(p_req.ip) == "LOCKED") return p_res.json(config.signalsFrontendBackend.ipBasedFrequentUserGeneration);
		await incrementLockCount(p_req.ip, l_email);

		let l_password			 = p_req.body.password;
		let l_password2		 = p_req.body.password2;
		let l_gender			 = p_req.body.gender_id;
		let l_birthday			 = p_req.body.birthday;
		let l_phone				 = p_req.body.phone;
		let l_name				 = p_req.body.name;
		let l_midname			 = p_req.body.midname;
		let l_surname			 = p_req.body.surname;
		let l_email_token		 = p_req.body.confirmationCode;

		if ((await validations.email(l_email)) != "OK")                            return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		if ((await validations.emailtoken(l_email, l_email_token)) != "OK")        return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		if ((await validations.emailNotExistence(l_email)) != "OK") 					return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		if ((await validations.password(l_password, l_password2)) != "OK")         return p_res.json(config.signalsFrontendBackend.passwordStrengthTestFailed);
		if ((await validations.gender(l_gender) )!= "OK")                          return p_res.json(config.signalsFrontendBackend.genderTValidationFailed);
		if ((await validations.birthday(l_birthday)) != "OK")                      return p_res.json(config.signalsFrontendBackend.birthdayValidationFailed);
		if ((await validations.phone(l_phone)) != "OK")                            return p_res.json(config.signalsFrontendBackend.phoneValdiationFailed);

		bcrypt.hash(l_password, config.bcryptSaltRounds, async function(err, hash) {
			// email, encrypted_password, name, midname, surname, gender_id, birthday, phone
			let l_params = [];
			l_params.push(l_email);
			l_params.push(hash);
			l_params.push(l_name);
			l_params.push(l_midname);
			l_params.push(l_surname);
			l_params.push(l_gender);
			l_params.push(l_birthday);
			l_params.push(l_phone);
			let l_result = await databaseActionMySQL.execute_updatedeleteinsert(sqls.signUp, l_params);
			if (l_result == "OK") {
				resetLockCount(p_req.ip);
				modifyIPBasedUserGenerationTime(p_req.ip);
				let l_retval_as_json = config.signalsFrontendBackend.signUpSuccessful;
				l_retval_as_json['JWT'] = jwt.sign(
					{email: l_email},
					config.jwtSecret,
					{expiresIn: config.jwtExpire}
				);
				return p_res.json(l_retval_as_json);
			}
			else {
				return p_res.json(config.signalsFrontendBackend.signUpGenericError);
			}
		});
	}

	async generateEmailOwnershipToken(p_req, p_res){
		let l_email = p_req.body.email.toLowerCase();
		if (checkLock(p_req.ip, l_email) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip);
		let l_params = [];
		l_params.push(l_email);
		await databaseActionMySQL.execute_updatedeleteinsert(sqls.emailValidationTokenClear, l_params);
		if ((await validations.email(l_email)) != "OK") return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		if ((await validations.emailNotExistence(l_email)) != "OK") return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		let l_token = Math.ceil(Math.random() * 1000000000).toString();
		l_params.push(l_token);
		let l_result = await databaseActionMySQL.execute_updatedeleteinsert(sqls.emailValidationTokenSet, l_params);
		if (l_result != "OK") return p_res.json(config.signalsFrontendBackend.eMailValidationGenericError);
		let l_email_body = await config.emailValidationEMail
			.replace("[TAG_CODE]", l_token.toString());
		let l_mail_result = await mailer.sendMail(
			config.emailValidationEMailFrom, 
			l_email,
			config.emailValidationEMailSubject,
			"", 
			l_email_body);
		if (l_mail_result == "OK") return p_res.json(config.signalsFrontendBackend.emailValidationEMailSent);
		else return p_res.json(config.signalsFrontendBackend.eMailValidationGenericError);
	}

	async updateEMail(p_req, p_res){
		let l_email = p_req.body.email.toLowerCase();
		if (checkLock(p_req.ip, l_email) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip, l_email);

		let l_email_token = p_req.body.emailtoken;
		if (validations.email(l_email, l_email_token) != "OK")           return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		//not needed coming from JWT // if (validations.emailexistence(l_email) != "OK")                 return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		if ((await validations.emailNotExistence(l_email)) != "OK") 	  return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);

		let l_oldemail = "";
		let l_jwt_payload = validations.checkJWT(p_req);
		if( nvl(l_jwt_payload["email"], "x") == "x" ) return p_res.json(config.signalsFrontendBackend.tokenNotValid);
		else l_oldemail = l_jwt_payload["email"];

		let l_params = [];
		l_params.push(l_email);
		l_params.push(l_oldemail);
		await databaseActionMySQL.execute_updatedeleteinsert(sqls.updateEMail, l_params);
		if (l_result != "OK") return p_res.json(config.signalsFrontendBackend.signUpGenericError);

		let l_retval_as_json = config.signalsFrontendBackend.eMailUpdated;
		l_retval_as_json['JWT'] = jwt.sign(
			{email: l_email},
			config.jwtSecret,
			{expiresIn: config.jwtExpire}
		);
		return p_res.json(l_retval_as_json);
	}

	async updatePassword(p_req, p_res){
		if (checkLock(p_req.ip) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip);

		let l_password    = p_req.body.password;
		let l_password2   = p_req.body.password2;
		let l_oldpassword = p_req.body.oldPassword;

		if (validations.password(l_password, l_password2) != "OK") return p_res.json(config.signalsFrontendBackend.passwordStrengthTestFailed);

		let l_email = "";
		let l_jwt_payload = validations.checkJWT(p_req);
		if( nvl(l_jwt_payload["email"], "x") == "x" ) return p_res.json(config.signalsFrontendBackend.tokenNotValid);
		else l_email = l_jwt_payload["email"];

		// Compare old password
		let l_params = [];
		l_params.push(l_email);
		let l_user_data = await databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		let l_hashed_pwd_from_db = l_user_data ? nvl(l_user_data['encrypted_password'], "xx") : "xx";
		if (!(bcrypt.compareSync(l_oldpassword, l_hashed_pwd_from_db))) return p_res.json(config.signalsFrontendBackend.wrongPassword);

		bcrypt.hash(l_password, config.bcryptSaltRounds, async function(err, hash) {
			// email, encrypted_password, name, midname, surname, gender_id, birthday, phone
			let l_params = [];
			l_params.push(hash);
			l_params.push(l_email);
			let l_result = await databaseActionMySQL.execute_updatedeleteinsert(sqls.updatePassword, l_params);
			if (l_result == "OK") {
				resetLockCount(p_req.ip, l_email);
				return p_res.json(config.signalsFrontendBackend.updatePasswordSuccessful);
			}
			else {
				return p_res.json(config.signalsFrontendBackend.updatePasswordFailed);
			}
		});
	}

	async updateData(p_req, p_res){
		if (checkLock(p_req.ip) == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		await incrementLockCount(p_req.ip);

		let l_gender = p_req.body.gender;
		let l_birthday = p_req.body.birthday;
		let l_phone = p_req.body.phone;
		let l_name = p_req.body.name;
		let l_midname = p_req.body.midname;
		let l_surname = p_req.body.surname;

		if (validations.gender(l_gender) != "OK")return p_res.json(config.signalsFrontendBackend.genderTValidationFailed);
		if (validations.birthday(l_birthday) != "OK") return p_res.json(config.signalsFrontendBackend.birthdayValidationFailed);
		if (validations.phone(l_phone) != "OK") return p_res.json(config.signalsFrontendBackend.phoneValdiationFailed);

		let l_email = "";
		let l_jwt_payload = validations.checkJWT(p_req);
		if( nvl(l_jwt_payload["email"], "x") == "x" ) return p_res.json(config.signalsFrontendBackend.tokenNotValid);
		else l_email = l_jwt_payload["email"];

		let l_params = [];
		l_params.push(l_name);
		l_params.push(l_midname);
		l_params.push(l_surname);
		l_params.push(l_gender);
		l_params.push(l_birthday);
		l_params.push(l_phone);
		l_params.push(l_email);
		let l_result = await databaseActionMySQL.execute_updatedeleteinsert(sqls.updateData, l_params);
		if (l_result == "OK") {
			resetLockCount(p_req.ip, l_email);
			return p_res.json(config.signalsFrontendBackend.updateDataSuccessful);
		}
		else {
			return p_res.json(config.signalsFrontendBackend.updateDataFailed);
		}
	}

	allOtherURLs(p_req, p_res){
		return p_res.json(config.signalsFrontendBackend.wrongAPICall);
	}

}
