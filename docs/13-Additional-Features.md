# Additional Features

## Overview
In addition to the core functional features, HealthPal includes several
cross-cutting system features that enhance security, usability, reliability,
and user experience across the entire platform.

These features support the main workflows without being tied to a single
domain feature.

---

## Role-Based Access Control (RBAC)
HealthPal enforces strict role-based access control across all APIs using JWT.

- Each request is authenticated using a valid JWT token
- Access to endpoints is restricted based on user roles:
  - Patient
  - Doctor / Counselor
  - Volunteer
  - NGO Staff
  - Admin
- Unauthorized access attempts are blocked at the middleware level

---

## Secure File Uploads
The system supports secure file uploads for various purposes such as:
- Medical documents
- Delivery proof files
- Invoices and receipts
- Consultation attachments

Key characteristics:
- File uploads handled using Multer
- Files stored under the `/uploads` directory
- Strict permission checks before upload and access
- Metadata stored in the database, not raw file content

---

## Email Notifications
HealthPal sends automated email notifications to keep users informed about
important system events.

Use cases include:
- Public health alerts
- Inventory shortage notifications
- Appointment and session updates
- Sponsorship and donation events

Email delivery is implemented using an SMTP service through Nodemailer.

---

## Inventory Shortage Detection
The system automatically monitors inventory levels for medications and
equipment.

- Inventory quantities are reduced after successful deliveries
- When quantities fall below a defined threshold, shortage alerts are generated
- Alerts help NGOs and administrators respond proactively

---

## User Notification Preferences
Users can customize how they receive notifications.

Supported preferences:
- Enable or disable email notifications
- Select preferred language (default: Arabic)

This ensures respectful and user-controlled communication.

---

## Background Jobs & Scheduling
HealthPal uses scheduled background jobs to handle periodic system tasks.

Examples:
- Checking inventory shortages
- Cleaning expired alerts
- Sending scheduled notifications

These tasks are implemented using `node-cron`.

---

## Security & Reliability Considerations
- Input validation using fastest-validator
- Rate limiting to prevent abuse
- Secure password hashing with bcrypt
- Encrypted storage for sensitive data
- Centralized error handling and logging
