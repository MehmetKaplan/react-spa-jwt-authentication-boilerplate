export default  {
	getAllAttributesOfAUser: "select * from AuthUsersDB.users where email = ? ",
	updateResetPasswordSecondToken: "update AuthUsersDB.users set ResetPasswordSecondToken = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
	readResetPasswordSecondToken:   "select ResetPasswordSecondToken, ResetPasswordSecondTokenValidFrom from AuthUsersDB.users where email = ? ",
	updateEncryptedPassword: "update AuthUsersDB.users set encrypted_password = ?, ResetPasswordSecondTokenValidFrom = ? where email = ? ",
}
