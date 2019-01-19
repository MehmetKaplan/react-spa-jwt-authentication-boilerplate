'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var databaseActionMySQL = function () {
	function databaseActionMySQL() {
		_classCallCheck(this, databaseActionMySQL);

		this.connection = _mysql2.default.createConnection(_config2.default.databaseParameters);
	}

	_createClass(databaseActionMySQL, [{
		key: 'execute_select',
		value: function execute_select(p_sql) {
			var p_parameters_as_array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			this.connection.connect();
			var l_retval_as_array_of_hashes = this.connection.query(p_sql, p_parameters_as_array, function (err, rows, fields) {
				if (l_err) throw l_err;
				return l_rows;
			});
			this.connection.end();
			return l_retval_as_array_of_hashes;
		}
	}, {
		key: 'execute_updatedeleteinsert',
		value: function execute_updatedeleteinsert(p_sql) {
			var p_parameters_as_array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			this.connection.connect();
			var l_retval_as_array_of_hashes = this.connection.query(p_sql, function (err, rows, fields) {
				if (l_err) throw l_err;
			});
			this.connection.end();
			return "OK";
		}
	}]);

	return databaseActionMySQL;
}();

exports.default = databaseActionMySQL;