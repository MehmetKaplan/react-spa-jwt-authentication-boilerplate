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
	//app.use(bodyParser.urlencoded({extended: true}));
	app.use(_bodyParser2.default.json());

	var rh = new _request_handlers2.default();
	//app.use(bodyParser.json()); // Different routes require different bodyParsers
	// Routes & Handlers
	app.all('/test', function (req, res) {
		return rh.testConnection(req, res);
	});
	app.post('/checkJWT', function (req, res) {
		return rh.checkJWT(req, res);
	});
	app.post('/login', function (req, res) {
		return rh.login(req, res);
	});
	app.post('/generateResetPwdToken', function (req, res) {
		return rh.generateResetPwdToken(req, res);
	});
	app.post('/resetPwd', function (req, res) {
		return rh.resetPwd(req, res);
	});
	app.post('/signUp', function (req, res) {
		return rh.signUp(req, res);
	});
	app.post('/generateEmailOwnershipToken', function (req, res) {
		return rh.generateEmailOwnershipToken(req, res);
	});
	app.post('/updateEMail', function (req, res) {
		return rh.updateEMail(req, res);
	});
	app.post('/updatePassword', function (req, res) {
		return rh.updatePassword(req, res);
	});
	app.post('/updateData', function (req, res) {
		return rh.updateData(req, res);
	});
	app.post('/getUserData', function (req, res) {
		return rh.getUserData(req, res);
	});
	app.all('/', function (req, res) {
		return res.redirect("/test");
	});
	app.all('*', function (req, res) {
		return res.redirect("/");
	});
	app.listen(port, function () {
		return console.log('Server is listening on port: ' + port + '\nStart time: ' + (0, _generic_library.getUTCTimeAsString)());
	});
}

main();