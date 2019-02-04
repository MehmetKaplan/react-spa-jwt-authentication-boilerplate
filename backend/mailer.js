import config from './config.js';

import nodemailer from 'nodemailer';

import {nvl} from './generic_library.js';

class Mailer_ {
	constructor(){
		this.transporter = nodemailer.createTransport(config.nodemailerTransporterParameters);
	}

	sendMail(p_from, p_to, p_subject, p_text, p_html){
		let l_params = {
			from: p_from,
			to: p_to,
			subject: p_subject,
			text: p_text,
			html: p_html
		};

		if (nvl(p_html, "x") == "x") {
			delete l_params['html'];
		}
		else {
			delete l_params['text'];
		}
		return new Promise((res) => {
			this.transporter.sendMail(l_params, (error, info) => {
				if (error) {
					console.log(error);
					res("NOK");
				} else {
					res("OK");
				}
			});
		});
	}
}
const Mailer = new Mailer_();

export default Mailer;