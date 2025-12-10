require('dotenv').config();
const nodemailer = require('nodemailer');
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;
if (!host || !user || !pass) {
  console.warn(
    '[EMAIL] SMTP config is incomplete. Emails will fail until you set SMTP_HOST, SMTP_USER, SMTP_PASS in .env'
  );
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, 
  auth: {
    user,
    pass,
  },
});

async function sendHealthAlertEmail(user, alert, message) {
  if (!user.email) {
    console.log(
      `[EMAIL] skipped: user ${user.user_id} has no email`
    );
    return;
  }

  const subject =
    alert.severity === 'URGENT'
      ? `URGENT Health Alert: ${alert.title}`
      : `Health Alert: ${alert.title}`;

  try {
    const html = `
  <h2>تنبيه صحي (${alert.severity})</h2>
  <h3>${alert.title}</h3>
  <p>أهلنا في <strong>${alert.region}</strong>،</p>
  <p>${alert.body}</p>
  <p>
    الرجاء اتخاذ الإجراءات الوقائية اللازمة واتباع التعليمات الرسمية حتى إشعار آخر.
  </p>
  <br>
  <p>مع التحية،<br>فريق HealthPal</p>
`;

const text = `
تنبيه صحي (${alert.severity})
العنوان: ${alert.title}

أهلنا في ${alert.region}،

${alert.body}

الرجاء اتخاذ الإجراءات الوقائية اللازمة، واتباع التعليمات الرسمية حتى إشعار آخر.

مع التحية،
فريق HealthPal
`;
    const info = await transporter.sendMail({
      from,
      to: user.email,
      subject,
      text,      
      html, 
    });

    console.log(
      `[EMAIL] Sent to ${user.email} for user ${user.user_id} | messageId=${info.messageId}`
    );
  } catch (err) {
    console.error(
      `[EMAIL] Error sending email to ${user.email}:`,
      err.message
    );
  }
}

module.exports = {
  sendHealthAlertEmail,
};
