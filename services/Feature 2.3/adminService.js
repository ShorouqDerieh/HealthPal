class AdminTransparencyService {
  constructor(repo) { this.repo = repo; }

  async overview() {
    return this.repo.adminOverview();
  }

  async listDonations({ filters }) {
    const limit = filters?.limit ? Number(filters.limit) : 50;
    const offset = filters?.offset ? Number(filters.offset) : 0;
    return this.repo.adminDonations({ limit, offset });
  }

  async auditDonation({ actorUserId, donationId }) {
    const details = await this.repo.adminAuditDonation(donationId);
    if (!details) { const e = new Error("Donation not found"); e.statusCode = 404; throw e; }

    await this.repo.logAudit({
      actorUserId,
      action: "ADMIN_VIEW_DONATION_AUDIT",
      entityType: "donation",
      entityId: donationId,
      metadata: { campaignId: details.donation.campaign_id },
    });

    return details;
  }

  async flagCampaign({ actorUserId, payload }) {
    const campaignId = Number(payload.campaign_id);
    if (!payload.reason || payload.reason.length < 3) {
      const e = new Error("Reason is required");
      e.statusCode = 400;
      throw e;
    }
    await this.repo.flagCampaign({ campaignId, actorUserId, reason: payload.reason });
    return { campaignId, flagged: true };
  }
}

module.exports = AdminTransparencyService;
