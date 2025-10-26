const db=require('../database')
class Request{

    static async addRequest(request)
{
const sql = `
      INSERT INTO requests
        (requester_user_id, type, name, dosage_or_specs, urgency, quantity, unit, location_geo, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [request.requester_user_id, request.type, request.name, request.dosage_or_specs, request.urgency,
       request.quantity, request.unit, request.location_geo, request.notes];

   // const [result] = await db.query(sql, params);
    const [rows] = await db.query(sql, params);
    //return result.insertId;
    return rows[0]
}

static async showRequest( id)
{
//const id=request.params.id//from url parameters
const sql = `
      SELECT * FROM requests WHERE id=?
    `;
    const [rows]=await db.query(sql,[id])
    return rows[0]||null

}


}
module.exports=Request
