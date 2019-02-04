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
console.log("Unsuccessfull:");
console.log(p_sql);
console.log(JSON.stringify(p_parameters_as_array));
								throw err
							};
//deleteme
console.log("Successfull:");
console.log(p_sql);
console.log(JSON.stringify(p_parameters_as_array));
							res(rows);
						}
					);
				}
		);
	}

	execute_updatedeleteinsert(p_sql, p_parameters_as_array = []){
		let l_db_conn = mysql.createConnection(config.databaseParameters);
		l_db_conn.connect();
		return new Promise((res) => {
					l_db_conn.query(p_sql, p_parameters_as_array,
						(err, rows, fields) => {
							l_db_conn.end();
							if (err){
//deleteme
console.log("Unsuccessfull:");
console.log(p_sql);
console.log(JSON.stringify(p_parameters_as_array));

								throw err
							};
//deleteme
console.log("Successfull:");
console.log(p_sql);
console.log(JSON.stringify(p_parameters_as_array));
							res("OK");
						}
					);
				}
		);
	}

};

const databaseActionMySQL = new databaseActionMySQL_();

export default databaseActionMySQL;
