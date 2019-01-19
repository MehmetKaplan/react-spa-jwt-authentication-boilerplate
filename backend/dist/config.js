'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	jwtSecret: process.env.JWT_SECRET,
	jwtExpire: '24h', // expires in 24 hours
	databaseParameters: {
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: 'AuthUsersDB'
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
		tokenValid: { result: "OK", message: 'Token is valid' },
		tokenNotValid: { result: "NOK", message: 'Token is not valid' },
		tokenNotSupplied: { result: "NOK", message: 'Token not supplied' },
		locked: { result: "LOCKED", message: 'Activity locked' },
		wrongAPICall: { result: "NOK", message: 'You are doing something wrong' },
		wrongPassword: { result: "NOK", message: 'Wrong username or password ' },
		authenticationSuccessful: { result: "OK", message: 'Authentication is successful' }
	}
};