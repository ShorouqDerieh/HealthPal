const db = require('../database');
const emailService=require('../services/emailServices')
exports.findOpenByInventoryItemId = async (inventoryItemId) => {
  const [rows] = await db.query(
    `SELECT id
     FROM resource_shortage_alerts
     WHERE inventory_item_id = ? AND status = 'OPEN'
     LIMIT 1`,
    [inventoryItemId]
  );
  return rows[0] || null;
};

exports.createAlert = async ({ inventoryItemId, orgId, currentQty, threshold }) => {
  const [r] = await db.query(
    `INSERT INTO resource_shortage_alerts
      (inventory_item_id, org_id, current_quantity, threshold)
     VALUES (?, ?, ?, ?)`,
    [inventoryItemId, orgId, currentQty, threshold]
  );
  return r.insertId;
};
exports.checkAndCreateForInventoryItem = async (inventoryItemId) => {
  const [rows] = await db.query(
    `SELECT id, org_id, quantity, min_threshold, name
FROM inventory_items
WHERE id = ?
`,
    [inventoryItemId]
  );

  const item = rows[0];
  if (!item) return;

  if (item.min_threshold == null) return; 
  if (item.quantity >= item.min_threshold) return;

  const open = await exports.findOpenByInventoryItemId(inventoryItemId);
  if (open) return;

  const alertId=await exports.createAlert({
    inventoryItemId,
    orgId: item.org_id || null,
    currentQty: item.quantity,
    threshold: item.min_threshold
  });
  const [recipients] = await db.query(
  `
  SELECT DISTINCT u.id AS user_id, u.email
  FROM users u
  JOIN user_org_memberships m ON m.user_id = u.id
  WHERE m.org_id = ?
    AND u.is_active = TRUE
    AND u.email IS NOT NULL
    AND u.email <> ''
    AND (m.role_in_org IN ('admin','ngo_staff'))
  `,
  [item.org_id]
);
  for (const r of recipients) {
  await emailService.sendShortageAlertEmail(
    { user_id: r.user_id, email: r.email },
    {
      alert_id: alertId,
      item_name: item.name || `Item #${item.id}`,
      current_quantity: item.quantity,
      threshold: item.min_threshold
    }
  );
}


/* await db.query(
  `UPDATE resource_shortage_alerts
   SET email_sent = TRUE, resolb_at = NOW()
   WHERE id = ?`,
  [alertId]
); */
};

exports.listOpenByOrg = async (orgId) => {
  const [rows] = await db.query(
    `SELECT *
     FROM resource_shortage_alerts
     WHERE org_id = ? AND status='OPEN'
     ORDER BY created_at DESC`,
    [orgId]
  );
  return rows;
};

exports.resolve = async (alertId, userId) => {
  const [r] = await db.query(
    `UPDATE resource_shortage_alerts
     SET status='RESOLVED', resolved_at=NOW(), resolved_by=?
     WHERE id=? AND status='OPEN'`,
    [userId, alertId]
  );
  return r.affectedRows > 0;
};
exports.resolveAlert = async (alertId, userId) => {
  const [result] = await db.query(
    `
    UPDATE resource_shortage_alerts
    SET status = 'RESOLVED',
        resolved_at = NOW(),
        resolved_by = ?
    WHERE id = ?
      AND status = 'OPEN'
    `,
    [userId, alertId]
  );

  return result.affectedRows > 0;
};
