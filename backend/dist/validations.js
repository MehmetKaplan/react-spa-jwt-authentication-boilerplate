'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var validations = function () {
	function validations() {
		_classCallCheck(this, validations);
	}

	_createClass(validations, [{
		key: 'email',
		value: function email(p_email, p_email_token) {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!regex.test(p_email)) return "NOK";
			var l_params = [];
			l_params << p_email;
			var l_emailcount_rows = _database_action_mysql2.default.execute_select(sqls.emailCount, l_params);
			if (l_emailcount_rows[0]['emailcount'] != 0) return "NOK";
			var l_params2 = [];
			l_params2 << p_email;
			var l_token_rows = _database_action_mysql2.default.execute_select(sqls.emailValidationTokenRead, l_params2);
			if (l_token_rows.length != 1) return "NOK";
			if (p_email_token != l_token_rows[0]['validation_token']) return "NOK";
			return "OK";
		}
	}, {
		key: 'password',
		value: function password(p_password) {
			var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
			var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
			var regex = _config2.default.passwordStrengthStrong ? strongRegex : mediumRegex;
			if (!regex.test(p_password)) return "NOK";
			return "OK";
		}
	}, {
		key: 'gender',
		value: function gender(p_gender) {
			if (![0, 1, 2].includes(p_gender)) return "NOK";
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
	}]);

	return validations;
}();

exports.default = validations;