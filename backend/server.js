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
	app.get('/', requestHandlers.checkJWT);
	app.post('/login', requestHandlers.login);
	app.post('/generateResetURL', requestHandlers.generateResetURL);
	app.post('/confirmResetURL', requestHandlers.confirmResetURL);
	app.post('/actionResetURL', requestHandlers.actionResetURL);
	app.post('/actionResetURL', requestHandlers.actionResetURL);
	app.all('*', (req, res) => res.redirect("/"));
	app.listen(port, () => console.log(`Server is listening on port: ${port}\nStart time: ${getUTCTimeAsString()}`));
}

main();