import config from './config.js';
import databaseActionMySQL from './database_action_mysql.js';
import sqls from './sqls.js';
import {nvl} from './generic_library.js';


class validations_ {
	
	constructor(){

	}

	async email(p_email, p_email_token){
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!(regex.test(p_email))) return "NOK";
		let l_params = [];
		l_params.push(p_email);
		let l_token_rows = await databaseActionMySQL.execute_select(sqls.emailValidationTokenRead, l_params);
		if (l_token_rows.length != 1) return "NOK";
		if (p_email_token != l_token_rows[0]['validation_token']) return "NOK";
		return "OK";
	}

	async emailexistence(p_email, p_email_token){
		let l_params = [];
		l_params.push(p_email);
		let l_emailcount_rows = await databaseActionMySQL.execute_select(sqls.emailCount, l_params);
		if (l_emailcount_rows[0]['emailcount'] != 0) return "NOK";
		return "OK";
	}


	password(p_password, p_password2){
		let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
		let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
		let regex = config.passwordStrengthStrong ? strongRegex : mediumRegex;
		if (!(regex.test(p_password))) return "NOK";
		if (nvl(p_password,"x") != nvl(p_password2, "y")) return "NOK";
		return "OK";
	}

	gender (p_gender) {
		if (!(["1", "2", "3"].includes(p_gender))) return "NOK";
		return "OK"; 
	}

	birthday(p_birthday) {
		return "OK"; 
	} 
	
	phone(p_phone) {
		return "OK";
	}
	
	checkJWT_(p_req) {
		return new Promise(resolve => {
			let l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
			if (l_token_from_header.startsWith('Bearer ')) l_token_from_header = l_token_from_header.slice(7, token.length);
			if (l_token_from_header.startsWith('JWT '))l_token_from_header = l_token_from_header.slice(4, token.length);
			if (l_token_from_header) {
				jwt.verify(l_token_from_header, config.jwtSecret, (err, decoded) => {
					if (err) {
						resolve({});
					}
					else {
						resolve(decoded);
					};
				});
			};
		});
	}

	async checkJWT(p_req) {
		var l_retval = await checkJWT_(p_req);
		return l_retval;
	}

}

const validations = new validations_()
export default validations;
