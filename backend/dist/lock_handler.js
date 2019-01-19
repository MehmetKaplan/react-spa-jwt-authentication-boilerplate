'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.incrementLockCount = incrementLockCount;
exports.resetLockCount = resetLockCount;
exports.checkLock = checkLock;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function incrementLockCount() {
	// increment lock count
	// if it exceeds config.maxAllowedRetry set lock-time in DB
}

function resetLockCount() {
	//clear lock-time in DB
}

function checkLock() {
	// if locktime is higher than now - config.lockedStateDurationMinutes minutesd return "LOCKED"
	/* else {
 	resetLockCount()
 	return "OK"
 }*/
}