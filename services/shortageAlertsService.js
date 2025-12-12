const shortageRepo = require('../repositories/shortageAlertsRepository')

exports.getOpenForMyOrg = async (req, res) => {
  try {
    const orgId = req.user.org_id;
    if (!orgId) return res.status(400).json({ message: 'No org_id on user' });
    const alerts = await shortageRepo.listOpenByOrg(orgId);
    return res.status(200).json({ count: alerts.length, alerts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.resolve = async (req, res) => {
  try {
    const ok = await shortageRepo.resolve(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ message: 'Alert not found or already resolved' });
    return res.status(200).json({ message: 'Alert resolved' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.resolveShortageAlert = async (req, res) => {
  try {
    const alertId = req.params.id;
    const userId = req.user.id;
    const roles = req.user.roles || [];
    if (!roles.includes('admin') && !roles.includes('ngo_staff')) {
      return res.status(403).json({
        message: 'You are not allowed to resolve shortage alerts'
      });
    }
    const resolved = await shortageRepo.resolveAlert(alertId, userId);
    if (!resolved) {
      return res.status(400).json({
        message: 'Alert not found or already resolved'
      });
    }
    return res.status(200).json({
      message: 'Shortage alert resolved successfully',
      alert_id: alertId
    });

  } catch (err) {
    console.error('Error resolving shortage alert:', err);
    return res.status(500).json({ error: err.message });
  }
};
