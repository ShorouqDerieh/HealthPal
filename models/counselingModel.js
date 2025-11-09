
const db=require('../database');
const Counseling = {
  getAll: (callback) => {
    db.query('SELECT * FROM counseling_sessions', callback);
  },
    getById: (id, callback) => {
    db.query('SELECT * FROM counseling_sessions WHERE id = ?', [id], callback);
  },
    create: (data, callback) => {
    const { counselor_user_id, patient_user_id, starts_at, ends_at, notes_encrypted } = data;
    const sql = `INSERT INTO counseling_sessions (counselor_user_id, patient_user_id, starts_at, ends_at, notes_encrypted)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [counselor_user_id, patient_user_id, starts_at, ends_at, notes_encrypted], callback);
  },
    update: (id, data, callback) => {
    const { notes_encrypted, status } = data;
    const sql = `UPDATE counseling_sessions SET notes_encrypted = ?, status = ? WHERE id = ?`;
    db.query(sql, [notes_encrypted, status, id], callback);
  },
    delete: (id, callback) => {
    db.query('DELETE FROM counseling_sessions WHERE id = ?', [id], callback);
  }
};
module.exports = Counseling;