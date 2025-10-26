const mysql = require('mysql2/promise');
const config=require('./config/config.json')
const db = mysql.createPool({//multiple connections
  host: config.development.host,
  user: config.development.username,
  password: config.development.password,
  database: config.development.database,
  waitForConnections: true,//لو تعبت المجموعة الجديدة بتستنى بدل الايرور
 connectionLimit: 10,//اقصى عدد اتصالات فعالة
  queueLimit: 0//غير محدود الي بتستنى
});
module.exports=db