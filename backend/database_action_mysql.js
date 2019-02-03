import mysql from 'mysql';

import config from './config.js';

class databaseActionMySQL_ {

	constructor(){

	}

	execute_select(p_sql, p_parameters_as_array = []){
		let l_db_conn = mysql.createConnection(config.databaseParameters);
		l_db_conn.connect();

		return new Promise((res) => {
					l_db_conn.query(p_sql, p_parameters_as_array,
						(err, rows, fields) => {
							l_db_conn.end();
							if (err){
								//deleteme
								console.log("DB error for following sql and parameters: ")
								console.log("sql: " + p_sql);
								console.log("parameters: " + JSON.stringify(p_parameters_as_array));
								console.log("err: " + JSON.stringify(err));
								throw err
							};
							res(rows);
						}
					);
				}
		);

	}

	execute_updatedeleteinsert_(p_db_conn, p_sql, p_parameters_as_array = []) {
		return new Promise(resolve => {
			p_db_conn.query(p_sql, p_parameters_as_array,
				(err, rows, fields) => {
					if (err){
						//deleteme
						console.log("DB error for following sql and parameters: ")
						console.log("sql: " + p_sql);
						console.log("parameters: " + JSON.stringify(p_parameters_as_array));
						console.log("err: " + JSON.stringify(err));
						throw err
					};
					resolve(rows);
				}
			);
		});
	}

	async execute_updatedeleteinsert(p_sql, p_parameters_as_array = []) {
		let l_db_conn = mysql.createConnection(config.databaseParameters);
		l_db_conn.connect();
		var l_retval_as_array_of_hashes = await this.execute_updatedeleteinsert_(l_db_conn, p_sql, p_parameters_as_array);
		l_db_conn.end();
		return "OK";
	}

};

//All to use the single instance of this library - singleton pattern
const databaseActionMySQL = new databaseActionMySQL_();

export default databaseActionMySQL;
