const db = require('../database');
async function createGroup(data) {
   const sql= 'insert into support_groups (name,description,category,created_by_user_id,created_at) VALUES (?, ?, ?, ?, NOW())'
      const [result] = await db.query(sql, [
        data.name,
        data.description,
        data.category,
        data.created_by_user_id,
        data.created_at
    ]);
    return result;


}
module.exports={
createGroup
};