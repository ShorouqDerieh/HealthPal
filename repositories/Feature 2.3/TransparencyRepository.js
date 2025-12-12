
const pool = require("../../database");

class TransparencyRepository {
  async findDonationById(donationId) {
    const [rows] = await pool.execute("SELECT * FROM donations WHERE id = ?", [donationId]);
    return rows[0] || null;
  }

  async getDonationWithCampaign(donationId) {
    const [rows] = await pool.query(
      `SELECT d.*,
              c.title AS campaign_title,
              c.treatment_id,
              c.status AS campaign_status,
              t.patient_user_id,
              t.provider_org_id
       FROM donations d
       JOIN sponsorship_campaigns c ON c.id = d.campaign_id
       JOIN treatments t ON t.id = c.treatment_id
       WHERE d.id = ?`,
      [donationId]
    );
    return rows[0] || null;
  }

  async isUserMemberInOrg(userId, orgId) {
    const [rows] = await pool.execute(
      "SELECT 1 FROM user_org_memberships WHERE user_id = ? AND org_id = ? LIMIT 1",
      [userId, orgId]
    );
    return rows.length > 0;
  }

  async logAudit({ actorUserId, action, entityType, entityId, metadata = null }) {
    await pool.execute(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [actorUserId || null, action, entityType, entityId || null, metadata ? JSON.stringify(metadata) : null]
    );
  }

 
  async donorSummary(donorUserId, { fromDate, toDate, campaignId, status }) {
    const params = [donorUserId];
    let where = "WHERE d.donor_user_id = ?";

    if (fromDate) { where += " AND d.paid_at >= ?"; params.push(fromDate); }
    if (toDate) { where += " AND d.paid_at <= ?"; params.push(toDate); }
    if (campaignId) { where += " AND d.campaign_id = ?"; params.push(campaignId); }
    // donation status not in your schema; use campaign status :contentReference[oaicite:6]{index=6}
    if (status) { where += " AND c.status = ?"; params.push(status); }

    const [[row]] = await pool.query(
      `SELECT
          COALESCE(SUM(d.amount), 0) AS total_donated,
          COALESCE(SUM(ds.amount), 0) AS total_disbursed
       FROM donations d
       JOIN sponsorship_campaigns c ON c.id = d.campaign_id
       LEFT JOIN disbursements ds ON ds.campaign_id = c.id
       ${where}`,
      params
    );

    return {
      totalDonated: Number(row.total_donated || 0),
      totalDisbursed: Number(row.total_disbursed || 0),
      remaining: Number(row.total_donated || 0) - Number(row.total_disbursed || 0),
    };
  }

