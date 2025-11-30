class SponsorshipService {

    /**
     * @param {SponsorshipRepository} repository 
     */
    constructor (repository){
this.repository=repository;
    }
    async createTreatmentForPatient({patientUserId,type ,description,providerOrgId}){
        const allowedTypes =["surgery","dialysis","cancer","rehab","other"];
        if(!allowedTypes.includes(type)){
            const error =new Error("Invalid Type");
            error.statusCode(400);
            throw error;

        }
       return this.repository.createTreatment({patientUserId,type,description,providerOrgId:providerOrgId||null}) ;
    }

    async createCampaignForTreatment({treatmentId, title, goalAmount, currency, story }){

        if (goalAmount<=0){
            const error =new Error("INVALID Goal Amount ");
            error.statusCode(400);
            throw error;
        }
        return this.repository.createCampaign({treatmentId, title, goalAmount, currency, story:story ||null });
    }
   async getCampaignDetails(campaignId) {
    const campaign = await this.repository.getCampaignWithStats(campaignId);
    if (!campaign) {
      const err = new Error("Campaign not found");
      err.statusCode = 404;
      throw err;
    }
    return campaign;
  }

  async listOpenCampaigns(filter) {
    return this.repository.listOpenCampaigns(filter);
  }

  async donateToCampaign({ campaignId, donorUserId, amount, currency, method }) {
    const campaign = await this.repository.findCampaignById(campaignId);
    if (!campaign) {
      const err = new Error("Campaign not found");
      err.statusCode = 404;
      throw err;
    }

    if (campaign.status !== "OPEN") {
      const err = new Error("Campaign is not open for donations");
      err.statusCode = 400;
      throw err;
    }

    if (currency !== campaign.currency) {
      const err = new Error("Currency mismatch");
      err.statusCode = 400;
      throw err;
    }

    if (amount <= 0) {
      const err = new Error("Donation amount must be positive");
      err.statusCode = 400;
      throw err;
    }

    const donation = await this.repository.createDonation({
      campaignId,
      donorUserId: donorUserId || null,
      amount,
      currency,
      method: method || null,
      paymentRef: null,
      paidAt: new Date(),
    });

    const updated = await this.repository.getCampaignWithStats(campaignId);
    if (
      Number(updated.collected_amount) >= Number(updated.goal_amount) &&
      updated.status === "OPEN"
    ) {
      await this.repository.updateCampaignStatus(campaignId, "FUNDED");
      updated.status = "FUNDED";
    }

    return {
      donation,
      campaign: updated,
    };
  }
}

module.exports = SponsorshipService;

