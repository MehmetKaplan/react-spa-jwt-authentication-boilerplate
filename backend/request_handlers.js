import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import config from './config';
import sqls from './sqls.js';
import {incrementLockCount, resetLockCount, checkLock} from './lock_handler.js';
import databaseActionMySQL from './database_action_mysql.js';

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
					l_response_json['user'] = decoded.user;
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
		let l_username = p_req.body.username;
		let l_password = p_req.body.password;
		let l_params = [];
		l_params << l_username;
		let l_user_data = databaseActionMySQL.execute_select(sqls.getAllAttributesOfAUser, l_params);
		let l_hashed_pwd_from_db = l_user_data ? nvl(l_user_data['encrypted_password'], "xx") : "xx";
		//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
		bcrypt.compare(l_password, l_hashed_pwd_from_db, function(err, res) {
			if (res) {
				resetLockCount();
				let l_retval_as_json = config.signalsFrontendBackend.authenticationSuccessful;
				l_retval_as_json['JWT'] = jwt.sign(
					{user: l_user_data['email']},
					config.secret,
					{expiresIn: config.jwtExpire}
				);
				p_res.json(l_retval_as_json);
			}
			else {
				incrementLockCount();
				return p_res.json(config.signalsFrontendBackend.wrongPassword);
			}
		});
	}
	generateResetURL(p_req, p_res){

	}
	confirmResetURL(p_req, p_res){

	}
	actionResetURL(p_req, p_res){

	}
	actionResetURL(p_req, p_res){

	}

	allOtherURLs(){
		return p_res.json(config.signalsFrontendBackend.wrongAPICall);
	}





}



module.exports = {
	checkToken: checkToken
 }