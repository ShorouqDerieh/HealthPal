# External APIs Integration

HealthPal integrates external APIs to enhance functionality and scalability.

---

## OpenAI API
Used for AI-powered medical text translation to facilitate communication
between doctors and patients speaking different languages.

Key Benefits:
- Medical domain-aware translation
- Arabic ↔ English support
- Improved consultation accuracy

---

## Daily API
Used to automatically generate webinar and workshop meeting rooms when
a meeting link is not manually provided.

---

## SMTP Email Service
Used for sending:
- Health alerts
- Inventory shortage notifications
- System and workflow notifications

---

---

## PayPal API
Used for secure online donation processing within the medical sponsorship system.

HealthPal integrates PayPal using a two-step payment flow (order creation and
payment capture) to ensure that donations are only recorded after successful
payment confirmation.

Key Characteristics:
- Secure handling of online donations
- JWT-protected PayPal endpoints
- Enforced currency consistency (USD)
- Donations stored only after successful payment capture
- Full transaction traceability using PayPal payment references

This integration ensures financial transparency, accountability, and trust
between donors, NGOs, and patients.
