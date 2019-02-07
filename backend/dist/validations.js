'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

var _sqls = require('./sqls.js');

var _sqls2 = _interopRequireDefault(_sqls);

var _generic_library = require('./generic_library.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var validations_ = function () {
	function validations_() {
		_classCallCheck(this, validations_);

		this.checkJWT_ = this.checkJWT_.bind(this);
	}

	_createClass(validations_, [{
		key: 'email',
		value: async function email(p_email) {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!regex.test(p_email)) return "NOK";
			return "OK";
		}
	}, {
		key: 'emailtoken',
		value: async function emailtoken(p_email, p_email_token) {
			var l_params = [];
			l_params.push(p_email);
			var l_token_rows = await _database_action_mysql2.default.execute_select(_sqls2.default.emailValidationTokenRead, l_params);
			if (l_token_rows.length != 1) return "NOK";
			if (p_email_token != l_token_rows[0]['validation_token']) return "NOK";
			return "OK";
		}
	}, {
		key: 'emailExistence',
		value: async function emailExistence(p_email) {
			var l_params = [];
			l_params.push(p_email);
			var l_emailcount_rows = await _database_action_mysql2.default.execute_select(_sqls2.default.emailCount, l_params);
			if (Number(l_emailcount_rows[0]['emailcount']) == 0) return "NOK";
			return "OK";
		}
	}, {
		key: 'emailNotExistence',
		value: async function emailNotExistence(p_email) {
			var l_params = [];
			l_params.push(p_email);
			var l_emailcount_rows = await _database_action_mysql2.default.execute_select(_sqls2.default.emailCount, l_params);
			if (Number(l_emailcount_rows[0]['emailcount'] != 0)) return "NOK";
			return "OK";
		}
	}, {
		key: 'password',
		value: function password(p_password, p_password2) {
			var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
			var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
			var regex = _config2.default.passwordStrengthStrong ? strongRegex : mediumRegex;
			if (!regex.test(p_password)) return "NOK";
			if ((0, _generic_library.nvl)(p_password, "x") != (0, _generic_library.nvl)(p_password2, "y")) return "NOK";
			return "OK";
		}
	}, {
		key: 'gender',
		value: function gender(p_gender) {
			if (!["1", "2", "3"].includes(p_gender)) return "NOK";
			return "OK";
		}
	}, {
		key: 'birthday',
		value: function birthday(p_birthday) {
			return "OK";
		}
	}, {
		key: 'phone',
		value: function phone(p_phone) {
			return "OK";
		}
	}, {
		key: 'checkJWT_',
		value: function checkJWT_(p_req) {
			return new Promise(function (resolve) {
				var l_token_from_header = p_req.headers['x-access-token'] || p_req.headers['authorization'];
				if (l_token_from_header.startsWith('Bearer ')) l_token_from_header = l_token_from_header.slice(7, l_token_from_header.length);
				if (l_token_from_header.startsWith('JWT ')) l_token_from_header = l_token_from_header.slice(4, l_token_from_header.length);
				if (l_token_from_header) {
					_jsonwebtoken2.default.verify(l_token_from_header, _config2.default.jwtSecret, function (err, decoded) {
						if (err) {
							resolve({});
						} else {
							resolve(decoded);
						};
					});
				};
			});
		}
	}, {
		key: 'checkJWT',
		value: async function checkJWT(p_req) {
			var l_retval = await this.checkJWT_(p_req);
			return l_retval;
		}
	}]);

	return validations_;
}();

var validations = new validations_();
exports.default = validations;