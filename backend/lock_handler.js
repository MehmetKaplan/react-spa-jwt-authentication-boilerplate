import databaseActionMySQL from './database_action_mysql.js';
import {nvl, getUTCTimeAsString} from './generic_library.js';
import sqls from './sqls.js';
import config from './config';

export async function incrementLockCount(p_ip = '', p_user = ''){

	// increment lock count
	let incrementLockCount_ = async (p_key, p_select_sql, p_update_sql, p_insert_sql) => {
		let l_params = [];
		l_params.push(p_key);
		let l_prev_attempt_data;
		l_prev_attempt_data = await databaseActionMySQL.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) return (await databaseActionMySQL.execute_updatedeleteinsert(p_update_sql, l_params));
		else return (await databaseActionMySQL.execute_updatedeleteinsert(p_insert_sql, l_params));
	};
	if (nvl(p_ip,   "x") != "x") incrementLockCount_(p_ip,   sqls.lockIPSelect,   sqls.lockIPUpdate,   sqls.lockIPInsert  );
	if (nvl(p_user, "x") != "x") incrementLockCount_(p_user, sqls.lockUserSelect, sqls.lockUserUpdate, sqls.lockUserInsert);
}

export async function resetLockCount(p_ip = '', p_user = ''){
	//clear lock-time in DB
	let resetLockCount_ = async (p_key, p_update_sql) => {
		let l_params = [];
		l_params.push(p_key);
		await databaseActionMySQL.execute_updatedeleteinsert(p_update_sql, l_params);
	};
	if (nvl(p_ip, "x") != "x") await resetLockCount_(p_ip, sqls.lockIPReset);
	if (nvl(p_user, "x") != "x") await resetLockCount_(p_user, sqls.lockUserReset);
}

export async function checkLock(p_ip, p_user = ""){
	// if now > last_attempt + config.lockedStateDuration => reset lock, not locked
	// if count_unsuccessful_attempts < config.lockUnsuccessfulAttemptCount => not locked
	// else locked
	let l_locked = false;
	let checkLock_ = async (p_key, p_select_sql) => {
		let l_params = [];
		l_params.push(p_key);
		let l_prev_attempt_data = await databaseActionMySQL.execute_select(p_select_sql, l_params);
		if (l_prev_attempt_data.length > 0) {
			let l_now = getUTCTimeAsString();
			let l_last_attempt = Number(l_prev_attempt_data[0]['last_attempt'] + "000");
			if (l_now > l_last_attempt + config.lockedStateDuration) return "RESET";
			let l_count_unsuccessful_attempts = Number(l_prev_attempt_data[0]['count_unsuccessful_attempts']);
			if (l_count_unsuccessful_attempts > config.lockUnsuccessfulAttemptCount) l_locked = true;
		}
		else {
			// do nothing
		};
	};
	if (nvl(p_ip, "x") != "x")  {
		if (await checkLock_(p_ip, sqls.lockIPSelect) == "RESET") resetLockCount (p_ip, '')
	};
	if (nvl(p_user, "x") != "x") {
		if (await checkLock_(p_user, sqls.lockUserSelect) == "RESET") resetLockCount ('', p_user)
	};

	return l_locked ?  "LOCKED" : "NOT LOCKED";
}

export async function checkIPBasedFrequentUserGeneration(p_ip){
	let l_locked = false;
	let l_params = [];
	l_params.push(p_ip);
	let l_prev_attempt_data = await databaseActionMySQL.execute_select(sqls.ipBasedNewUserSignupSelect, l_params);
	if (l_prev_attempt_data.length > 0) {
		let l_now = getUTCTimeAsString();
		let l_last_user_generated_time = Number(l_prev_attempt_data[0]['last_alast_user_generated_timettempt']);
		if (l_now < l_last_user_generated_time + config.ipBasedNewUserSignupLockDuration) l_locked = true;
	};
	return l_locked ?  "LOCKED" : "NOT LOCKED";
}

export async function modifyIPBasedUserGenerationTime(p_ip){
	let l_params = [];
	l_params.push(p_ip);
	let l_prev = await databaseActionMySQL.execute_select(sqls.ipBasedNewUserSignupSelect, l_params);
	if (l_prev.length > 0) await databaseActionMySQL.execute_updatedeleteinsert(sqls.ipBasedNewUserSignupUpdate, l_params);
	else await databaseActionMySQL.execute_updatedeleteinsert(sqls.ipBasedNewUserSignupInsert, l_params);
}
