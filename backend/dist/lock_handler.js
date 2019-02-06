'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.incrementLockCount = incrementLockCount;
exports.resetLockCount = resetLockCount;
exports.checkLock = checkLock;
exports.checkIPBasedFrequentUserGeneration = checkIPBasedFrequentUserGeneration;
exports.modifyIPBasedUserGenerationTime = modifyIPBasedUserGenerationTime;

var _database_action_mysql = require('./database_action_mysql.js');

var _database_action_mysql2 = _interopRequireDefault(_database_action_mysql);

var _generic_library = require('./generic_library.js');

var _sqls = require('./sqls.js');

var _sqls2 = _interopRequireDefault(_sqls);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function incrementLockCount() {
	var p_ip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var p_user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


	// increment lock count
	var incrementLockCount_ = async function incrementLockCount_(p_key, p_select_sql, p_update_sql, p_insert_sql) {
		var l_params = [];
		l_params.push(p_key);
		var l_prev_attempt_data = void 0;
		l_prev_attempt_data = await _database_action_mysql2.default.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) return await _database_action_mysql2.default.execute_updatedeleteinsert(p_update_sql, l_params);else return await _database_action_mysql2.default.execute_updatedeleteinsert(p_insert_sql, l_params);
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") incrementLockCount_(p_ip, _sqls2.default.lockIPSelect, _sqls2.default.lockIPUpdate, _sqls2.default.lockIPInsert);
	if ((0, _generic_library.nvl)(p_user, "x") != "x") incrementLockCount_(p_user, _sqls2.default.lockUserSelect, _sqls2.default.lockUserUpdate, _sqls2.default.lockUserInsert);
}

async function resetLockCount() {
	var p_ip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var p_user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	//clear lock-time in DB
	var resetLockCount_ = async function resetLockCount_(p_key, p_update_sql) {
		var l_params = [];
		l_params.push(p_key);
		await _database_action_mysql2.default.execute_updatedeleteinsert(p_update_sql, l_params);
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") await resetLockCount_(p_ip, _sqls2.default.lockIPReset);
	if ((0, _generic_library.nvl)(p_user, "x") != "x") await resetLockCount_(p_user, _sqls2.default.lockUserReset);
}

async function checkLock(p_ip) {
	var p_user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

	// if now > last_attempt + config.lockedStateDuration => reset lock, not locked
	// if count_unsuccessful_attempts < config.lockUnsuccessfulAttemptCount => not locked
	// else locked
	var l_locked = false;
	var checkLock_ = async function checkLock_(p_key, p_select_sql) {
		var l_params = [];
		l_params.push(p_key);
		var l_prev_attempt_data = await _database_action_mysql2.default.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) {
			var l_now = (0, _generic_library.getUTCTimeAsString)();
			var l_last_attempt = Number(l_prev_attempt_data[0]['last_attempt'] + "000");
			if (l_now > l_last_attempt + _config2.default.lockedStateDuration) return "RESET";
			var l_count_unsuccessful_attempts = Number(l_prev_attempt_data[0]['count_unsuccessful_attempts']);
			if (l_count_unsuccessful_attempts > _config2.default.lockUnsuccessfulAttemptCount) l_locked = true;
		} else {
			// do nothing
		};
	};
	if ((0, _generic_library.nvl)(p_ip, "x") != "x") {
		if ((await checkLock_(p_ip, _sqls2.default.lockIPSelect)) == "RESET") resetLockCount(p_ip, '');
	};
	if ((0, _generic_library.nvl)(p_user, "x") != "x") {
		if ((await checkLock_(p_user, _sqls2.default.lockUserSelect)) == "RESET") resetLockCount('', p_user);
	};

	return l_locked ? "LOCKED" : "NOT LOCKED";
}

async function checkIPBasedFrequentUserGeneration(p_ip) {
	var l_locked = false;
	var l_params = [];
	l_params.push(p_ip);
	var l_prev_attempt_data = await _database_action_mysql2.default.execute_select(_sqls2.default.ipBasedNewUserSignupSelect, l_params);
	if (l_prev_attempt_data.length > 0) {
		var l_now = (0, _generic_library.getUTCTimeAsString)();
		var l_last_user_generated_time = Number(l_prev_attempt_data[0]['last_alast_user_generated_timettempt']);
		if (l_now < l_last_user_generated_time + _config2.default.ipBasedNewUserSignupLockDuration) l_locked = true;
	};
	return l_locked ? "LOCKED" : "NOT LOCKED";
}

async function modifyIPBasedUserGenerationTime(p_ip) {
	var l_params = [];
	l_params.push(p_ip);
	try {
		await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.ipBasedNewUserSignupInsert, l_params);
	} catch (err) {
		await _database_action_mysql2.default.execute_updatedeleteinsert(_sqls2.default.ipBasedNewUserSignupUpdate, l_params);
	}
}