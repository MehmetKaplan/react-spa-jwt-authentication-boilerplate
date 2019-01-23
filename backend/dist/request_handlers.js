'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _dateAndTime = require('./date-and-time');

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requestHandlers = function () {
	function requestHandlers() {
		_classCallCheck(this, requestHandlers);
	}

	_createClass(requestHandlers, [{
		key: 'checkJWT',
		value: function checkJWT(p_req, p_res) {
			if ((0, _lock_handler.checkLock)() == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			var l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
			// JWT expected either in Bearer or JWT header
			if (l_token_from_header.startsWith('Bearer ')) {
				l_token_from_header = l_token_from_header.slice(7, token.length);
			}
			if (l_token_from_header.startsWith('JWT ')) {
				l_token_from_header = l_token_from_header.slice(4, token.length);
			}

			if (l_token_from_header) {
				_jsonwebtoken2.default.verify(l_token_from_header, _config2.default.jwtSecret, function (err, decoded) {
					if (err) {
						(0, _lock_handler.incrementLockCount)();
						return p_res.json(_config2.default.signalsFrontendBackend.tokenNotValid);
					} else {
						//resetLockCount();
						var l_response_json = _config2.default.signalsFrontendBackend.tokenValid;
						l_response_json['email'] = decoded.email;
						return p_res.json(l_response_json);
					};
				});
			} else {
				(0, _lock_handler.incrementLockCount)();
				return p_res.json(_config2.default.signalsFrontendBackend.tokenNotSupplied);
			}
		}
	}, {
		key: 'login',
		value: function login(p_req, p_res) {
			var l_email = p_req.body.email;
			var l_password = p_req.body.password;
			var l_params = [];
			l_params << l_email;
			var l_user_data = _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			var l_hashed_pwd_from_db = l_user_data ? nvl(l_user_data['encrypted_password'], "xx") : "xx";
			//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
			_bcrypt2.default.compare(l_password, l_hashed_pwd_from_db, function (err, res) {
				if (res) {
					(0, _lock_handler.resetLockCount)();
					var l_retval_as_json = _config2.default.signalsFrontendBackend.authenticationSuccessful;
					l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: l_user_data['email'] }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
					return p_res.json(l_retval_as_json);
				} else {
					(0, _lock_handler.incrementLockCount)();
					return p_res.json(_config2.default.signalsFrontendBackend.wrongPassword);
				}
			});
		}
	}, {
		key: 'generateResetPwdToken',
		value: function generateResetPwdToken(p_req, p_res) {
			if ((0, _lock_handler.checkLock)() == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			var l_email = p_req.body.email;
			var l_params = [];
			l_params << l_email;
			var l_user_data = _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			if (l_user_data.length < 1) {
				(0, _lock_handler.incrementLockCount)();
				return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
			};
			var l_retval_as_json = _config2.default.signalsFrontendBackend.pwdResetTokenGenerated;
			var l_second_token = Math.ceil(Math.random() * 1000000000).toString();
			var l_now_str = _dateAndTime2.default.format(new Date(), 'YYYYMMDDHHmmss');
			var l_params2 = [];
			l_params2 << l_second_token;
			l_params2 << l_now_str;
			l_params2 << l_email;
			_database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.updateResetPasswordSecondToken, l_params2);
			l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({
				userEMail: l_user_data['email']
			}, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpirePasswordReset });
			var l_email_body = _config2.default.passwordResetEMail.replace("[TAG_CODE]", l_second_token.toString()).replace("[TAG_USER]", nvl(l_user_data[0]["name"], "") + " " + (nvl(l_user_data[0]["midname"], "").length == 0 ? "" : l_user_data[0]["midname"] + " ") + nvl(l_user_data[0]["surname"], ""));
			var l_mail_result = _mailer2.default.sendMail(_config2.default.passwordResetEMailFrom, l_email, _config2.default.passwordResetEMailSubject, "", l_email_body);
			if (l_mail_result == "OK") return p_res.json(l_retval_as_json);else return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
		}
	}, {
		key: 'resetPwd',
		value: function resetPwd(p_req, p_res) {
			if ((0, _lock_handler.checkLock)() == "LOCKED") return p_res.json(_config2.default.signalsFrontendBackend.locked);
			var l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
			// JWT expected either in Bearer or JWT header
			if (l_token_from_header.startsWith('Bearer ')) {
				l_token_from_header = l_token_from_header.slice(7, token.length);
			} else if (l_token_from_header.startsWith('JWT ')) {
				l_token_from_header = l_token_from_header.slice(4, token.length);
			} else {
				return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
			}

			if (l_token_from_header) {
				_jsonwebtoken2.default.verify(l_token_from_header, _config2.default.jwtSecret, function (err, decoded) {
					if (err) {
						return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
					} else {
						var l_email = decoded.userEMail;
						var l_saved_token_rows = _database_action_mysql2.default.execute_select(_sqls2.default.readResetPasswordSecondToken, l_params);
						if (l_saved_token_rows.length < 1) {
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
						};
						var l_saved_token_from_user = p_req.body.email;
						if (l_saved_token_rows[0]['ResetPasswordSecondToken'] != l_saved_token_from_user) {
							(0, _lock_handler.incrementLockCount)();
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
						};
						if (Number(l_saved_token_rows[0]['ResetPasswordSecondTokenValidFrom']) + _config2.default.passwordResetSecondTokenExpire > Number(_dateAndTime2.default.format(new Date(), 'YYYYMMDDHHmmss'))) {
							(0, _lock_handler.incrementLockCount)();
							return p_res.json(_config2.default.signalsFrontendBackend.pwdResetTokenExpired);
						};
						// Now password can be updated
						var l_plain_password = p_req.body.password;
						_bcrypt2.default.hash(myPlaintextPassword, saltRounds, function (err, hash) {
							// Store hash in your password DB.
							var l_params = [];
							l_params << l_email;
							l_params << hash;
							var l_update_result = _database_action_mysql2.default.execute_updatedeleteinsert(updateEncryptedPassword, l_params);
							if (l_update_result == "OK") {
								(0, _lock_handler.resetLockCount)();
								var l_retval_as_json = _config2.default.signalsFrontendBackend.pwdResetCompleted;
								l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ email: l_user_data['email'] }, _config2.default.jwtSecret, { expiresIn: _config2.default.jwtExpire });
								return p_res.json(l_retval_as_json);
							} else {
								(0, _lock_handler.incrementLockCount)();
								return p_res.json(_config2.default.signalsFrontendBackend.pwdResetError);
							}
						});
					};
				});
				//Should be completed asyncronously within bcrypt
			} else {
				(0, _lock_handler.incrementLockCount)();
				return p_res.json(_config2.default.signalsFrontendBackend.tokenNotSupplied);
			}
		}
	}, {
		key: 'allOtherURLs',
		value: function allOtherURLs() {
			return p_res.json(_config2.default.signalsFrontendBackend.wrongAPICall);
		}
	}]);

	return requestHandlers;
}();

exports.default = requestHandlers;