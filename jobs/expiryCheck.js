const cron = require('node-cron');
const db = require('../database');

cron.schedule('1 0 * * *', async () => {
  console.log('Checking for expired items...');

  const [result] = await db.query(`
    UPDATE listings
    JOIN inventory_items ON inventory_items.id = listings.inventory_item_id
    SET listings.status = 'UNAVAILABLE'
    WHERE listings.status = 'AVAILABLE'
      AND inventory_items.expiration_date IS NOT NULL
      AND DATE(inventory_items.expiration_date) < CURRENT_DATE
  `);

  console.log(`Expiry check complete. ${result.affectedRows} items marked as expired.`);
}, {
  timezone: 'Asia/Hebron'
});
