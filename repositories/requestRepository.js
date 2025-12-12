const db=require('../database')
class Request{
    static async addRequest(request)
{
const sql = `
      INSERT INTO requests
        (requester_user_id,type, name, dosage_or_specs, urgency, quantity, unit, location_geo, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const params = [request.requester_user_id,request.type, request.name, request.dosage_or_specs, request.urgency,
       request.quantity, request.unit, request.location_geo, request.notes];
   // const [result] = await db.query(sql, params);
    const [result] = await db.query(sql, params);
return result.insertId;
    //return result.insertId;
    //return rows[0]
}

static async showRequest( id)
{
//const id=request.params.id//from url parameters
const sql = `
      SELECT * FROM requests WHERE id=?
    `;
    const [rows]=await db.query(sql,[id])
     console.log('Request from DataBase in showRequest:', rows[0]);
    return rows[0]||null

}
static async showAllRequests(filters={}){
  let sql=`SELECT * FROM requests WHERE 1=1`;
  const params = [];
   if (filters.type) {
    sql += " AND type = ?";
    params.push(filters.type);
  }
  if (filters.urgency) {
   sql += " AND urgency = ?";
    params.push(filters.urgency);
  }
  if (filters.status) {
    sql += " AND status = ?";
    params.push(filters.status);
  }
  if (filters.location_geo) {
    sql += " AND location_geo = ?";
    params.push(filters.location_geo);
  }
  if (filters.search) {
    sql += " AND (name LIKE ? OR dosage_or_specs LIKE ?)";
    params.push(`%${filters.search}%`);
    params.push(`%${filters.search}%`);
  }
  if (filters.requester_id) {
   sql+= " AND requester_user_id = ?";
    params.push(filters.requester_id);
  }
  sql += " ORDER BY created_at DESC";
  const [rows] = await db.query(sql, params);
  return rows;
}
  static async showMyRequests(id){
    const sql = `
    SELECT * FROM requests WHERE requester_user_id = ? ORDER BY created_at DESC
  `;
  const [rows]=await db.query(sql,[id])
  return rows;
}
static async editRequestStatus(requestId,oldStatus,newStatus,userId,note){
  const connection = await db.getConnection();
  try{
    await connection.beginTransaction();
    const sql1= `INSERT INTO request_status_history
          (request_id, old_status, new_status, changed_by_user_id, changed_at, note)
        VALUES (?, ?, ?, ?, NOW(), ?)
      `;
      await connection.query(sql1,[requestId,oldStatus,newStatus,userId,note]);
   const   sql2=`UPDATE requests SET status=? WHERE id=?`
  const[results]=await connection.query(sql2,[newStatus,requestId]);
  if(results.affectedRows==0)
  {
    throw new Error("Failed to update request status!")
  }
  await connection.commit();
    return true;
}
catch(err)
{
  await connection.rollback();
  throw err;
}
finally{
 connection.release();
}
}
}

module.exports=Request
