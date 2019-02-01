import express from 'express';
import bodyParser from 'body-parser';

import config from './config';
import requestHandlers from './request_handlers.js';

import {getUTCTimeAsString} from './generic_library.js';

// Starting point of the server
function main () {
	let app = express();
	const port = process.env.PORT || config.defaultPort;
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	let rh = new requestHandlers();
	//app.use(bodyParser.json()); // Different routes require different bodyParsers
	// Routes & Handlers
	app.post('/checkJWT', rh.checkJWT);
	app.post('/login', rh.login);
	app.post('/generateResetPwdToken', rh.generateResetPwdToken);
	app.post('/resetPwd', rh.resetPwd);
	app.post('/signUp', rh.signUp);
	app.post('/generateEmailOwnershipToken', rh.generateEmailOwnershipToken);
	app.post('/updateEMail', rh.updateEMail);
	app.post('/updatePassword', rh.updatePassword);
	app.post('/updateData', rh.updateData);
	app.get('/', (req, res) => {
		res.set('Content-Type', 'text/html');
		res.send(new Buffer(req));
	});
	app.all('*', (req, res) => res.redirect("/"));
	app.listen(port, () => console.log(`Server is listening on port: ${port}\nStart time: ${getUTCTimeAsString()}`));
}

main();