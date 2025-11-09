const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'healthcare_db'
  
});

connection.connect((err) => {
  if (err) return console.error('Connection failed:', err);
  console.log('Connected to healthcare_db');
  connection.query('SELECT DATABASE() AS db, NOW() AS now', (err, rows) => {
    if (err) console.error(err);
    else console.log(rows[0]);
    //connection.end();
  });
});

module.exports = connection;
