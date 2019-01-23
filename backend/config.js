export default  {
	jwtSecret: process.env.JWT_SECRET,
	jwtExpire: '24h', // expires in 24 hours
	jwtExpirePasswordReset: '1h', // expires in 1 hour
	passwordResetSecondTokenExpire: 3600, //seconds, align with jwtExpirePasswordReset
	databaseParameters: {
		host     : process.env.MYSQL_HOST,
		user     : process.env.MYSQL_USER,
		password : process.env.MYSQL_PASSWORD,
		database : 'AuthUsersDB'
	},
	nodemailerTransporterParameters: {
		service: process.env.GENERIC_MAIL_SERVICE,
		auth: {
			user: process.env.GENERIC_MAIL_USER,
			pass: process.env.GENERIC_MAIL_PASSWORD
		}
	},
	defaultPort: 8000,
	maxAllowedRetry: 10,
	bcryptSaltRounds: 10,
	lockedStateDurationMinutes: 10,
	signalsFrontendBackend: {
		tokenValid:               {result: "OK",  		 message: 'Token is valid'},
		tokenNotValid:            {result: "NOK",  		 message: 'Token is not valid'},
		tokenNotSupplied:         {result: "NOK",  		 message: 'Token not supplied'},
		locked:                   {result: "LOCKED",		 message: 'Activity locked'},
		wrongAPICall:             {result: "NOK",  		 message: 'You are doing something wrong'},
		wrongPassword:            {result: "NOK",  		 message: 'Wrong username or password '},
		authenticationSuccessful: {result: "OK",  		 message: 'Authentication is successful'},
		pwdResetTokenGenerated:   {result: "OK",  		 message: 'Password Reset Token is generated'},
		pwdResetError:            {result: "NOK",  		 message: 'Action can not be completed'},
		pwdResetTokenExpired:     {result: "NOK",  		 message: 'The token had expired, please retry'},
		pwdResetCompleted:        {result: "OK",  		 message: 'Password reset is completed'},
	},
	passwordResetEMailSubject: "Password Reset Request",
	passwordResetEMail: "\
		<p>Dear [TAG_USER],</p>\
		<p>We just recently received a password reset request.</p>\
		<p>If you are not the one who made the request please ignore this email.</p>\
		<p>In order to reset your password, use below code:</p>\
		<p><span style=\"background-color: #ffff00;\"><strong>[TAG_CODE]</strong></span></p>\
		<p>Best Regards,</p>\
		<p>&nbsp;</p>",
	passwordResetEMailFrom: "Password Reset <please_do_not_reply@pleasedonotreply.co>",
};


