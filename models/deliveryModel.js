const db=require('../database')
class Delivery{
static async getDelivery(id){
    const sql=`SELECT * FROM deliveries WHERE id=?`
    const [rows]=await db.query(sql,[id])
    return rows[0]||null
}
static async getByMatchId(matchId) {
    const sql = `SELECT * FROM deliveries WHERE match_id = ?`;
    const [rows] = await db.query(sql, [matchId]);
    return rows[0] || null;
  }
  static async createDelivery(matchId,volunteerId){
    const sql = `
      INSERT INTO deliveries
        (match_id, volunteer_user_id, status, created_at)
      VALUES (?, ?, 'SCHEDULED', NOW())
    `;
    const [result] = await db.query(sql, [matchId, volunteerId]);
    return {
      id: result.insertId,
      match_id: matchId,
      volunteer_user_id: volunteerId,
      status: 'SCHEDULED'
    };
  }
  static async changeDeliveryStatus(deliveryId,newStatus,{ PickupTime = false, DropoffTime = false } = {}){
    const conditions=['status=?'];
    const parameters=[newStatus,deliveryId];
    if(PickupTime)
    {
      conditions.push(`pickup_time=NOW()`);
    }
    if(DropoffTime)
    {
      conditions.push(`dropoff_time=NOW()`);
    }
    const sql = `UPDATE deliveries SET ${conditions.join(', ')} WHERE id = ?`;
    parameters.push(conditions)
    const [result] = await db.query(sql,parameters);
    return result.affectedRows > 0;
  }
  static async addProof(deliveryId,fileId)
  {
      const sql=`UPDATE deliveries SET proof_file_id = ? WHERE id = ?`
      const [result]=await db.query(sql,[fileId,deliveryId])
      return result.affectedRows>0;
  }
  static async getDeliveryForVolunteer(volunteerId)
  {
    const sql = `
    SELECT 
      d.id AS delivery_id,
      d.status AS delivery_status,
      d.pickup_time,
      d.dropoff_time,
      d.proof_file_id,

      m.id AS match_id,
      m.status AS match_status,

      r.id AS request_id,
      r.type AS request_type,
      r.name AS request_name,
      r.quantity,
      r.unit,
      r.urgency,
      r.location_geo,
      r.status AS request_status,
      r.created_at AS request_created_at

    FROM deliveries d
    JOIN matches m ON d.match_id = m.id
    JOIN requests r ON m.request_id = r.id

    WHERE d.volunteer_user_id = ?
    ORDER BY d.created_at DESC
  `;
   const [rows] = await db.query(sql, [volunteerId]);
  return rows;
  }
}
module.exports=Delivery