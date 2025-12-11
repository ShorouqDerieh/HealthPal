const axios = require('axios');
const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_BASE_URL =
  process.env.DAILY_API_BASE_URL || 'https://api.daily.co/v1';
async function createDailyRoom({ title, startsAt, endsAt }) {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not set');
  }
  const safeName =
    (title || 'HealthPalRoom').replace(/[^A-Za-z0-9_-]/g, '_') +
    '_' +
    Date.now();

  const body = {
    name: safeName,
    privacy: 'public', 
  };
  const props = {};
  if (startsAt) {
    const nbf = Math.floor(new Date(startsAt).getTime() / 1000) - 15 * 60; 
    props.nbf = nbf;
  }
  if (endsAt) {
    const exp = Math.floor(new Date(endsAt).getTime() / 1000) + 15 * 60; 
    props.exp = exp;
  }
  if (Object.keys(props).length > 0) {
    body.properties = props;
  }

  const res = await axios.post(`${DAILY_BASE_URL}/rooms`, body, {
    headers: {
      Authorization: `Bearer ${DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  return res.data; 
}

module.exports = {
  createDailyRoom,
};
