const db=require('../database')
class Matching{
  static async createMatch(requestId,listingId,userId)
  {
    const sql=`INSERT INTO matches (request_id, listing_id, matched_by_user_id, matched_at, status) 
    VALUES (?, ?, ?, NOW(), 'PENDING')
    `;
    const [result] = await db.query(sql, [requestId, listingId,userId]);
    return {
      id: result.insertId,
      request_id: requestId,
      listing_id: listingId,
      matched_by_user_id: userId,
      status: 'PENDING'
    };
  }
   static async getById(id) {
    const sql = `SELECT * FROM matches WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
     console.log('Match from Database', rows[0]);
    return rows[0] || null;
  }
    static async updateStatus(matchId,newStatus){
      const sql = `UPDATE matches SET status = ? WHERE id = ?`;
  const [result] = await db.query(sql, [newStatus, matchId]);
  return result.affectedRows > 0;
  }
  
}
module.exports=Matching