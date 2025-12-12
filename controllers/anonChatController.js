const ChatModel = require('../repositories/anonChatModel.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');

function generatePseudonym() {
    return "anon_" + Math.floor(100000 + Math.random() * 900000);
}

async function start(req, res) {
    try {
        const { counselor_id } = req.body;

        if (!counselor_id) {
            return res.status(400).json({ error: "Missing counselor_id" });
        }

        if (!await UserModel.exists(counselor_id) || !await DoctorModel.isDoctor(counselor_id)) {
            return res.status(404).json({ error: "Counselor not found" });
        }

        const pseudonym = generatePseudonym();
        const chat_id = await ChatModel.createSession(counselor_id, pseudonym);

        return res.status(201).json({
            message: "Anonymous chat started",
            chat_id,
            pseudonym
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { start };
