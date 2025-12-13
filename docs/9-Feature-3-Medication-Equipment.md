# Feature 3 – Medication & Equipment Coordination

## Overview
Feature 3 manages the full lifecycle of distributing critical medications and
medical equipment by connecting patients, NGOs, and volunteers in a controlled
and traceable workflow.

This feature ensures inventory consistency, prevents invalid state changes,
and provides real-time shortage detection.

---

## Problem Addressed
In crisis environments, access to medicines and medical equipment is limited,
while available resources must be distributed fairly and efficiently.
This feature provides a structured pipeline from request creation to verified
delivery.

---

## Core Workflow
1. User submits a request for medicine or equipment
2. Organizations publish available listings from inventory
3. Requests are matched with listings
4. A volunteer is assigned for delivery
5. Delivery status is tracked until completion
6. Inventory is updated and shortages are detected automatically

---

## Core Modules

### 1. Catalog / Listings
- Organizations publish available items linked to their inventory
- Listings support filtering (type, condition, search, sorting)
- Only authorized organization members can create listings

### 2. Requests
- Users submit requests with quantity, urgency, and notes
- Requesters can view and track their own requests
- Requests move through controlled statuses

### 3. Matching
- Matches are created between OPEN requests and AVAILABLE listings
- Listing becomes reserved after matching
- Prevents multiple matches for the same inventory item

### 4. Deliveries
- Volunteers are assigned to matched requests
- Delivery status transitions:
  SCHEDULED → IN_TRANSIT → DELIVERED / FAILED
- On successful delivery:
  - Request becomes FULFILLED
  - Match becomes FULFILLED
  - Inventory quantity is reduced

### 5. Proof & Verification
- Delivery proof files can be uploaded
- Strict permission checks apply
- Files are stored securely under `/uploads`

---

## Key Design Highlights
- Strict status transition rules
- Role-based access control and ownership checks
- Automatic inventory updates
- Shortage detection and alert generation

---

## Roles Involved
- Patient / User
- NGO Staff
- Volunteer
- Admin
