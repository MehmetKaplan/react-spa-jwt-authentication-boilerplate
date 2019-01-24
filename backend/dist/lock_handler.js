'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.incrementLockCount = incrementLockCount;
exports.resetLockCount = resetLockCount;
exports.checkLock = checkLock;

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

var _generic_library = require('./generic_library.js');

var _sqls = require('./sqls.js');

var _sqls2 = _interopRequireDefault(_sqls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function incrementLockCount() {
	var p_ip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var p_user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	// increment lock count
	var incrementLockCount_ = function incrementLockCount_(p_key, p_select_sql, p_update_sql, p_insert_sql) {
		var l_params = [];
		l_params << p_key;
		var l_prev_attempt_data = _database_action_mysql2.default.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) return _database_action_mysql2.default.execute_updatedeleteinsert(p_update_sql, l_params);else return _database_action_mysql2.default.execute_updatedeleteinsert(p_insert_sql, l_params);
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") incrementLockCount_(p_ip, _sqls2.default.lockIPSelect, _sqls2.default.lockIPUpdate, _sqls2.default.lockIPInsert);
	if ((0, _generic_library.nvl)(p_user, "x") != "x") incrementLockCount_(p_user, _sqls2.default.lockUserSelect, _sqls2.default.lockUserUpdate, _sqls2.default.lockUserInsert);
}

function resetLockCount() {
	var p_ip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var p_user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	//clear lock-time in DB
	var resetLockCount_ = function resetLockCount_(p_key, p_update_sql) {
		var l_params = [];
		l_params << p_key;
		_database_action_mysql2.default.execute_updatedeleteinsert(p_update_sql, l_params);
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") resetLockCount_(p_ip, _sqls2.default.lockIPReset);
	if ((0, _generic_library.nvl)(p_user, "x") != "x") resetLockCount_(p_user, _sqls2.default.lockUserReset);
}

function checkLock() {
	// if now > last_attempt + config.lockedStateDuration => reset lock, not locked
	// if count_unsuccessful_attempts < config.lockUnsuccessfulAttemptCount => not locked
	// else locked
	var l_locked = false;
	var checkLock_ = function checkLock_(p_key, p_select_sql) {
		var l_params = [];
		l_params << p_key;
		var l_prev_attempt_data = _database_action_mysql2.default.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) {
			var l_now = Number(date.format(new Date(), 'YYYYMMDDHHmmss'));
			var l_last_attempt = Number(l_prev_attempt_data[0]['last_attempt']);
			if (l_now > l_last_attempt + config.lockedStateDuration) return "RESET";
			var l_count_unsuccessful_attempts = Number(l_prev_attempt_data[0]['count_unsuccessful_attempts']);
			if (l_count_unsuccessful_attempts > config.lockUnsuccessfulAttemptCount) l_locked = true;
		} else {
			// do nothing
		};
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") {
		if (checkLock_(p_ip, _sqls2.default.lockIPSelect) == "RESET") resetLockCount(p_ip, '');
	};
	if ((0, _generic_library.nvl)(p_user, "x") != "x") {
		if (checkLock_(p_user, _sqls2.default.lockUserSelect) == "RESET") resetLockCount('', p_user);
	};

	return l_locked ? "LOCKED" : "NOT LOCKED";
}