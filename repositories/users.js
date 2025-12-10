const db = require('../database');
//to make sure that thee user 
module.exports = {
    async exists(user_id) {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE id = ? LIMIT 1",
            [user_id]
        );
        return rows.length > 0;
    }
};
