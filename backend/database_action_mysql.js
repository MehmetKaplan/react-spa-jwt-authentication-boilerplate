import mysql from 'mysql';

import config from './config.js';

export default class databaseActionMySQL {
	constructor(){
		this.connection = mysql.createConnection(config.databaseParameters);
	}

	execute_select_(p_sql, p_parameters_as_array = []) {
		return new Promise(resolve => {
			this.connection.query(p_sql, p_parameters_as_array,
				(err, rows, fields) => {
					if (err) throw err;
					resolve(rows);
				}
			);
		});
	}

	async execute_select(p_sql, p_parameters_as_array = []) {
		this.connection.connect();
		var l_retval_as_array_of_hashes = await execute_select_(p_sql, p_parameters_as_array);
		this.connection.end();
		return l_retval_as_array_of_hashes;
	}

	execute_updatedeleteinsert_(p_sql, p_parameters_as_array = []) {
		return new Promise(resolve => {
			this.connection.query(p_sql, p_parameters_as_array,
				(err, rows, fields) => {
					if (err) throw err;
					resolve(rows);
				}
			);
		});
	}

	async execute_updatedeleteinsert(p_sql, p_parameters_as_array = []) {
		this.connection.connect();
		var l_retval_as_array_of_hashes = await execute_select_(p_sql, p_parameters_as_array);
		this.connection.end();
		return "OK";
	}

}
