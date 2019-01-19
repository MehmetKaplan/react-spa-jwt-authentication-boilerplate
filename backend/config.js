export default  {
	jwtSecret: process.env.JWT_SECRET,
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
	}
};


