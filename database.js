const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'healthcare_db'
});

module.exports = pool;
const config=require('./config/config.json')
const db = mysql.createPool({
  host: config.development.host,
  user: config.development.username,
  password: config.development.password,
  database: config.development.database,
  waitForConnections: true,
 connectionLimit: 10,
  queueLimit: 0
});
module.exports=db