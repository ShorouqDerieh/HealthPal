class PatientProfileService {
    /*
    @param {PatientProfileRepository} repository
    */
    constructor(repository) {
        this.repository = repository;   }


    async getMyProfile(userId) {
        return this.repository.findProfileByUserId(userId);  }
        async upsertMyProfile(userId, profileData) {
            const {fullName, ...profileDetails} = profileData;
            if (fullName) {
                await this.repository.updateUserFullName(userId, fullName);  }

            await this.repository.upsertProfile(userId, profileDetails); 
        return this.repository.findProfileByUserId(userId);  }  
    async verifyPatientProfile(userId, verifiedByUserId) {
        await this.repository.verifyProfile(userId, verifiedByUserId); 
        return this.repository.findProfileByUserId(userId);  }


        async listPublicProfiles(filters){
return this.repository.findPublicProfiles(filters);
        }


        async getPublicProfiles(patientUserId){
            const profile =await this.repository.findProfileByUserId(patientUserId);
            if(!profile || !profile.is_verified || !profile.consent_to_display_case){
                return null;
            }
            return profile;}


            async addHistoryRecord(patientUserId,clinicalUserId,data)
            {

                
                const id =await this.repository.addHistoryRecord(patientUserId,clinicalUserId,data);
               const rows = await this.repository.getHistoryRecordsForPatient(patientUserId);
               return {id,records:rows};
            }
            async getFullHistory(patientUserId){
                
                return this.repository.getHistoryRecordsForPatient(patientUserId);
     }
     async getPublicHistory(patientUserId){
        const profile =await this.repository.findProfileByUserId(patientUserId);
        if(!profile || !profile.is_verified || !profile.consent_to_display_case){
            return null;
        }
        return this.repository.getPublicHistoryRecordsForPatient(patientUserId);
 }
 async createDonationGoal(patientUserId,data){
 
                return this.repository.createDonationGoal(patientUserId,data);
 }

async updateDonationGoal(patientUserId, goalId, data) {
   

    await this.repository.updateDonationGoal(patientUserId, goalId, data);

    const goals = await this.repository.getDonationGoalsForPatient(
      patientUserId,
      { publicOnly: false }
    );
    return goals.find((g) => g.id === goalId) || null;
  }

  async getDonationGoals(patientUserId,  actingUser) {
    if(actingUser.id !== patientUserId && !(actingUser.role.includes("doctor") || actingUser.role.includes("admin")) ){
                   
                return this.repository.getDonationGoalsForPatient(
      patientUserId,
      { publicOnly: true}
    );}
    return this.repository.getDonationGoalsForPatient(
      patientUserId,
      { publicOnly: false }
    );
  }
  async createRecoveryUpdate(patientUserId,actingUser, data) {
    
    const id =await this.repository.createRecoveryUpdate(patientUserId,actingUser ,data);
    const rows = await this.repository.getRecoveryUpdates(patientUserId,{
      publicOnly: false});
    return { id ,rows};
    }
async getRecoveryUpdates(patientUserId, actingUser) {
    if(actingUser.id !== patientUserId && !(actingUser.roles.includes("doctor") || actingUser.roles.includes("admin")) ){
                    return this.repository.getRecoveryUpdates(patientUserId,{
      publicOnly: true});
                }
    return this.repository.getRecoveryUpdates(patientUserId,{
      publicOnly: false});
  }
}
  module.exports = PatientProfileService;


