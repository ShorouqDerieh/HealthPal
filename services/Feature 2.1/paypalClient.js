const axios = require("axios");

class PayPalClient {
  constructor() {
    this.baseUrl = process.env.PAYPAL_BASE_URL; // sandbox
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.secret = process.env.PAYPAL_SECRET;
  }

  async getAccessToken() {
    const auth = Buffer.from(
      `${this.clientId}:${this.secret}`
    ).toString("base64");

    const res = await axios.post(
      `${this.baseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.data.access_token;
  }

  async createOrder(amount, currency) {
  const token = await this.getAccessToken();

  const res = await axios.post(
    `${this.baseUrl}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",  
            value: amount.toFixed(2),
          },
        },
      ],
     application_context: {
  shipping_preference: "NO_SHIPPING",
  user_action: "PAY_NOW",
  return_url: "https://example.com/paypal/success",
  cancel_url: "https://example.com/paypal/cancel"
},
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}


  async captureOrder(orderId) {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
}

module.exports = PayPalClient;