  async donorDonations(donorUserId, { fromDate, toDate, campaignId, status, limit = 20, offset = 0 }) {
    const params = [donorUserId];
    let where = "WHERE d.donor_user_id = ?";

    if (fromDate) { where += " AND d.paid_at >= ?"; params.push(fromDate); }
    if (toDate) { where += " AND d.paid_at <= ?"; params.push(toDate); }
    if (campaignId) { where += " AND d.campaign_id = ?"; params.push(campaignId); }
    if (status) { where += " AND c.status = ?"; params.push(status); }

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(
      `SELECT
          d.id AS donation_id,
          d.amount,
          d.currency,
          d.paid_at,
          d.method,
          d.payment_ref,
          c.id AS campaign_id,
          c.title AS campaign_title,
          c.status AS campaign_status,
          t.type AS treatment_type,
          t.patient_user_id,
          COALESCE(SUM(ds.amount), 0) AS disbursed_amount
       FROM donations d
       JOIN sponsorship_campaigns c ON c.id = d.campaign_id
       JOIN treatments t ON t.id = c.treatment_id
       LEFT JOIN disbursements ds ON ds.campaign_id = c.id
       ${where}
       GROUP BY d.id
       ORDER BY d.paid_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    return rows;
  }

  async donorDonationDetails(donationId) {
    const donation = await this.getDonationWithCampaign(donationId);
    if (!donation) return null;

    const [disbursements] = await pool.query(
      `SELECT * FROM disbursements
       WHERE campaign_id = ?
       ORDER BY disbursed_at DESC`,
      [donation.campaign_id]
    );

    const [documents] = await pool.query(
      `SELECT fd.*,
              f.storage_url,
              f.mime,
              f.sha256
       FROM financial_documents fd
       JOIN files f ON f.id = fd.file_id
       WHERE fd.campaign_id = ?
       ORDER BY fd.issued_at DESC`,
      [donation.campaign_id]
    );

    const [publicFeedback] = await pool.execute(
      `SELECT id, rating, feedback_text, created_at
       FROM patient_donation_feedback
       WHERE donation_id = ? AND is_public = TRUE
       ORDER BY created_at DESC`,
      [donationId]
    );

    return { donation, disbursements, documents, publicFeedback };
  }

  async donorPublicFeedbackForDonation(donationId) {
    const [rows] = await pool.execute(
      `SELECT id, rating, feedback_text, created_at
       FROM patient_donation_feedback
       WHERE donation_id = ? AND is_public = TRUE
       ORDER BY created_at DESC`,
      [donationId]
    );
    return rows;
  }

  // ---------------- NGO ----------------
  async ngoCampaigns(orgId, { status, type, limit = 20, offset = 0 }) {
    const params = [orgId];
    let where = "WHERE t.provider_org_id = ?";

    if (status) { where += " AND c.status = ?"; params.push(status); }
    if (type) { where += " AND t.type = ?"; params.push(type); }

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(
      `SELECT
          c.*,
          t.type AS treatment_type,
          t.patient_user_id,
          COALESCE(SUM(d.amount), 0) AS collected_amount,
          COUNT(d.id) AS donors_count
       FROM sponsorship_campaigns c
       JOIN treatments t ON t.id = c.treatment_id
       LEFT JOIN donations d ON d.campaign_id = c.id
       ${where}
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    return rows;
  }

  async ngoCampaignDetails(campaignId) {
    const [campaignRows] = await pool.query(
      `SELECT c.*,
              t.type AS treatment_type,
              t.patient_user_id,
              t.provider_org_id
       FROM sponsorship_campaigns c
       JOIN treatments t ON t.id = c.treatment_id
       WHERE c.id = ?`,
      [campaignId]
    );
    const campaign = campaignRows[0] || null;
    if (!campaign) return null;

    const [donations] = await pool.execute(
      `SELECT id, donor_user_id, amount, currency, paid_at, method
       FROM donations
       WHERE campaign_id = ?
       ORDER BY paid_at DESC`,
      [campaignId]
    );

    const [disbursements] = await pool.execute(
      `SELECT *
       FROM disbursements
       WHERE campaign_id = ?
       ORDER BY disbursed_at DESC`,
      [campaignId]
    );

    const [documents] = await pool.query(
      `SELECT fd.*,
              f.storage_url,
              f.mime
       FROM financial_documents fd
       JOIN files f ON f.id = fd.file_id
       WHERE fd.campaign_id = ?
       ORDER BY fd.issued_at DESC`,
      [campaignId]
    );

    return { campaign, donations, disbursements, documents };
  }

  async createDisbursement({ campaignId, toOrgId, amount, currency, disbursedAt, note }) {
    const [result] = await pool.execute(
      `INSERT INTO disbursements (campaign_id, to_org_id, amount, currency, disbursed_at, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [campaignId, toOrgId, amount, currency, disbursedAt, note || null]
    );
    return { id: result.insertId, campaignId, toOrgId, amount, currency, disbursedAt, note: note || null };
  }

  async createFinancialDocument({ campaignId, type, fileId, issuedAt, amount, currency }) {
    const [result] = await pool.execute(
      `INSERT INTO financial_documents (campaign_id, type, file_id, issued_at, amount, currency)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [campaignId, type, fileId, issuedAt, amount, currency]
    );
    return { id: result.insertId, campaignId, type, fileId, issuedAt, amount, currency };
  }


  async createPatientDonationFeedback({ donationId, patientUserId, rating, feedbackText, isPublic }) {
    const [result] = await pool.execute(
      `INSERT INTO patient_donation_feedback (donation_id, patient_user_id, rating, feedback_text, is_public)
       VALUES (?, ?, ?, ?, ?)`,
      [donationId, patientUserId, rating ?? null, feedbackText, Boolean(isPublic)]
    );
    return { id: result.insertId, donationId, patientUserId, rating: rating ?? null, feedbackText, isPublic: Boolean(isPublic) };
  }

  async listMyFeedback(patientUserId, { limit = 20, offset = 0 }) {
    const [rows] = await pool.query(
      `SELECT pdf.*,
              d.campaign_id,
              c.title AS campaign_title
       FROM patient_donation_feedback pdf
       JOIN donations d ON d.id = pdf.donation_id
       JOIN sponsorship_campaigns c ON c.id = d.campaign_id
       WHERE pdf.patient_user_id = ?
       ORDER BY pdf.created_at DESC
       LIMIT ? OFFSET ?`,
      [patientUserId, Number(limit), Number(offset)]
    );
    return rows;
  }


  async adminOverview() {
    const [[row]] = await pool.query(
      `SELECT
         (SELECT COALESCE(SUM(amount),0) FROM donations) AS total_donated,
         (SELECT COALESCE(SUM(amount),0) FROM disbursements) AS total_disbursed`
    );

    return {
      totalDonated: Number(row.total_donated || 0),
      totalDisbursed: Number(row.total_disbursed || 0),
      remaining: Number(row.total_donated || 0) - Number(row.total_disbursed || 0),
    };
  }

  async adminDonations({ limit = 50, offset = 0 }) {
    const [rows] = await pool.query(
      `SELECT
          d.*,
          c.title AS campaign_title,
          c.status AS campaign_status,
          t.type AS treatment_type,
          t.patient_user_id
       FROM donations d
       JOIN sponsorship_campaigns c ON c.id = d.campaign_id
       JOIN treatments t ON t.id = c.treatment_id
       ORDER BY d.paid_at DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return rows;
  }

  async adminAuditDonation(donationId) {
    const trail = await this.donorDonationDetails(donationId);
    if (!trail) return null;

    const [audit] = await pool.execute(
      `SELECT *
       FROM audit_logs
       WHERE entity_type IN ('donation','campaign')
         AND entity_id IN (?, ?)
       ORDER BY created_at DESC`,
      [donationId, trail.donation.campaign_id]
    );

    return { ...trail, audit };
  }

  async flagCampaign({ campaignId, actorUserId, reason }) {
    await this.logAudit({
      actorUserId,
      action: "FLAG_CAMPAIGN",
      entityType: "campaign",
      entityId: campaignId,
      metadata: { reason },
    });
  }
}

module.exports = TransparencyRepository;
