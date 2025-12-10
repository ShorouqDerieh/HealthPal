const cron = require('node-cron');
const db = require('../database');
//every hour
cron.schedule('0 * * * *',async()=>{
     try {
      console.log('AlertsCron Running archive job...');
        const [result] = await db.query(
        `
        UPDATE alerts
        SET status = 'ARCHIVED'
        WHERE status = 'PUBLISHED'
          AND expires_at IS NOT NULL
          AND expires_at < NOW()
        `
      );
       console.log(
        `AlertsCron Archived ${result.affectedRows} expired alerts.`)
       }
       catch (err) {
      console.error('AlertsCron Error while archiving alerts:', err);
    }
})