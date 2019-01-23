export default  {
	getAllAttributesOfAUser: "select * from AuthUsersDB.users where email = ? ",
	updateResetPasswordSecondToken: "update AuthUsersDB.users set ResetPasswordSecondToken = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
	readResetPasswordSecondToken:   "select ResetPasswordSecondToken, ResetPasswordSecondTokenValidFrom from AuthUsersDB.users where email = ? ",
	updateEncryptedPassword: "update AuthUsersDB.users set encrypted_password = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
	signUp: "insert into AuthUsersDB.users (id, generated_at, email, encrypted_password, name, midname, surname, gender_id, birthday, phone) select ifnull(max(x.id), 0) + 1, current_timestamp, ?, ?, ?, ?, ?, ?, str_to_date(?, '%Y%m%d%H%i%s'), ? from AuthUsersDB.users x ",
	emailCount: "select count(*) emailcount from AuthUsersDB.users x where email = 'x' ",
	emailValidationTokenClear: "delete from AuthUsersDB.email_validation where email = ? ",
	emailValidationTokenSet: "insert into AuthUsersDB.email_validation(email, validation_token) values (?, ?) ",
	emailValidationTokenRead: "select validation_token from AuthUsersDB.email_validation where email = ? ",
}
