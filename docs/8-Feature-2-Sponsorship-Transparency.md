# Feature 2 – Medical Sponsorship, Patient Profiles & Transparency

## Overview
Feature 2 implements a complete medical sponsorship ecosystem that allows donors
to fund patient treatments, view verified patient profiles, and track how donations
are used through a transparency dashboard.

This feature ensures trust, accountability, and ethical handling of medical donations.

---

## Sub-Feature 2.1 – Sponsor a Treatment

### Description
Allows doctors to create verified medical treatments and fundraising campaigns.
Donors can browse campaigns and contribute securely.

### Implemented Capabilities
- Treatment creation by doctors
- Fundraising campaigns linked to treatments
- Public listing of active campaigns
- Secure donation handling
- Support for multiple donation methods

### API Summary
- POST /sponsorship/treatments
- POST /sponsorship/campaigns
- GET /sponsorship/campaigns
- GET /sponsorship/campaigns/{id}
- POST /sponsorship/campaigns/{id}/donate

---

## Sub-Feature 2.2 – Patient Profiles & Case Transparency

### Description
Provides verified patient profiles with controlled visibility to balance privacy
and transparency.

### Implemented Capabilities
- Patient profile creation and updates
- Public and private profile views
- Doctor verification of cases
- Medical history management
- Donation goals and recovery updates

### API Summary
**Profiles**
- GET /profiles/me
- POST /profiles/me
- GET /profiles/public
- GET /profiles/public/{patientUserId}

**Verification & History**
- PATCH /profiles/{patientUserId}/verify
- POST /profiles/{patientUserId}/history
- GET /profiles/{patientUserId}/history
- GET /profiles/{patientUserId}/history/public

**Goals & Updates**
- POST /profiles/{patientUserId}/goals
- PATCH /profiles/{patientUserId}/goals/{goalId}
- GET /profiles/{patientUserId}/goals
- POST /profiles/{patientUserId}/updates
- GET /profiles/{patientUserId}/updates

---

## Sub-Feature 2.3 – Transparency Dashboard & Accountability

### Description
Shows how donated money is used by providing dashboards for donors, NGOs, patients,
and administrators.

### Implemented Capabilities
- Donation tracking and reporting
- NGO disbursement reporting
- Uploading invoices and receipts
- Patient feedback
- Administrative auditing and campaign flagging

### API Summary
**Admin**
- GET /transparency/admin/overview
- GET /transparency/admin/donations
- GET /transparency/admin/audit/{donationId}
- POST /transparency/admin/flag-campaign

**Donor**
- GET /transparency/donor/summary
- GET /transparency/donor/donations
- GET /transparency/donor/donations/{id}
- GET /transparency/donor/feedback/{donationId}

**NGO**
- GET /transparency/ngo/campaigns
- GET /transparency/ngo/campaigns/{campaignId}
- POST /transparency/ngo/disbursements
- POST /transparency/ngo/documents

**Patient**
- POST /transparency/patient/feedback
- GET /transparency/patient/feedback/my

---

## Roles Involved
- Doctor
- Donor
- Patient
- NGO Staff
- Admin
