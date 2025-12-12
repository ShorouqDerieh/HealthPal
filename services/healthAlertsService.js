const model = require('../repositories/healthAlertsRepository');

exports.CreateAlert = async (req, res) => {
  try {
    const {
      title,
      body,
      severity,
      region,
      source,
      published_at,
      status,
      expires_at
    } = req.body;

    const now = new Date();

    const data = {
      title,
      body,
      severity,
      region: region || null,
      source: source || "INTERNAL",
      published_at: published_at ? new Date(published_at) : now,
      status: status || "PUBLISHED",
      expires_at: expires_at || null
    };

    const created = await model.createAlert(data);
    console.log('CREATED ALERT:', created);
    if (
      created.status === 'PUBLISHED' &&
      created.severity === 'URGENT' &&
      created.region
    ) {
      console.log('CALLING notifyUsers FOR ALERT', created.id);
      await model.notifyUsers(created);
    }

    res.status(201).json({
      success: true,
      data: created,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.showAllAlerts = async (req, res) => {
  try {
    const region = req.query.region;
    const show = await model.showAllAlerts(region)
    res.json({
      success: true,
      data: show,
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.showAdminAlerts = async (req, res) => {
  try {
    const {
      status,
      severity,
      region,
      source,
      from_date,
      to_date
    } = req.query;
    const alerts = await model.showAdminAlert({
      status,
      severity,
      region,
      source,
      fromDate: from_date || null,
      toDate: to_date || null
    });
    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      body,
      severity,
      region,
      source,
      status,
      expires_at,
      published_at,
    } = req.body;
    const fields = {};
    if (title !== undefined) fields.title = title;
    if (body !== undefined) fields.body = body;
    if (severity !== undefined) fields.severity = severity;
    if (region !== undefined) fields.region = region;
    if (source !== undefined) fields.source = source;
    if (status !== undefined) fields.status = status;
    if (expires_at !== undefined) fields.expires_at = expires_at;
    if (published_at !== undefined) fields.published_at = new Date(published_at);
    if (status === 'PUBLISHED' && !published_at) {
      fields.published_at = new Date();
    }
    const updated = await model.updateAlert(id, fields);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicAlertById = async (req, res) => {
  try {
    const alert = await model.getPublicAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found or not available',
      });
    }
    res.json({
      success: true,
      data: alert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAdminAlertById = async (req, res) => {
  try {
    const alert = await model.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }
    res.json({
      success: true,
      data: alert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAlertAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const alertId = req.params.id;
    await model.markAlertAsRead(userId, alertId);
    res.status(200).json({ message: 'Alert marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUnreadAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await model.getUnreadAlerts(userId);
    res.status(200).json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
