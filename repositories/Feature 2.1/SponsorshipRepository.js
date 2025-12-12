const pool =require ("../../database");
class   SponsorshipRepository{

    async createTreatment ({patientUserId,type,description,providerOrgId}){
        const [result] = await pool.execute("INSERT into treatments (patient_user_id,type,description,provider_org_id) values(?,?,?,?)",
            [patientUserId,type,description,providerOrgId]);
        
            return{
                id:result.insertId, patientUserId,type,description,providerOrgId
            };
    
}
async createCampaign({treatmentId,title,goalAmount,currency,story}) {
    const [result]= await pool.execute("insert into sponsorship_campaigns (treatment_id,title,goal_amount ,currency,status ,story) values(?,?,?,?,'OPEN',?)", [treatmentId,title,goalAmount,currency,story] );
    return{
        id:result.insertId,treatmentId,title,goalAmount,currency,status: "OPEN",story
    };
}

async findCampaignById(campaignId){
    const[result]=await pool.execute("select * from sponsorship_campaigns where id =?",
        [campaignId]
    );
    return result[0]||null;
}
async getCampaignWithStats(campaignId) {
    const [rows] = await pool.query(
      `SELECT c.*,
              COALESCE(SUM(d.amount), 0) AS collected_amount,
              COUNT(d.id) AS donors_count
       FROM sponsorship_campaigns c
       LEFT JOIN donations d ON d.campaign_id = c.id
       WHERE c.id = ?
       GROUP BY c.id`,
      [campaignId]
    );
    return rows[0] || null;
  }

async listOpenCampaigns({ type, limit = 20, offset = 0 }) {
    const params = [];
    let where = `c.status = 'OPEN'`;

    if (type) {
      where += " AND t.type = ?";
      params.push(type);
    }

    params.push(limit, offset);

    const [rows] = await pool.query(
      `SELECT c.*, 
              t.type AS treatment_type,
              COALESCE(SUM(d.amount), 0) AS collected_amount,
              COUNT(d.id) AS donors_count
       FROM sponsorship_campaigns c
       JOIN treatments t ON t.id = c.treatment_id
       LEFT JOIN donations d ON d.campaign_id = c.id
       WHERE ${where}
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    return rows;
  }

  async createDonation({campaignId,donorUserId,amount,currency,method,paymentRef,paidAt}){
    const [result]= await pool.execute("Insert into donations(campaign_id,donor_user_id ,amount,currency,paid_at,payment_ref ,method) values(?,?,?,?,?,?,?)",[campaignId,donorUserId,amount,currency,paidAt,paymentRef,method]);
  return {
      id: result.insertId,
      campaignId,
      donorUserId,
      amount,
      currency,
      method,
      paymentRef,
      paidAt,
    };
  }
  async updateCampaignStatus({newStatus,campaignId}){
    await pool.execute("Update sponsorship_campaigns set status=? where id =?",[newStatus,campaignId]);
  }
}
  module.exports=SponsorshipRepository;






