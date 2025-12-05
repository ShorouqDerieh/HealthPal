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
}
module.exports=Matching