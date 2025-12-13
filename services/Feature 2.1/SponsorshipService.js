const PayPalClient = require("./paypalClient");

class SponsorshipService {

    /**
     * @param {SponsorshipRepository} repository 
     */
    constructor (repository){
this.repository=repository;
this.paypal=new PayPalClient();
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
  async createPayPalDonation({ campaignId, amount, currency }) {
  const campaign = await this.repository.findCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  return this.paypal.createOrder(amount, currency);
}
async confirmPayPalDonation({ orderId, campaignId, donorUserId }) {
  const capture = await this.paypal.captureOrder(orderId);

  if (capture.status !== "COMPLETED") {
    const err = new Error("Payment not completed");
    err.statusCode = 400;
    throw err;
  }

  const amount = capture.purchase_units[0].payments.captures[0].amount.value;
  const currency = capture.purchase_units[0].payments.captures[0].amount.currency_code;
  const paymentRef = capture.id;

  const donation = await this.repository.createDonation({
    campaignId,
    donorUserId,
    amount,
    currency,
    method: "paypal",
    paymentRef,
    paidAt: new Date(),
  });

  return donation;
}

}

module.exports = SponsorshipService;

