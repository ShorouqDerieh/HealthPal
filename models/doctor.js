const db = require('../database');

module.exports = {
    async isDoctor(user_id) {
        const [rows] = await db.query(
            "SELECT user_id FROM doctor_profiles WHERE user_id = ? LIMIT 1",
            [user_id]
        );
        return rows.length > 0;
    }
};
//make sure that the counseling is a doctor