'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _sqls = require('./sqls.js');

var _sqls2 = _interopRequireDefault(_sqls);

var _lock_handler = require('./lock_handler.js');

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

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
						l_response_json['user'] = decoded.user;
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
			var l_username = p_req.body.username;
			var l_password = p_req.body.password;
			var l_params = [];
			l_params << l_username;
			var l_user_data = _database_action_mysql2.default.execute_select(_sqls2.default.getAllAttributesOfAUser, l_params);
			var l_hashed_pwd_from_db = l_user_data ? nvl(l_user_data['encrypted_password'], "xx") : "xx";
			//sqlt is incorporated in l_hashed_pwd_from_db so bcrypt does not need it again
			_bcrypt2.default.compare(l_password, l_hashed_pwd_from_db, function (err, res) {
				if (res) {
					(0, _lock_handler.resetLockCount)();
					var l_retval_as_json = _config2.default.signalsFrontendBackend.authenticationSuccessful;
					l_retval_as_json['JWT'] = _jsonwebtoken2.default.sign({ user: l_user_data['email'] }, _config2.default.secret, { expiresIn: _config2.default.jwtExpire });
					p_res.json(l_retval_as_json);
				} else {
					(0, _lock_handler.incrementLockCount)();
					return p_res.json(_config2.default.signalsFrontendBackend.wrongPassword);
				}
			});
		}
	}, {
		key: 'generateResetURL',
		value: function generateResetURL(p_req, p_res) {}
	}, {
		key: 'confirmResetURL',
		value: function confirmResetURL(p_req, p_res) {}
	}, {
		key: 'actionResetURL',
		value: function actionResetURL(p_req, p_res) {}
	}, {
		key: 'allOtherURLs',
		value: function allOtherURLs() {
			return p_res.json(_config2.default.signalsFrontendBackend.wrongAPICall);
		}
	}]);

	return requestHandlers;
}();

exports.default = requestHandlers;