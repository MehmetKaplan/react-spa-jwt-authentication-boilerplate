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
	//app.use(bodyParser.json()); // Different routes require different bodyParsers
	// Routes & Handlers
	app.post('/checkJWT', requestHandlers.checkJWT);
	app.post('/login', requestHandlers.login);
	app.post('/generateResetPwdToken', requestHandlers.generateResetPwdToken);
	app.post('/resetPwd', requestHandlers.resetPwd);
	app.post('/signUp', requestHandlers.signUp);
	app.post('/generateEmailOwnershipToken', requestHandlers.generateEmailOwnershipToken);
	app.post('/updateEMail', requestHandlers.updateEMail);
	app.post('/updatePassword', requestHandlers.updatePassword);
	app.post('/updateData', requestHandlers.updateData);
	app.all('*', (req, res) => res.redirect("/"));
	app.listen(port, () => console.log(`Server is listening on port: ${port}\nStart time: ${getUTCTimeAsString()}`));
}

main();