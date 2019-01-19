'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _generic_library = require('./generic_library.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DatabaseAction = function () {
	function DatabaseAction() {
		_classCallCheck(this, DatabaseAction);

		this.transporter = _nodemailer2.default.createTransport(_config2.default.nodemailerTransporterParameters);
	}

	_createClass(DatabaseAction, [{
		key: 'sendMail',
		value: function sendMail(p_from, p_to, p_subject, p_text, p_html) {
			var l_params = {
				from: p_from,
				to: p_to,
				subject: p_subject,
				text: p_text,
				html: p_html
			};

			if ((0, _generic_library.nvl)(p_html, "x") == "x") {
				delete l_params['html'];
			} else {
				delete l_params['text'];
			}

			this.transporter.sendMail(l_params, function (error, info) {
				if (error) {
					console.log(error);
					return "NOK";
				} else {
					return "OK";
				}
			});
		}
	}]);

	return DatabaseAction;
}();

exports.default = DatabaseAction;