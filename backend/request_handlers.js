import mysql from 'mysql';
import jwt from 'jsonwebtoken';

import config from './config';
import middleware from './middleware';

export default class requestHandlers {
	constructor(){
	}

	login (req, res) {
		let username = req.body.username;
		let password = req.body.password;
		// For the given username fetch user from DB
		let mockedUsername = 'admin';
		let mockedPassword = 'password';
  
		if (username && password) {
		  if (username === mockedUsername && password === mockedPassword) {
			 let token = jwt.sign({username: username},
				config.secret,
				{ expiresIn: '24h' // expires in 24 hours
				}
			 );
			 // return the JWT token for the future API calls
			 res.json({
				success: true,
				message: 'Authentication successful!',
				token: token
			 });
		  } else {
			 res.send(403).json({
				success: false,
				message: 'Incorrect username or password'
			 });
		  }
		} else {
		  res.send(400).json({
			 success: false,
			 message: 'Authentication failed! Please check the request'
		  });
		}
	 }
	 index (req, res) {
		res.json({
		  success: true,
		  message: 'Index page'
		});
	 }
}