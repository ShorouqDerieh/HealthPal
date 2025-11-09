
const Counseling = require('../models/counselingModel');

exports.getAllSessions = (req, res) => {
  Counseling.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getSessionById = (req, res) => {
  Counseling.getById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row.length) return res.status(404).json({ message: 'Session not found' });
    res.json(row[0]);
  });
};

exports.createSession = (req, res) => {
  Counseling.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Session created', id: result.insertId });
  });
};

exports.updateSession = (req, res) => {
  Counseling.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Session updated successfully' });
  });
};

exports.deleteSession = (req, res) => {
  Counseling.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Session deleted' });
  });
};
