import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config';
import requestHandlers from './request_handlers.js';

import {getUTCTimeAsString} from './generic_library.js';

// Starting point of the server
function main () {
	let app = express();
	const port = process.env.PORT || config.defaultPort;
	//app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	let rh = new requestHandlers();
	//app.use(bodyParser.json()); // Different routes require different bodyParsers
	// Routes & Handlers
	
	app.use(cors());
	app.options('*', cors());
	
	app.all('/test', (req, res) => rh.testConnection(req, res));
	app.all('/checkJWT', (req, res) => rh.checkJWT(req, res));
	app.post('/login', (req, res) => rh.login(req, res));
	app.post('/generateResetPwdToken', (req, res) => rh.generateResetPwdToken(req, res));
	app.post('/resetPwd', (req, res) => rh.resetPwd(req, res));
	app.post('/signUp', (req, res) => rh.signUp(req, res));
	app.post('/generateEmailOwnershipToken', (req, res) => rh.generateEmailOwnershipToken(req, res));
	app.post('/updateEMail', (req, res) => rh.updateEMail(req, res));
	app.post('/updatePassword', (req, res) => rh.updatePassword(req, res));
	app.post('/updateData', (req, res) => rh.updateData(req, res));
	app.post('/getUserData', (req, res) => rh.getUserData(req, res));
	app.all('/', (req, res) => res.redirect("/test"));
	app.all('*', (req, res) => res.redirect("/"));
	app.listen(port, () => console.log(`Server is listening on port: ${port}\nStart time: ${getUTCTimeAsString()}`));
}

main();