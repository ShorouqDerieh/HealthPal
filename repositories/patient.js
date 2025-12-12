const db = require('../database');


    async function isPatient(user_id) {
        const [rows] = await db.query(
            "SELECT user_id FROM patient_profiles WHERE user_id = ? LIMIT 1",
            [user_id]
        );
        return rows.length > 0;
    }
module.exports={
isPatient
};
