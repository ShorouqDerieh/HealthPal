const cron = require('node-cron');
const db = require('../database');

cron.schedule(' 1 0 * * *', async () => {
  console.log('⏰ Checking for expired items...');

  const [result] = await db.query(`
    UPDATE listings l
    JOIN inventory_items i ON i.id = l.inventory_item_id
    SET l.status = 'UNAVAILABLE'
    WHERE l.status = 'AVAILABLE'
      AND i.expiration_date IS NOT NULL
      AND DATE(i.expiration_date) < CURRENT_DATE
  `);

  console.log(`✅ Expiry check complete. ${result.affectedRows} items marked as expired.`);
}, {
  timezone: 'Asia/Hebron'
});
