import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import date from './date-and-time';

import config from './config';
import sqls from './sqls.js';
import {incrementLockCount, resetLockCount, checkLock} from './lock_handler.js';
import databaseActionMySQL from './database_action_mysql.js';
import mailer from './mailer.js';
import validations from './validations.js';


export default class requestHandlers {

	constructor(){

	}

	checkJWT(p_req, p_res){
		if (checkLock() == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		let l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
		// JWT expected either in Bearer or JWT header
		if (l_token_from_header.startsWith('Bearer ')) {
			l_token_from_header = l_token_from_header.slice(7, token.length);
		}
		if (l_token_from_header.startsWith('JWT ')) {
			l_token_from_header = l_token_from_header.slice(4, token.length);
		}

		if (l_token_from_header) {
			jwt.verify(l_token_from_header, config.jwtSecret, (err, decoded) => {
				if (err) {
					incrementLockCount();
					return p_res.json(config.signalsFrontendBackend.tokenNotValid);
				}
				else {
					//resetLockCount();
					let l_response_json = config.signalsFrontendBackend.tokenValid;
					l_response_json['email'] = decoded.email;
					return p_res.json(l_response_json);
				};
			});
		} 
		else {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.tokenNotSupplied);
		}
	}

	login(p_req, p_res){
		let l_email = p_req.body.email;
		let l_password = p_req.body.password;
		let l_params = [];
		l_params << l_email;
		let l_user_data = databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		let l_hashed_pwd_from_db = l_user_data ? nvl(l_user_data['encrypted_password'], "xx") : "xx";
		//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
		bcrypt.compare(l_password, l_hashed_pwd_from_db, function(err, res) {
			if (res) {
				resetLockCount();
				let l_retval_as_json = config.signalsFrontendBackend.authenticationSuccessful;
				l_retval_as_json['JWT'] = jwt.sign(
					{email: l_user_data['email']},
					config.jwtSecret,
					{expiresIn: config.jwtExpire}
				);
				return p_res.json(l_retval_as_json);
			}
			else {
				incrementLockCount();
				return p_res.json(config.signalsFrontendBackend.wrongPassword);
			}
		});
	}

	generateResetPwdToken(p_req, p_res){
		if (checkLock() == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		let l_email = p_req.body.email;
		let l_params = [];
		l_params << l_email;
		let l_user_data = databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		if (l_user_data.length < 1) {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.pwdResetError);
		};
		let l_retval_as_json = config.signalsFrontendBackend.pwdResetTokenGenerated;
		let l_second_token = Math.ceil(Math.random() * 1000000000).toString();
		let l_now_str = date.format(new Date(), 'YYYYMMDDHHmmss');
		let l_params2 = [];
		l_params2 << l_second_token;
		l_params2 << l_now_str;
		l_params2 << l_email;
		databaseActionMySQL.execute_updatedeleteinsert(sqls.updateResetPasswordSecondToken, l_params2);
		l_retval_as_json['JWT'] = jwt.sign(
			{
				userEMail: l_user_data['email']
			},
			config.jwtSecret,
			{expiresIn: config.jwtExpirePasswordReset}
		);
		let l_email_body = config.passwordResetEMail
			.replace("[TAG_CODE]", l_second_token.toString())
			.replace("[TAG_USER]", nvl(l_user_data[0]["name"], "") + " " + ((nvl(l_user_data[0]["midname"], "").length == 0) ? "" : l_user_data[0]["midname"] + " ") + nvl(l_user_data[0]["surname"], ""));
		let l_mail_result = mailer.sendMail(
			config.passwordResetEMailFrom, 
			l_email,
			config.passwordResetEMailSubject, 
			"", 
			l_email_body);
		if (l_mail_result == "OK") return p_res.json(l_retval_as_json);
		else return p_res.json(config.signalsFrontendBackend.pwdResetError);
	}

