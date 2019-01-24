"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	getAllAttributesOfAUser: "select * from AuthUsersDB.users where email = ? ",
	updateResetPasswordSecondToken: "update AuthUsersDB.users set ResetPasswordSecondToken = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
	readResetPasswordSecondToken: "select ResetPasswordSecondToken, ResetPasswordSecondTokenValidFrom from AuthUsersDB.users where email = ? ",
	updateEncryptedPassword: "update AuthUsersDB.users set encrypted_password = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
	signUp: "insert into AuthUsersDB.users (id, generated_at, email, encrypted_password, name, midname, surname, gender_id, birthday, phone) select ifnull(max(x.id), 0) + 1, current_timestamp, ?, ?, ?, ?, ?, ?, str_to_date(?, '%Y%m%d%H%i%s'), ? from AuthUsersDB.users x ",
	emailCount: "select count(*) emailcount from AuthUsersDB.users x where email = 'x' ",
	emailValidationTokenClear: "delete from AuthUsersDB.email_validation where email = ? ",
	emailValidationTokenSet: "insert into AuthUsersDB.email_validation(email, validation_token) values (?, ?) ",
	emailValidationTokenRead: "select validation_token from AuthUsersDB.email_validation where email = ? ",
	updateEMail: "update AuthUsersDB.users set email = ? where email = ? ",
	updateData: "update AuthUsersDB.users set name = ?, midname = ?, surname = ?, gender_id = ?, birthday = ?, phone = ? where email = ? ",
	updatePassword: "update AuthUsersDB.users set encrypted_password = ? where email = ? ",
	lockIPInsert: "insert into AuthUsersDB.ip_based_lock_tracks (ip, count_unsuccessful_attempts, last_attempt) values (?, 1, now())",
	lockIPUpdate: "update AuthUsersDB.ip_based_lock_tracks set count_unsuccessful_attempts = count_unsuccessful_attempts + 1 where ip = ? ",
	lockIPSelect: "select ip, count_unsuccessful_attempts, date_format(last_attempt, '%Y%m%d%H%i%s') last_attempt from AuthUsersDB.ip_based_lock_tracks where ip = ? ",
	lockIPReset: "update AuthUsersDB.ip_based_lock_tracks set count_unsuccessful_attempts = 0, last_attempt = null where ip = ?",
	lockUserInsert: "insert into AuthUsersDB.user_based_lock_tracks (email, count_unsuccessful_attempts, last_attempt) values (?, 1, now())",
	lockUserUpdate: "update AuthUsersDB.user_based_lock_tracks set count_unsuccessful_attempts = count_unsuccessful_attempts + 1 where email = ?",
	lockUserSelect: "select email, count_unsuccessful_attempts, date_format(last_attempt, '%Y%m%d%H%i%s') last_attempt from AuthUsersDB.user_based_lock_tracks where email = ? ",
	lockUserReset: "update AuthUsersDB.user_based_lock_tracks set count_unsuccessful_attempts = 0, last_attempt = null where email = ?"
};