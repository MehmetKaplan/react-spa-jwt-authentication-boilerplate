'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _dateAndTime = require('date-and-time');

var _dateAndTime2 = _interopRequireDefault(_dateAndTime);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _sqls = require('./sqls.js');

var _sqls2 = _interopRequireDefault(_sqls);

var _lock_handler = require('./lock_handler.js');

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

var _mailer = require('./mailer.js');

var _mailer2 = _interopRequireDefault(_mailer);

var _validations = require('./validations.js');

var _validations2 = _interopRequireDefault(_validations);

var _generic_library = require('./generic_library.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requestHandlers = function () {
	function requestHandlers() {
		_classCallCheck(this, requestHandlers);
	}

	_createClass(requestHandlers, [{
		key: 'testConnection',
		value: function testConnection(p_req, p_res) {
			var l_retval = (0, _generic_library.nvl)(p_req.body, {});
			l_retval['result'] = "OK";
			l_retval['handler'] = "testConnection";
			return p_res.json(l_retval);
		}
	}, {
		key: 'checkJWT',
		value: async function checkJWT(p_req, p_res) {
			if ((0, _lock_handler.checkLock)(p_req.ip) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip);
			var l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
			// JWT expected either in Bearer or JWT header
			if (l_token_from_header.startsWith('Bearer ')) {
				l_token_from_header = l_token_from_header.slice(7, l_token_from_header.length);
			}
			if (l_token_from_header.startsWith('JWT ')) {
				l_token_from_header = l_token_from_header.slice(4, l_token_from_header.length);
			}

			if (l_token_from_header) {
				_jsonwebtoken2.default.verify(l_token_from_header, _config2.default.jwtSecret, function (err, decoded) {
					if (err) {
						return p_res.json(_config2.default.signalsFrontendBackend.tokenNotValid);
					} else {
						(0, _lock_handler.resetLockCount)(p_req.ip);
						var l_response_json = _config2.default.signalsFrontendBackend.tokenValid;
						l_response_json['email'] = decoded.email;
						return p_res.json(l_response_json);
					};
				});
			} else {
				return p_res.json(_config2.default.signalsFrontendBackend.tokenNotSupplied);
			}
		}
	}, {
		key: 'login',
		value: async function login(p_req, p_res) {
			var l_email = p_req.body.email.toLowerCase();;
			if ((0, _lock_handler.checkLock)(p_req.ip, l_email) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip, l_email);
			var l_password = p_req.body.password;
			var l_params = [];
			l_params.push(l_email);
			var l_user_data = await _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			var l_hashed_pwd_from_db = l_user_data ? (0, _generic_library.nvl)(l_user_data[0]['encrypted_password'], "xx") : "xx";
			//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
			_bcrypt2.default.compare(l_password, l_hashed_pwd_from_db, function (err, res) {
				if (res) {
					(0, _lock_handler.resetLockCount)(p_req.ip, l_email);
					var l_retval_as_json = _config2.default.signalsFrontendBackend.authenticationSuccessful;
					l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: l_user_data[0]['email'] }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
					return p_res.json(l_retval_as_json);
				} else {
					return p_res.json(_config2.default.signalsFrontendBackend.wrongPassword);
				}
			});
		}
	}, {
		key: 'generateResetPwdToken',
		value: async function generateResetPwdToken(p_req, p_res) {
			var l_email = p_req.body.email;
			if ((0, _lock_handler.checkLock)(p_req.ip, l_email) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip, l_email);
			var l_params = [];
			l_params.push(l_email);
			var l_user_data = await _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			if (l_user_data.length < 1) {
				return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
			};
			var l_retval_as_json = _config2.default.signalsFrontendBackend.pwdResetTokenGenerated;
			var l_second_token = Math.ceil(Math.random() * 1000000000).toString();
			var l_now_str = _dateAndTime2.default.format(new Date(), 'YYYYMMDDHHmmss');
			var l_params2 = [];
			l_params2.push(l_second_token);
			l_params2.push(l_now_str);
			l_params2.push(l_email);
			await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updateResetPasswordSecondToken, l_params2);
			l_retval_as_json['resetPwdJWT'] = _jsonwebtoken2.default.sign({
				userEMail: l_user_data[0]['email']
			}, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpirePasswordReset });
			var l_email_body = _config2.default.passwordResetEMail.replace("[TAG_CODE]", l_second_token.toString()).replace("[TAG_USER]", (0, _generic_library.nvl)(l_user_data[0]["name"], "") + " " + ((0, _generic_library.nvl)(l_user_data[0]["midname"], "").length == 0 ? "" : l_user_data[0]["midname"] + " ") + (0, _generic_library.nvl)(l_user_data[0]["surname"], ""));
			var l_mail_result = await _mailer2.default.sendMail(_config2.default.passwordResetEMailFrom, l_email, _config2.default.passwordResetEMailSubject, "", l_email_body);
			if (l_mail_result == "OK") return p_res.json(l_retval_as_json);else return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
		}
	}, {
		key: 'resetPwd',
		value: async function resetPwd(p_req, p_res) {
			if ((0, _lock_handler.checkLock)(p_req.ip) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip);
			var l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
			// JWT expected either in Bearer or JWT header
			if (l_token_from_header.startsWith('Bearer ')) {
				l_token_from_header = l_token_from_header.slice(7, l_token_from_header.length);
			} else if (l_token_from_header.startsWith('JWT ')) {
				l_token_from_header = l_token_from_header.slice(4, l_token_from_header.length);
			} else {
				return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
			}

			if (l_token_from_header) {
				_jsonwebtoken2.default.verify(l_token_from_header, _config2.default.jwtSecret, async function (err, decoded) {
					if (err) {
						return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
					} else {
						var l_email = decoded.userEMail;
						var l_params = [];
						l_params.push(l_email);
						var l_saved_token_rows = await _database_action_mysql2.default.execute_select(_sqls2.default.readResetPasswordSecondToken, l_params);
						if (l_saved_token_rows.length < 1) {
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
						};
						var l_saved_token_from_user = p_req.body.saved_token;
						if (l_saved_token_rows[0]['ResetPasswordSecondToken'] != l_saved_token_from_user) {
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
						};
						if (Number(l_saved_token_rows[0]['ResetPasswordSecondTokenValidFrom']) + _config2.default.passwordResetSecondTokenExpire < Number(_dateAndTime2.default.format(new Date(), 'YYYYMMDDHHmmss'))) {
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetTokenExpired);
						};
						var l_plain_password = p_req.body.password;
						var l_plain_password2 = p_req.body.password2;
						if (_validations2.default.password(l_plain_password, l_plain_password2) != "OK") {
							return p_res.json(_config2.default.signalsFrontendBackend.passwordStrengthTestFailed);
						};
						// Now password can be updated
						_bcrypt2.default.hash(l_plain_password, _config2.default.bcryptSaltRounds, async function (err, hash) {
							// Store hash in your password DB.
							var l_params = [];
							l_params.push(l_email);
							l_params.push(hash);
							var l_update_result = await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updateEncryptedPassword, l_params);
							if (l_update_result == "OK") {
								(0, _lock_handler.resetLockCount)(p_req.ip);
								var l_retval_as_json = _config2.default.signalsFrontendBackend.pwdResetCompleted;
								l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: decoded.email }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
								return p_res.json(l_retval_as_json);
							} else {
								return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
							}
						});
					};
				});
				//Should be completed asyncronously within bcrypt
			} else {
				return p_res.json(_config2.default.signalsFrontendBackend.tokenNotSupplied);
			}
		}
	}, {
		key: 'signUp',
		value: async function signUp(p_req, p_res) {
			var l_email = p_req.body.email.toLowerCase();
			if ((0, _lock_handler.checkLock)(p_req.ip, l_email) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			//Special precaution againist excessive user generation from same ip
			if ((0, _lock_handler.checkIPBasedFrequentUserGeneration)(p_req.ip) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.ipBasedFrequentUserGeneration);
			await (0, _lock_handler.incrementLockCount)(p_req.ip, l_email);

			var l_password = p_req.body.password;
			var l_password2 = p_req.body.password2;
			var l_gender = p_req.body.gender_id;
			var l_birthday = p_req.body.birthday;
			var l_phone = p_req.body.phone;
			var l_name = p_req.body.name;
			var l_midname = p_req.body.midname;
			var l_surname = p_req.body.surname;
			var l_email_token = p_req.body.confirmationCode;

			if ((await _validations2.default.email(l_email)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			if ((await _validations2.default.emailtoken(l_email, l_email_token)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			if ((await _validations2.default.emailNotExistence(l_email)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			if ((await _validations2.default.password(l_password, l_password2)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.passwordStrengthTestFailed);
			if ((await _validations2.default.gender(l_gender)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.genderTValidationFailed);
			if ((await _validations2.default.birthday(l_birthday)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.birthdayValidationFailed);
			if ((await _validations2.default.phone(l_phone)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.phoneValdiationFailed);

			_bcrypt2.default.hash(l_password, _config2.default.bcryptSaltRounds, async function (err, hash) {
				// email, encrypted_password, name, midname, surname, gender_id, birthday, phone
				var l_params = [];
				l_params.push(l_email);
				l_params.push(hash);
				l_params.push(l_name);
				l_params.push(l_midname);
				l_params.push(l_surname);
				l_params.push(l_gender);
				l_params.push(l_birthday);
				l_params.push(l_phone);
				var l_result = await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.signUp, l_params);
				if (l_result == "OK") {
					(0, _lock_handler.resetLockCount)(p_req.ip);
					(0, _lock_handler.modifyIPBasedUserGenerationTime)(p_req.ip);
					var l_retval_as_json = _config2.default.signalsFrontendBackend.signUpSuccessful;
					l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: l_email }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
					return p_res.json(l_retval_as_json);
				} else {
					return p_res.json(_config2.default.signalsFrontendBackend.signUpGenericError);
				}
			});
		}
	}, {
		key: 'generateEmailOwnershipToken',
		value: async function generateEmailOwnershipToken(p_req, p_res) {
			var l_email = p_req.body.email.toLowerCase();
			if ((0, _lock_handler.checkLock)(p_req.ip, l_email) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip);
			var l_params = [];
			l_params.push(l_email);
			await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.emailValidationTokenClear, l_params);
			if ((await _validations2.default.email(l_email)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			if ((await _validations2.default.emailNotExistence(l_email)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			var l_token = Math.ceil(Math.random() * 1000000000).toString();
			l_params.push(l_token);
			var l_result = await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.emailValidationTokenSet, l_params);
			if (l_result != "OK") return p_res.json(_config2.default.signalsFrontendBackend.eMailValidationGenericError);
			var l_email_body = await _config2.default.emailValidationEMail.replace("[TAG_CODE]", l_token.toString());
			var l_mail_result = await _mailer2.default.sendMail(_config2.default.emailValidationEMailFrom, l_email, _config2.default.emailValidationEMailSubject, "", l_email_body);
			if (l_mail_result == "OK") return p_res.json(_config2.default.signalsFrontendBackend.emailValidationEMailSent);else return p_res.json(_config2.default.signalsFrontendBackend.eMailValidationGenericError);
		}
	}, {
		key: 'updateEMail',
		value: async function updateEMail(p_req, p_res) {
			var l_email = p_req.body.email.toLowerCase();
			if ((0, _lock_handler.checkLock)(p_req.ip, l_email) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip, l_email);

			var l_email_token = p_req.body.emailtoken;
			if (_validations2.default.email(l_email, l_email_token) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);
			//not needed coming from JWT // if (validations.emailexistence(l_email) != "OK")                 return p_res.json(config.signalsFrontendBackend.signUpInvalidEmail);
			if ((await _validations2.default.emailNotExistence(l_email)) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpInvalidEmail);

			var l_oldemail = "";
			var l_jwt_payload = _validations2.default.checkJWT(p_req);
			if ((0, _generic_library.nvl)(l_jwt_payload["email"], "x") == "x") return p_res.json(_config2.default.signalsFrontendBackend.tokenNotValid);else l_oldemail = l_jwt_payload["email"];

			var l_params = [];
			l_params.push(l_email);
			l_params.push(l_oldemail);
			await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updateEMail, l_params);
			if (l_result != "OK") return p_res.json(_config2.default.signalsFrontendBackend.signUpGenericError);

			var l_retval_as_json = _config2.default.signalsFrontendBackend.eMailUpdated;
			l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: l_email }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
			return p_res.json(l_retval_as_json);
		}
	}, {
		key: 'updatePassword',
		value: async function updatePassword(p_req, p_res) {
			if ((0, _lock_handler.checkLock)(p_req.ip) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip);

			var l_password = p_req.body.password;
			var l_password2 = p_req.body.password2;
			var l_oldpassword = p_req.body.oldPassword;

			if (_validations2.default.password(l_password, l_password2) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.passwordStrengthTestFailed);

			var l_email = "";
			var l_jwt_payload = _validations2.default.checkJWT(p_req);
			if ((0, _generic_library.nvl)(l_jwt_payload["email"], "x") == "x") return p_res.json(_config2.default.signalsFrontendBackend.tokenNotValid);else l_email = l_jwt_payload["email"];

			// Compare old password
			var l_params = [];
			l_params.push(l_email);
			var l_user_data = await _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			var l_hashed_pwd_from_db = l_user_data ? (0, _generic_library.nvl)(l_user_data['encrypted_password'], "xx") : "xx";
			if (!_bcrypt2.default.compareSync(l_oldpassword, l_hashed_pwd_from_db)) return p_res.json(_config2.default.signalsFrontendBackend.wrongPassword);

			_bcrypt2.default.hash(l_password, _config2.default.bcryptSaltRounds, async function (err, hash) {
				// email, encrypted_password, name, midname, surname, gender_id, birthday, phone
				var l_params = [];
				l_params.push(hash);
				l_params.push(l_email);
				var l_result = await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updatePassword, l_params);
				if (l_result == "OK") {
					(0, _lock_handler.resetLockCount)(p_req.ip, l_email);
					return p_res.json(_config2.default.signalsFrontendBackend.updatePasswordSuccessful);
				} else {
					return p_res.json(_config2.default.signalsFrontendBackend.updatePasswordFailed);
				}
			});
		}
	}, {
		key: 'updateData',
		value: async function updateData(p_req, p_res) {
			if ((0, _lock_handler.checkLock)(p_req.ip) == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			await (0, _lock_handler.incrementLockCount)(p_req.ip);

			var l_gender = p_req.body.gender;
			var l_birthday = p_req.body.birthday;
			var l_phone = p_req.body.phone;
			var l_name = p_req.body.name;
			var l_midname = p_req.body.midname;
			var l_surname = p_req.body.surname;

			if (_validations2.default.gender(l_gender) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.genderTValidationFailed);
			if (_validations2.default.birthday(l_birthday) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.birthdayValidationFailed);
			if (_validations2.default.phone(l_phone) != "OK") return p_res.json(_config2.default.signalsFrontendBackend.phoneValdiationFailed);

			var l_email = "";
			var l_jwt_payload = _validations2.default.checkJWT(p_req);
			if ((0, _generic_library.nvl)(l_jwt_payload["email"], "x") == "x") return p_res.json(_config2.default.signalsFrontendBackend.tokenNotValid);else l_email = l_jwt_payload["email"];

			var l_params = [];
			l_params.push(l_name);
			l_params.push(l_midname);
			l_params.push(l_surname);
			l_params.push(l_gender);
			l_params.push(l_birthday);
			l_params.push(l_phone);
			l_params.push(l_email);
			var l_result = await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updateData, l_params);
			if (l_result == "OK") {
				(0, _lock_handler.resetLockCount)(p_req.ip, l_email);
				return p_res.json(_config2.default.signalsFrontendBackend.updateDataSuccessful);
			} else {
				return p_res.json(_config2.default.signalsFrontendBackend.updateDataFailed);
			}
		}
	}, {
		key: 'allOtherURLs',
		value: function allOtherURLs(p_req, p_res) {
			return p_res.json(_config2.default.signalsFrontendBackend.wrongAPICall);
		}
	}]);

	return requestHandlers;
}();

exports.default = requestHandlers;