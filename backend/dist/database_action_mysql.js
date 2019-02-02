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

var databaseActionMySQL_ = function () {
	function databaseActionMySQL_() {
		_classCallCheck(this, databaseActionMySQL_);
	}

	_createClass(databaseActionMySQL_, [{
		key: 'execute_select_',
		value: function execute_select_(p_db_conn, p_sql) {
			var p_parameters_as_array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

			return new Promise(function (resolve) {
				p_db_conn.query(p_sql, p_parameters_as_array, function (err, rows, fields) {
					if (err) throw err;
					resolve(rows);
				});
			});
		}
	}, {
		key: 'execute_select',
		value: async function execute_select(p_sql) {
			var p_parameters_as_array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var l_db_conn = _mysql2.default.createConnection(_config2.default.databaseParameters);
			l_db_conn.connect();
			var l_retval_as_array_of_hashes = await execute_select_(l_db_conn, p_sql, p_parameters_as_array);
			l_db_conn.end();
			return l_retval_as_array_of_hashes;
		}
	}, {
		key: 'execute_updatedeleteinsert_',
		value: function execute_updatedeleteinsert_(p_db_conn, p_sql) {
			var p_parameters_as_array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

			return new Promise(function (resolve) {
				p_db_conn.query(p_sql, p_parameters_as_array, function (err, rows, fields) {
					if (err) throw err;
					resolve(rows);
				});
			});
		}
	}, {
		key: 'execute_updatedeleteinsert',
		value: async function execute_updatedeleteinsert(p_sql) {
			var p_parameters_as_array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var l_db_conn = _mysql2.default.createConnection(_config2.default.databaseParameters);
			l_db_conn.connect();
			var l_retval_as_array_of_hashes = await execute_select_(l_db_conn, p_sql, p_parameters_as_array);
			l_db_conn.end();
			return "OK";
		}
	}]);

	return databaseActionMySQL_;
}();

;

//All to use the single instance of this library - singleton pattern
var databaseActionMySQL = new databaseActionMySQL_();

exports.default = databaseActionMySQL;