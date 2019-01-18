'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HandlerGenerator = function () {
  function HandlerGenerator() {
    _classCallCheck(this, HandlerGenerator);
  }

  _createClass(HandlerGenerator, [{
    key: 'login',
    value: function login(req, res) {
      var username = req.body.username;
      var password = req.body.password;
      // For the given username fetch user from DB
      var mockedUsername = 'admin';
      var mockedPassword = 'password';

      if (username && password) {
        if (username === mockedUsername && password === mockedPassword) {
          var token = _jsonwebtoken2.default.sign({ username: username }, _config2.default.secret, { expiresIn: '24h' // expires in 24 hours
          });
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
  }, {
    key: 'index',
    value: function index(req, res) {
      res.json({
        success: true,
        message: 'Index page'
      });
    }
  }]);

  return HandlerGenerator;
}();

// Starting point of the server


function main() {
  var app = (0, _express2.default)(); // Export app for other routes to use
  var handlers = new HandlerGenerator();
  var port = process.env.PORT || 8000;
  app.use(_bodyParser2.default.urlencoded({ // Middleware
    extended: true
  }));
  app.use(_bodyParser2.default.json());
  // Routes & Handlers
  app.post('/login', handlers.login);
  app.get('/', _middleware2.default.checkToken, handlers.index);
  app.listen(port, function () {
    return console.log('Server is listening on port: ' + port);
  });
}

main();