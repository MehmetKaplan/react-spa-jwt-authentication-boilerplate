import mysql from 'mysql';

import config from './config.js';

export default class databaseActionMySQL {
	constructor(){
		this.connection = mysql.createConnection(config.databaseParameters);
	}

	execute_select(p_sql, p_parameters_as_array = []){
		this.connection.connect();
		let l_retval_as_array_of_hashes = this.connection.query(p_sql, p_parameters_as_array, 
			(err, rows, fields) => {
				if (l_err) throw l_err;
				return l_rows;
			}
		);
		this.connection.end();
		return l_retval_as_array_of_hashes;
	}

	execute_updatedeleteinsert(p_sql, p_parameters_as_array = []){
		this.connection.connect();
		let l_retval_as_array_of_hashes = this.connection.query(p_sql, (err, rows, fields) => {
			if (l_err) throw l_err;
		});
		this.connection.end();
		return "OK";
	}

}
