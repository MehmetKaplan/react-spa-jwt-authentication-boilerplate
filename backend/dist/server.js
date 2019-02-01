'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _request_handlers = require('./request_handlers.js');

var _request_handlers2 = _interopRequireDefault(_request_handlers);

var _generic_library = require('./generic_library.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Starting point of the server
function main() {
	var app = (0, _express2.default)();
	var port = process.env.PORT || _config2.default.defaultPort;
	app.use(_bodyParser2.default.urlencoded({
		extended: true
	}));

	var rh = new _request_handlers2.default();
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
	app.get('/', function (req, res) {
		res.set('Content-Type', 'text/html');
		res.send(new Buffer(req));
	});
	app.all('*', function (req, res) {
		return res.redirect("/");
	});
	app.listen(port, function () {
		return console.log('Server is listening on port: ' + port + '\nStart time: ' + (0, _generic_library.getUTCTimeAsString)());
	});
}

main();