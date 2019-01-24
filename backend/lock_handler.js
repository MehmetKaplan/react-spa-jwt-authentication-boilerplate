import databaseActionMySQL from './database_action_mysql.js';
import {nvl} from './generic_library.js';
import sqls from './sqls.js';

export function incrementLockCount(p_ip = '', p_user = ''){
	// increment lock count
	let incrementLockCount_ = (p_key, p_select_sql, p_update_sql, p_insert_sql) => {
		let l_params = [];
		l_params << p_key;
		let l_prev_attempt_data = databaseActionMySQL.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) return databaseActionMySQL.execute_updatedeleteinsert(p_update_sql, l_params);
		else return databaseActionMySQL.execute_updatedeleteinsert(p_insert_sql, l_params);
	};
	if (nvl(p_ip, "x") != "x") incrementLockCount_(p_ip, sqls.lockIPSelect, sqls.lockIPUpdate, sqls.lockIPInsert);
	if (nvl(p_user, "x") != "x") incrementLockCount_(p_user, sqls.lockUserSelect, sqls.lockUserUpdate, sqls.lockUserInsert);
}

export function resetLockCount (p_ip = '', p_user = ''){
	//clear lock-time in DB
	let resetLockCount_ = (p_key, p_update_sql) => {
		let l_params = [];
		l_params << p_key;
		databaseActionMySQL.execute_updatedeleteinsert(p_update_sql, l_params);
	};
	if (nvl(p_ip, "x") != "x") resetLockCount_(p_ip, sqls.lockIPReset);
	if (nvl(p_user, "x") != "x") resetLockCount_(p_user, sqls.lockUserReset);
}

export function checkLock (){
	// if now > last_attempt + config.lockedStateDuration => reset lock, not locked
	// if count_unsuccessful_attempts < config.lockUnsuccessfulAttemptCount => not locked
	// else locked
	let l_locked = false;
	let checkLock_ = (p_key, p_select_sql) => {
		let l_params = [];
		l_params << p_key;
		let l_prev_attempt_data = databaseActionMySQL.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) {
			let l_now = Number(date.format(new Date(), 'YYYYMMDDHHmmss'));
			let l_last_attempt = Number(l_prev_attempt_data[0]['last_attempt']);
			if (l_now > l_last_attempt + config.lockedStateDuration) return "RESET";
			let l_count_unsuccessful_attempts = Number(l_prev_attempt_data[0]['count_unsuccessful_attempts']);
			if (l_count_unsuccessful_attempts > config.lockUnsuccessfulAttemptCount) l_locked = true;
		}
		else {
			// do nothing
		};
	};
	if (nvl(p_ip, "x") != "x")  {
		if (checkLock_(p_ip, sqls.lockIPSelect) == "RESET") resetLockCount (p_ip, '')
	};
	if (nvl(p_user, "x") != "x") {
		if (checkLock_(p_user, sqls.lockUserSelect) == "RESET") resetLockCount ('', p_user)
	};

	return l_locked ?  "LOCKED" : "NOT LOCKED";
}
