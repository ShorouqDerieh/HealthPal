const ChatModel = require('../repositories/anonChatModel.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
function generatePseudonym() {
    return "anon_" + Math.floor(100000 + Math.random() * 900000);
}
async function startAnonymousChat(counselor_id) {

    const userExists = await UserModel.exists(counselor_id);
    const isDoctor = await DoctorModel.isDoctor(counselor_id);

    if (!userExists || !isDoctor) {
        throw new Error("Counselor not found");
    }

    const pseudonym = generatePseudonym();
    const chat_id = await ChatModel.createSession(counselor_id, pseudonym);
    return { chat_id, pseudonym };
}
module.exports = {
    startAnonymousChat
};
