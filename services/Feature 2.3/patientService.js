class PatientTransparencyService {
  constructor(repo) { this.repo = repo; }

  async createFeedback({ patientUserId, payload }) {
    const donationId = Number(payload.donation_id);
    const donation = await this.repo.getDonationWithCampaign(donationId);
    if (!donation) { const e = new Error("Donation not found"); e.statusCode = 404; throw e; }

    if (Number(donation.patient_user_id) !== Number(patientUserId)) {
      const e = new Error("Forbidden: this donation is not linked to your case");
      e.statusCode = 403;
      throw e;
    }

    return this.repo.createPatientDonationFeedback({
      donationId,
      patientUserId,
      rating: payload.rating !== undefined ? Number(payload.rating) : null,
      feedbackText: payload.feedback_text,
      isPublic: payload.is_public,
    });
  }

  async myFeedback({ patientUserId, filters }) {
    const limit = filters?.limit ? Number(filters.limit) : 20;
    const offset = filters?.offset ? Number(filters.offset) : 0;
    return this.repo.listMyFeedback(patientUserId, { limit, offset });
  }
}

module.exports = PatientTransparencyService;
