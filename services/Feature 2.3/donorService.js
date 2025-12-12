class DonorTransparencyService {
  constructor(repo) { this.repo = repo; }

  async summary({ donorUserId, filters }) {
    return this.repo.donorSummary(donorUserId, filters || {});
  }

  async listDonations({ donorUserId, filters }) {
    const limit = filters?.limit ? Number(filters.limit) : 20;
    const offset = filters?.offset ? Number(filters.offset) : 0;
    return this.repo.donorDonations(donorUserId, { ...filters, limit, offset });
  }

  async donationDetails({ donorUserId, donationId }) {
    const donation = await this.repo.findDonationById(donationId);
    if (!donation) { const e = new Error("Donation not found"); e.statusCode = 404; throw e; }
    if (donation.donor_user_id !== donorUserId) { const e = new Error("Forbidden"); e.statusCode = 403; throw e; }
    return this.repo.donorDonationDetails(donationId);
  }

  async publicFeedback({ donorUserId, donationId }) {
    const donation = await this.repo.findDonationById(donationId);
    if (!donation) { const e = new Error("Donation not found"); e.statusCode = 404; throw e; }
    if (donation.donor_user_id !== donorUserId) { const e = new Error("Forbidden"); e.statusCode = 403; throw e; }
    return this.repo.donorPublicFeedbackForDonation(donationId);
  }
}

module.exports = DonorTransparencyService;