	resetPwd(p_req, p_res){
		if (checkLock() == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		let l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
		// JWT expected either in Bearer or JWT header
		if (l_token_from_header.startsWith('Bearer ')) {
			l_token_from_header = l_token_from_header.slice(7, token.length);
		}
		else if (l_token_from_header.startsWith('JWT ')) {
			l_token_from_header = l_token_from_header.slice(4, token.length);
		}
		else {
			return p_res.json(config.signalsFrontendBackend.pwdResetError);
		}

		if (l_token_from_header) {
			jwt.verify(l_token_from_header, config.jwtSecret, (err, decoded) => {
				if (err) {
					return p_res.json(config.signalsFrontendBackend.pwdResetError);
				}
				else {
					let l_email = decoded.userEMail;
					let l_saved_token_rows = databaseActionMySQL.execute_select(sqls.readResetPasswordSecondToken, l_params);
					if (l_saved_token_rows.length < 1) {
						return p_res.json(config.signalsFrontendBackend.pwdResetError);
					};
					let l_saved_token_from_user = p_req.body.email;
					if (l_saved_token_rows[0]['ResetPasswordSecondToken'] != l_saved_token_from_user){
						incrementLockCount();
						return p_res.json(config.signalsFrontendBackend.pwdResetError);
					};					
					if (Number(l_saved_token_rows[0]['ResetPasswordSecondTokenValidFrom']) + config.passwordResetSecondTokenExpire > Number(date.format(new Date(), 'YYYYMMDDHHmmss'))){
						incrementLockCount();
						return p_res.json(config.signalsFrontendBackend.pwdResetTokenExpired);
					};
					// Now password can be updated
					let l_plain_password = p_req.body.password;
					bcrypt.hash(l_plain_password, config.bcryptSaltRounds, function(err, hash) {
						// Store hash in your password DB.
						let l_params = [];
						l_params << l_email;
						l_params << hash;
						let l_update_result = databaseActionMySQL.execute_updatedeleteinsert(updateEncryptedPassword, l_params);
						if (l_update_result == "OK") {
							resetLockCount();
							let l_retval_as_json = config.signalsFrontendBackend.pwdResetCompleted;
							l_retval_as_json['JWT'] = jwt.sign(
								{email: l_user_data['email']},
								config.jwtSecret,
								{expiresIn: config.jwtExpire}
							);
							return p_res.json(l_retval_as_json);
						}
						else {
							incrementLockCount();
							return p_res.json(config.signalsFrontendBackend.pwdResetError);
						}
					});
				};
			});
			//Should be completed asyncronously within bcrypt
		} 
		else {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.tokenNotSupplied);
		}
	}

	

	signUp(p_req, p_res){
		if (checkLock() == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);

		let l_email = p_req.body.email.toLowerCase();
		let l_password = p_req.body.password;
		let l_gender = p_req.body.gender;
		let l_birthday = p_req.body.birthday;
		let l_phone = p_req.body.phone;
		let l_name = p_req.body.name;
		let l_midname = p_req.body.midname;
		let l_surname = p_req.body.surname;

		if (validations.email(l_email) != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
		};
		if (validations.password(l_password) != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.passwordStrengthTestFailed);
		};
		if (validations.gender(l_gender) != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.genderTValidationFailed);
		};
		if (validations.birthday(l_birthday) != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.birthdayValidationFailed);
		};
		if (validations.phone(l_phone) != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.phoneValdiationFailed);
		};


		bcrypt.hash(l_password, config.bcryptSaltRounds, function(err, hash) {
			// email, encrypted_password, name, midname, surname, gender_id, birthday, phone
			let l_params = [];
			l_params << l_email;
			l_params << hash;
			l_params << l_name;
			l_params << l_midname;
			l_params << l_surname;
			l_params << l_gender;
			l_params << l_birthday;
			l_params << l_phone;
			let l_result = databaseActionMySQL.execute_updatedeleteinsert(sqls.updateResetPasswordSecondToken, l_params);
			if (l_result == "OK") {
				resetLockCount();
				let l_retval_as_json = config.signalsFrontendBackend.signUpSuccessful;
				l_retval_as_json['JWT'] = jwt.sign(
					{email: l_email},
					config.jwtSecret,
					{expiresIn: config.jwtExpire}
				);
				return p_res.json(l_retval_as_json);
			}
			else {
				incrementLockCount();
				return p_res.json(config.signalsFrontendBackend.signUpGenericError);
			}
		});
	}

	generateEmailOwnershipToken(p_req, p_res){
		if (checkLock() == "LOCKED") return p_res.json(config.signalsFrontendBackend.locked);
		incrementLockCount();
		let l_params = [];
		l_params << l_email;
		databaseActionMySQL.execute_updatedeleteinsert(sqls.emailValidationTokenClear, l_params);
		let l_token = Math.ceil(Math.random() * 1000000000).toString();
		l_params << l_token;
		let l_result = databaseActionMySQL.execute_updatedeleteinsert(sqls.emailValidationTokenSet, l_params);
		if (l_result != "OK") {
			incrementLockCount();
			return p_res.json(config.signalsFrontendBackend.signUpGenericError);
		};
	
		let l_email_body = config.emailValidationEMail
			.replace("[TAG_CODE]", l_token.toString());
		let l_mail_result = mailer.sendMail(
			config.emailValidationEMailFrom, 
			l_email,
			config.emailValidationEMailSubject,
			"", 
			l_email_body);

		if (l_mail_result == "OK") return p_res.json(config.signalsFrontendBackend.emailValidationEMailSent);
		else return p_res.json(config.signalsFrontendBackend.signUpGenericError);
	}

	allOtherURLs(p_req, p_res){
		return p_res.json(config.signalsFrontendBackend.wrongAPICall);
	}

}

