class NgoTransparencyService {
  constructor(repo) { this.repo = repo; }

  async listCampaigns({ userId, orgId, filters }) {
    const isMember = await this.repo.isUserMemberInOrg(userId, orgId);
    if (!isMember) { const e = new Error("You are not a member of this organization"); e.statusCode = 403; throw e; }
    const limit = filters?.limit ? Number(filters.limit) : 20;
    const offset = filters?.offset ? Number(filters.offset) : 0;
    return this.repo.ngoCampaigns(orgId, { ...filters, limit, offset });
  }

  async campaignDetails({ userId, orgId, campaignId }) {
    const isMember = await this.repo.isUserMemberInOrg(userId, orgId);
    if (!isMember) { const e = new Error("You are not a member of this organization"); e.statusCode = 403; throw e; }

    const details = await this.repo.ngoCampaignDetails(campaignId);
    if (!details) { const e = new Error("Campaign not found"); e.statusCode = 404; throw e; }

    if (Number(details.campaign.provider_org_id) !== Number(orgId)) {
      const e = new Error("Forbidden campaign for this org");
      e.statusCode = 403;
      throw e;
    }

    return details;
  }

  async createDisbursement({ userId, orgId, payload }) {
    const isMember = await this.repo.isUserMemberInOrg(userId, orgId);
    if (!isMember) { const e = new Error("You are not a member of this organization"); e.statusCode = 403; throw e; }

    const created = await this.repo.createDisbursement({
      campaignId: Number(payload.campaign_id),
      toOrgId: Number(payload.to_org_id),
      amount: Number(payload.amount),
      currency: payload.currency,
      disbursedAt: new Date(payload.disbursed_at),
      note: payload.note || null,
    });

    await this.repo.logAudit({
      actorUserId: userId,
      action: "CREATE_DISBURSEMENT",
      entityType: "campaign",
      entityId: Number(payload.campaign_id),
      metadata: { orgId, disbursementId: created.id },
    });

    return created;
  }

  async createDocument({ userId, orgId, payload }) {
    const isMember = await this.repo.isUserMemberInOrg(userId, orgId);
    if (!isMember) { const e = new Error("You are not a member of this organization"); e.statusCode = 403; throw e; }

    const created = await this.repo.createFinancialDocument({
      campaignId: Number(payload.campaign_id),
      type: payload.type,
      fileId: Number(payload.file_id),
      issuedAt: new Date(payload.issued_at),
      amount: Number(payload.amount),
      currency: payload.currency,
    });

    await this.repo.logAudit({
      actorUserId: userId,
      action: "UPLOAD_FINANCIAL_DOCUMENT",
      entityType: "campaign",
      entityId: Number(payload.campaign_id),
      metadata: { orgId, documentId: created.id, type: payload.type },
    });

    return created;
  }
}

module.exports = NgoTransparencyService;
