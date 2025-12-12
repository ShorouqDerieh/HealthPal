const pool=require('../database');
class PatientProfileRepository {
    async findProfileByUserId(userId) {
        const [rows]= await pool.execute(`
      SELECT u.id AS patient_user_id,u.full_name,pp.dob,pp.gender,pp.blood_type,pp.primary_condition,pp.country,
        pp.city,pp.case_summary, pp.consent_to_display_case, pp.is_verified, pp.verified_by,
        pp.verification_date,pp.created_at,pp.updated_at
      FROM patient_profiles pp JOIN users u ON u.id = pp.user_id
      WHERE pp.user_id = ?
      `  ,[userId]);
      return rows[0] || null;
    }
    async upsertProfile(userId, profileData) {
     const{dob,gender,bloodType,primaryCOndition,country,city,caseSummary,consentToDisplayCase}=profileData;
     await pool.execute('insert into patient_profiles (user_id,dob,gender,blood_type,primary_condition,country,city,case_summary,consent_to_display_case) values(?,?,?,?,?,?,?,?,?) on duplicate key update dob=values(dob), gender=values(gender), blood_type=values(blood_type), primary_condition=values(primary_condition), country=values(country), city=values(city), case_summary=values(case_summary), consent_to_display_case=values(consent_to_display_case)',
     [userId,dob||null,gender||null,bloodType||null,primaryCOndition||null,country||null,city||null,caseSummary||null,consentToDisplayCase||null]);     
    }
    async updateUserFullName(userId,fullName){
        await pool.execute('update users set full_name =? where id =? ',[fullName,userId])
    }
async verifyProfile (userId,verifiedByUserId){
    await pool.execute ('update patient_profiles set is_verified =1, verified_by =?, verification_date = now() where user_id =?',[verifiedByUserId,userId]);

}
async findPublicProfiles (filters={}){
    const params=[];
let where ='WHERE pp.is_verified=True and pp.consent_to_display_case=True';
if(filters.country){
    where+=' AND pp.country =? ';
    params.push(filters.country);
}
if(filters.city){
    where+=' And pp.city=? ';
    params.push(filters.city);

}
const [rows]= await pool.execute( `
      SELECT
        u.id AS patient_user_id,
        u.full_name,
        pp.country,
        pp.city,
        pp.case_summary,
        pp.primary_condition,
        pp.verification_date
      FROM patient_profiles pp
      JOIN users u ON u.id = pp.user_id
      ${where}
      ORDER BY pp.verification_date DESC, pp.created_at DESC
      `,
      params
    );
    return rows;
}
async addHistoryRecord(patientUserId,clinicalUserId,data){
    const {title,description,recordDate,hospitalName,attendingPhysician,isPublic}=data;
    const [result]= await pool.execute('insert into patient_records (patient_user_id,clinician_user_id,title,notes_encrypted,recorded_at,hospital_name,attending_physician,is_public) values(?,?,?,?,?,?,?,?)',
        [patientUserId,clinicalUserId ||null,title,description,recordDate,hospitalName||null,attendingPhysician||null,isPublic||true]);
        return result.insertId;
}
async getHistoryRecordsForPatient(patientUserId){
    const [rows]= await pool.execute('select id,title,recorded_at,hospital_name,attending_physician,is_public from patient_records where patient_user_id =? order by recorded_at desc',[patientUserId]);
    return rows;


}
async getPublicHistoryRecordsForPatient(patientUserId){
    const [rows]= await pool.execute('select id,title,recorded_at,hospital_name,attending_physician from patient_records where patient_user_id =? and is_public = true order by recorded_at desc',[patientUserId]);
    return rows;
} 

async createDonationGoal(patientUserId,data){
    const {title,description,targetAmount,currency, campaignId,startDate,endDate}=data;
const[result]= await pool.execute('insert into patient_donation_goals (patient_user_id,title,description,target_amount,currency,campaign_id,start_date,end_date) values(?,?,?,?,?,?,?,?)',  [patientUserId,title,description||null,targetAmount,currency,campaignId||null,startDate||null,endDate||null]);



    return result.insertId;
}
async updateDonationGoal(patientUserId,goalId,data){      
    const fields=[];
    const params=[];
    if(data.title !== undefined){
        fields.push('title = ?');
        params.push(data.title);
    }
    if(data.description !== undefined){
        fields.push('description = ?');
        params.push(data.description);
    }
    if(data.targetAmount!==undefined){
        fields.push('target_amount=?');
        params.push(data.targetAmount);
    }
    if(data.currency!==undefined){
        fields.push('currency=?');
        params.push(data.currency);
    }
    if(data.status!==undefined){
        fields.push('status =?');
        params.push(data.status);
    }
    if(data.startDate!==undefined){
        fields.push('start_date =?');
        params.push(data.startDate);
    }
    if(data.endDate!==undefined){
        fields.push('end_date =?');
        params.push(data.endDate);
    }
    if(fields.length===0){
        return;
    }   
    params.push(patientUserId,goalId);      
    await pool.execute(`update patient_donation_goals set ${fields.join(', ')} where patient_user_id =? and id =?`,params);
}
  async getDonationGoalsForPatient(patientUserId, { publicOnly = false } = {}) {
    let where = `WHERE g.patient_user_id = ?`;
    const params = [patientUserId];

    if (publicOnly) {
      where += ` AND g.status = 'ACTIVE'`;
    }

    const [rows] = await pool.execute(
      `
      SELECT
        g.id,
        g.title,
        g.description,
        g.target_amount,
        g.currency,
        g.current_amount,
        g.status,
        g.start_date,
        g.end_date,
        g.campaign_id,
        sc.title AS campaign_title
      FROM patient_donation_goals g
      LEFT JOIN sponsorship_campaigns sc ON sc.id = g.campaign_id
      ${where}
      ORDER BY g.created_at DESC
      `,
      params
    );
    return rows;
  }
  async updateDonationGoalCurrentAmount(goalId) {
    
    await this.db.query(
      `
      UPDATE patient_donation_goals g
      JOIN sponsorship_campaigns sc ON sc.id = g.campaign_id
      JOIN donations d ON d.campaign_id = sc.id
      SET g.current_amount =
        (SELECT COALESCE(SUM(d2.amount),0)
         FROM donations d2
         WHERE d2.campaign_id = g.campaign_id)
      WHERE g.id = ?
      `,
      [goalId]
    );
  }


  async createRecoveryUpdate(patientUserId, authorUserId, data) {
    const { title, message, updateDate, isPublic } = data;
    const [result] = await pool.query(
      `
      INSERT INTO patient_recovery_updates (
        patient_user_id,
        author_user_id,
        title,
        message,
        update_date,
        is_public
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        patientUserId,
        authorUserId,
        title,
        message,
        updateDate || new Date(),
        isPublic !== false 
      ]
    );
    return result.insertId;
  }

  async getRecoveryUpdates(patientUserId, { publicOnly = false } = {}) {
    let where = `WHERE patient_user_id = ?`;
    const params = [patientUserId];

    if (publicOnly) {
      where += ` AND is_public = TRUE`;
    }

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        title,
        message,
        update_date,
        author_user_id,
        is_public
      FROM patient_recovery_updates
      ${where}
      ORDER BY update_date DESC
      `,
      params
    );
    return rows;
  }
}

module.exports = PatientProfileRepository;


