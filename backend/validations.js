import config from './config.js';
import databaseActionMySQL from './database_action_mysql.js';

export default class validations {
	
	constructor(){

	}

	email(p_email, p_email_token){
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!(regex.test(p_email))) return "NOK";
		let l_params = [];
		l_params << p_email;
		let l_emailcount_rows = databaseActionMySQL.execute_select(sqls.emailCount, l_params);
		if (l_emailcount_rows[0]['emailcount'] != 0) return "NOK";
		let l_params2 = [];
		l_params2 << p_email;
		let l_token_rows = databaseActionMySQL.execute_select(sqls.emailValidationTokenRead, l_params2);
		if (l_token_rows.length != 1) return "NOK";
		if (p_email_token != l_token_rows[0]['validation_token']) return "NOK";
		return "OK";
	}

	password(p_password){
		let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
		let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
		let regex = config.passwordStrengthStrong ? strongRegex : mediumRegex;
		if (!(regex.test(p_password))) return "NOK";
		return "OK";
	}

	gender (p_gender) {
		if (!([0, 1, 2].includes(p_gender))) return "NOK";
		return "OK"; 
	}

	birthday(p_birthday) {
		return "OK"; 
	} 
	
	phone(p_phone) {
		return "OK";
	}
	
}