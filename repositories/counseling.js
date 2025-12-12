
const db = require('../database');


    async function createSession(data) {
        const sql = `
            INSERT INTO counseling_sessions
            (counselor_user_id, patient_user_id, starts_at, ends_at, status, notes_encrypted)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            data.counselor_id,
            data.patient_id,
            data.starts_at,
            data.ends_at,
            'SCHEDULED',
            data.notes
        ]);

        return result;
    }
    module.exports = {
   createSession
};
