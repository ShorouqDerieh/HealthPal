# Feature 1 – Remote Medical Consultations & Communication

## Overview
Feature 1 provides the core doctor–patient interaction in the HealthPal platform.
It enables patients to book remote medical appointments, conduct live or asynchronous
consultation sessions, and communicate across language barriers using AI-powered
medical translation.

This feature is designed to work reliably even in low-bandwidth environments.

---

## Sub-Feature 1.1 – Appointment Booking & Management

### Description
Allows patients to book appointments with doctors based on available time slots.
Doctors manage their availability, confirm or reject appointments, and both parties
can view or cancel appointments securely.

### Implemented Capabilities
- User authentication using JWT
- Doctor discovery and availability management
- Appointment booking with conflict prevention
- Appointment confirmation and cancellation
- Role-based access control (patient, doctor, admin)

### API Summary
**Authentication**
- POST /auth/register
- POST /auth/login

**Doctors & Availability**
- GET /doctors
- GET /doctors/{id}/availability
- POST /doctors/{id}/availability

**Appointments**
- POST /appointments
- PATCH /appointments/{id}/confirm
- PATCH /appointments/{id}/cancel
- GET /appointments/{id}
- GET /appointments/my

---

## Sub-Feature 1.2 – Consultation Sessions & Messaging

### Description
Extends appointments into live or asynchronous consultation sessions with support
for secure messaging, file sharing, and low-bandwidth communication modes.

### Implemented Capabilities
- Audio-only consultation sessions
- Asynchronous chat-based consultations
- Secure messaging between doctor and patient
- File metadata sharing
- Typing indicators
- Bandwidth mode switching
- Session lifecycle management

### API Summary
**Consultation Sessions**
- POST /consult/sessions/audio
- POST /consult/sessions/async
- PATCH /consult/sessions/{id}/bandwidth
- POST /consult/sessions/{id}/end

**Messages & Interaction**
- POST /consult/sessions/{id}/messages
- GET /consult/sessions/{id}/messages
- GET /consult/sessions/{id}/messages/unread
- GET /consult/sessions/{id}/messages/stream
- POST /consult/sessions/{id}/typing
- GET /consult/sessions/{id}/typing

**File Handling**
- POST /consult/files
- GET /consult/files/{id}

---

## Sub-Feature 1.3 – Medical Translation (OpenAI Integration)

### Description
Provides AI-powered medical text translation to support communication between
Arabic-speaking patients and international doctors.

### Implemented Capabilities
- Secure translation endpoint
- Automatic language detection
- Arabic ↔ English translation
- Medical domain optimization
- Error handling for failed requests

### External API Usage
This sub-feature integrates the OpenAI API through a service layer to ensure
maintainability and medical domain accuracy.

### API Summary
- POST /translation/preview

---

## Roles Involved
- Patient
- Doctor
- Admin

Only authenticated and authorized users can access this feature.
