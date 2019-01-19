import mysql from 'mysql';

export function incrementLockCount{
	// increment lock count
	// if it exceeds config.maxAllowedRetry set lock-time in DB
}

export function resetLockCount (){
	//clear lock-time in DB
}

export function checkLock (){
	// if locktime is higher than now - config.lockedStateDurationMinutes minutesd return "LOCKED"
	/* else {
		resetLockCount()
		return "OK"
	}*/
}


