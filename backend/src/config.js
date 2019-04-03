export default  {
	debugMode: true,
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
	lockedStateDuration: 600000, // miliseconds
	lockUnsuccessfulAttemptCount: 10,
	ipBasedNewUserSignupLockDuration: 600000, //miliseconds
	signalsFrontendBackend: {
		tokenValid:               			{result: "OK",  		message: 'Token is valid'},
		tokenNotValid:            			{result: "NOK",  		message: 'Token is not valid'},
		tokenNotSupplied:         			{result: "NOK",  		message: 'Token not supplied'},
		locked:                   			{result: "LOCKED",	message: 'Activity locked'},
		wrongAPICall:             			{result: "NOK",  		message: 'You are doing something wrong'},
		wrongPassword:            			{result: "NOK",  		message: 'Wrong username or password '},
		authenticationSuccessful: 			{result: "OK",  		message: 'Authentication is successful'},
		pwdResetTokenGenerated:   			{result: "OK",  		message: 'Password Reset Token is generated'},
		pwdResetError:            			{result: "NOK",  		message: 'Action can not be completed'},
		pwdResetTokenExpired:     			{result: "NOK",  		message: 'The token had expired, please retry'},
		pwdResetCompleted:        			{result: "OK",  		message: 'Password reset is completed'},
		signUpInvalidEmail:       			{result: "NOK",		message: 'Email can not be used'},
		passwordStrengthTestFailed:		{result: "NOK",   	message: 'Password strength test failed'},
		genderTValidationFailed:   		{result: "NOK",   	message: 'Gender value validation failed'},
		birthdayValidationFailed:  		{result: "NOK",   	message: 'Birthday alidation failed'},
		phoneValdiationFailed:     		{result: "NOK",   	message: 'Phone validation failed'},
		signUpGenericError:       			{result: "NOK",		message: 'Signup failed'},
		signUpSuccessful:       			{result: "OK", 		message: 'Signup successful'},
		emailValidationEMailSent:			{result: "OK", 		message: 'Email confirmation code sent'},
		eMailUpdated:                		{result: "OK", 		message: 'Email updated '},
		eMailValidationGenericError:		{result: "NOK",		message: 'EMail validation failed'},
		updateDataSuccessful:        		{result: "OK", 		message: 'Data updated '},
		updateDataFailed:           		{result: "NOK", 		message: 'Data could not be updated '},
		updatePasswordSuccessful:    		{result: "OK", 		message: 'Password updated '},
		updatePasswordFailed:       		{result: "NOK", 		message: 'Password could not be updated '},
		ipBasedFrequentUserGeneration:	{result: "NOK",       message: 'Suspected automated user generation '},
		socialLoginFailed:					{result: "NOK",       message: 'Social login failed '},
		socialSites:							{
			facebook: "FB",
			google: "google",
		},
	},
	passwordResetEMailSubject: "Password Reset Request",
	passwordResetEMail: "\
		<p>Dear [TAG_USER],</p>\
		<p>We just recently received a password reset request.</p>\
		<p>If you are not the one who made the request please ignore this email.</p>\
		<p>In order to reset your password, use below code:</p>\
		<p><span style=\"background-color: #ffff00; color: #ff0000;\"><strong>[TAG_CODE]</strong></span></p>\
		<p>Best Regards,</p>\
		<p>&nbsp;</p>",
	passwordResetEMailFrom: "Password Reset <please_do_not_reply@pleasedonotreply.co>",
	emailValidationEMailSubject: "Signup Email Confirmation Code",
	emailValidationEMail: " \
		<p>Hi there,</p> \
		<p>Here is the code that you can use to verify your email.</p> \
		<p><span style=\"background-color: #ffff00; color: #ff0000;\"><strong>[TAG_CODE]</strong></span></p> \
		<p>If it is not who requested the email validation, it means someone else is trying to use your email address. You can simply ignore this email.</p> \
		<p>Best Regards,</p> \
		<p>&nbsp;</p> \
	",
	emailValidationEMailFrom: "EMail Validation <please_do_not_reply@pleasedonotreply.co>",
	passwordStrengthStrong: false,
};


