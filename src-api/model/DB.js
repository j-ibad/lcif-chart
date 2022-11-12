import mysql from 'mysql';

import { createRequire } from "module";
const require = createRequire(import.meta.url)

class DB_Conn {
	constructor(){
		let mysqlConnectionParams = require('#config/db_creds.secret.json');
		this.pool = mysql.createPool(mysqlConnectionParams);
		this.getConnection = this.pool.getConnection;
		this.query = this.pool.query;
	}
}

const DB = new DB_Conn();

export default DB;