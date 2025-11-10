
-- Identity
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  locale VARCHAR(8) DEFAULT 'ar',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE organizations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('NGO','CLINIC','PHARMACY','HOSPITAL') NOT NULL,
  verified_at DATETIME NULL
);

CREATE TABLE user_org_memberships (
  user_id BIGINT NOT NULL,
  org_id BIGINT NOT NULL,
  role_in_org VARCHAR(64),
  PRIMARY KEY (user_id, org_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- Telehealth
CREATE TABLE doctor_profiles (
  user_id BIGINT PRIMARY KEY,
  license_no VARCHAR(64),
  bio TEXT,
  years_experience INT,
  is_international BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE specialties (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE doctor_specialties (
  doctor_user_id BIGINT NOT NULL,
  specialty_id BIGINT NOT NULL,
  PRIMARY KEY (doctor_user_id, specialty_id),
  FOREIGN KEY (doctor_user_id) REFERENCES doctor_profiles(user_id),
  FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

CREATE TABLE appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_user_id BIGINT NOT NULL,
  doctor_user_id BIGINT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL,
  mode ENUM('video','audio','async') NOT NULL,
  FOREIGN KEY (patient_user_id) REFERENCES users(id),
  FOREIGN KEY (doctor_user_id) REFERENCES users(id),
  INDEX (doctor_user_id, starts_at),
  INDEX (patient_user_id, starts_at)
);

-- Sponsorship
CREATE TABLE patient_profiles (
  user_id BIGINT PRIMARY KEY,
  dob DATE,
  gender ENUM('M','F','X') NULL,
  blood_type VARCHAR(3),
  primary_condition VARCHAR(255),
  consent_to_display_case BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE treatments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_user_id BIGINT NOT NULL,
  type ENUM('surgery','dialysis','cancer','rehab','other') NOT NULL,
  description TEXT,
  provider_org_id BIGINT NULL,
  FOREIGN KEY (patient_user_id) REFERENCES users(id),
  FOREIGN KEY (provider_org_id) REFERENCES organizations(id)
);

CREATE TABLE sponsorship_campaigns (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  treatment_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  status ENUM('OPEN','FUNDED','CLOSED') NOT NULL DEFAULT 'OPEN',
  story TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id),
  INDEX(status)
);

CREATE TABLE donations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_id BIGINT NOT NULL,
  donor_user_id BIGINT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  paid_at DATETIME NOT NULL,
  payment_ref VARCHAR(128),
  method VARCHAR(32),
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  FOREIGN KEY (donor_user_id) REFERENCES users(id),
  INDEX(campaign_id, paid_at)
);




-- Recommended session defaults
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Use InnoDB & utf8mb4 everywhere
-- You can wrap in a schema if you prefer:
-- CREATE DATABASE healthpal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE healthpal;

-- =====================================================================
-- SHARED / SECURITY / AUDIT
-- =====================================================================

CREATE TABLE files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_user_id BIGINT NULL,
  storage_url VARCHAR(1024) NOT NULL,
  mime VARCHAR(128),
  sha256 CHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  scope VARCHAR(64) NOT NULL,            -- e.g., 'share_medical_history', 'public_case_page'
  granted_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  UNIQUE KEY uq_user_scope (user_id, scope, granted_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  actor_user_id BIGINT NULL,
  action VARCHAR(128) NOT NULL,          -- e.g., 'VIEW_RECORD', 'UPDATE_DONATION'
  entity_type VARCHAR(64) NOT NULL,      -- e.g., 'appointment','donation'
  entity_id BIGINT NULL,
  ip_address VARBINARY(16) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (entity_type, entity_id),
  INDEX (action, created_at),
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- TELEHEALTH (remaining tables)
-- =====================================================================

CREATE TABLE doctor_availability (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  doctor_user_id BIGINT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  timezone VARCHAR(64) NOT NULL,
  slot_status ENUM('OPEN','BLOCKED','BOOKED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_user_id) REFERENCES doctor_profiles(user_id),
  INDEX (doctor_user_id, starts_at),
  CHECK (ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consult_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  appointment_id BIGINT NOT NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME NULL,
  bandwidth_mode ENUM('full','low','async') NOT NULL DEFAULT 'full',
  recording_url VARCHAR(1024) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id),
  INDEX (appointment_id, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consult_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  sender_user_id BIGINT NOT NULL,
  message_type ENUM('text','file') NOT NULL,
  body TEXT NULL,
  file_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES consult_sessions(id),
  FOREIGN KEY (sender_user_id) REFERENCES users(id),
  FOREIGN KEY (file_id) REFERENCES files(id),
  INDEX (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE translation_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  source_lang VARCHAR(8) NOT NULL,       -- e.g., 'ar'
  target_lang VARCHAR(8) NOT NULL,       -- e.g., 'en'
  request_text TEXT NOT NULL,
  translated_text TEXT NULL,
  translator_user_id BIGINT NULL,        -- could be staff/volunteer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES consult_sessions(id),
  FOREIGN KEY (translator_user_id) REFERENCES users(id),
  INDEX (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SPONSORSHIP TRANSPARENCY (remaining tables)
-- =====================================================================

CREATE TABLE financial_documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_id BIGINT NOT NULL,
  type ENUM('invoice','receipt') NOT NULL,
  file_id BIGINT NOT NULL,
  issued_at DATETIME NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  FOREIGN KEY (file_id) REFERENCES files(id),
  INDEX (campaign_id, issued_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE disbursements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_id BIGINT NOT NULL,
  to_org_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  disbursed_at DATETIME NOT NULL,
  note VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  FOREIGN KEY (to_org_id) REFERENCES organizations(id),
  INDEX (campaign_id, disbursed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- MEDICATION & EQUIPMENT COORDINATION
-- =====================================================================

CREATE TABLE inventory_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id BIGINT NULL,
  kind ENUM('medicine','equipment') NOT NULL,
  name VARCHAR(255) NOT NULL,
  form_factor VARCHAR(128) NULL,         -- e.g., tablet, vial, mask
  dosage_or_specs VARCHAR(255) NULL,     -- e.g., 500mg; or dimensions/specs for equipment
  expiration_date DATE NULL,
  `condition` ENUM('new','used','refurb') NOT NULL DEFAULT 'new',
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(32) NOT NULL DEFAULT 'unit',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  INDEX (kind, name),
  INDEX (org_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE listings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  inventory_item_id BIGINT NOT NULL,
  lister_type ENUM('PHARMACY','NGO','HOSPITAL','DONOR') NOT NULL,
  status ENUM('AVAILABLE','RESERVED','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
  INDEX (status),
  INDEX (lister_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  requester_user_id BIGINT NOT NULL,
  type ENUM('medicine','equipment') NOT NULL,
  name VARCHAR(255) NOT NULL,
  dosage_or_specs VARCHAR(255) NULL,
  urgency ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'LOW',
  quantity INT NOT NULL DEFAULT 1,
  unit VARCHAR(32) NOT NULL DEFAULT 'unit',
  location_geo VARCHAR(64) NULL,         -- e.g., "31.5,34.5" or WKT; replace with POINT if desired
  notes TEXT NULL,
  status ENUM('OPEN','MATCHED','FULFILLED','CANCELLED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_user_id) REFERENCES users(id),
  INDEX (type, urgency, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE matches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  request_id BIGINT NOT NULL,
  listing_id BIGINT NOT NULL,
  matched_by_user_id BIGINT NOT NULL,
  matched_at DATETIME NOT NULL,
  status ENUM('PENDING','ACCEPTED','DECLINED','FULFILLED') NOT NULL DEFAULT 'PENDING',
  FOREIGN KEY (request_id) REFERENCES requests(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (matched_by_user_id) REFERENCES users(id),
  UNIQUE KEY uq_request_listing (request_id, listing_id),
  INDEX (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE deliveries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  match_id BIGINT NOT NULL,
  volunteer_user_id BIGINT NULL,
  pickup_time DATETIME NULL,
  dropoff_time DATETIME NULL,
  status ENUM('SCHEDULED','IN_TRANSIT','DELIVERED','FAILED') NOT NULL DEFAULT 'SCHEDULED',
  proof_file_id BIGINT NULL,             -- photo/signature
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (volunteer_user_id) REFERENCES users(id),
  FOREIGN KEY (proof_file_id) REFERENCES files(id),
  INDEX (status),
  INDEX (match_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- EDUCATION & PUBLIC HEALTH
-- =====================================================================

CREATE TABLE articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  body_html MEDIUMTEXT NOT NULL,
  lang ENUM('ar','en') NOT NULL DEFAULT 'ar',
  category VARCHAR(64) NULL,
  published_at DATETIME NULL,
  author_user_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_user_id) REFERENCES users(id),
  INDEX (lang, published_at),
  INDEX (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  severity ENUM('INFO','WARN','URGENT') NOT NULL DEFAULT 'INFO',
  region VARCHAR(128) NULL,              -- e.g., governorate or area
  source VARCHAR(64) NULL,               -- e.g., 'MOH','WHO','External'
  published_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (region, published_at),
  INDEX (severity, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE webinars (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  host_org_id BIGINT NULL,
  meeting_link VARCHAR(1024) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (host_org_id) REFERENCES organizations(id),
  INDEX (starts_at),
  CHECK (ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- MENTAL HEALTH & COMMUNITY
-- =====================================================================

CREATE TABLE counseling_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  counselor_user_id BIGINT NOT NULL,
  patient_user_id BIGINT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  status ENUM('SCHEDULED','CANCELLED','COMPLETED','NO_SHOW') NOT NULL DEFAULT 'SCHEDULED',
  notes_encrypted LONGBLOB NULL,         -- store encrypted blob; keep keys outside DB
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (counselor_user_id) REFERENCES users(id),
  FOREIGN KEY (patient_user_id) REFERENCES users(id),
  INDEX (counselor_user_id, starts_at),
  INDEX (patient_user_id, starts_at),
  CHECK (ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE support_groups (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  topic VARCHAR(255) NOT NULL,
  description TEXT NULL,
  is_moderated BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE support_group_members (
  group_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  joined_at DATETIME NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES support_groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE support_group_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  group_id BIGINT NOT NULL,
  sender_user_id BIGINT NULL,         -- NULL when anonymous
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES support_groups(id),
  FOREIGN KEY (sender_user_id) REFERENCES users(id),
  INDEX (group_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE anon_chats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  counselor_user_id BIGINT NOT NULL,
  pseudonym VARCHAR(64) NOT NULL,     -- user-facing alias instead of user_id
  started_at DATETIME NOT NULL,
  ended_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (counselor_user_id) REFERENCES users(id),
  INDEX (counselor_user_id, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE anon_chat_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chat_id BIGINT NOT NULL,
  is_from_user BOOLEAN NOT NULL,      -- true: from pseudonymous user; false: counselor
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES anon_chats(id),
  INDEX (chat_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- NGOS & MEDICAL MISSIONS
-- =====================================================================

CREATE TABLE missions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  org_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  region VARCHAR(128) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  mission_type ENUM('mobile_clinic','surgery_camp','specialist_visit') NOT NULL,
  status ENUM('PLANNED','ONGOING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  INDEX (region, starts_at),
  CHECK (ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mission_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  mission_id BIGINT NOT NULL,
  doctor_user_id BIGINT NULL,          -- may be assigned later
  slot_starts_at DATETIME NOT NULL,
  slot_ends_at DATETIME NOT NULL,
  location VARCHAR(255) NULL,
  capacity INT NOT NULL DEFAULT 1,
  filled_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mission_id) REFERENCES missions(id),
  FOREIGN KEY (doctor_user_id) REFERENCES users(id),
  INDEX (mission_id, slot_starts_at),
  CHECK (slot_ends_at > slot_starts_at),
  CHECK (filled_count <= capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mission_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  mission_id BIGINT NOT NULL,
  requester_user_id BIGINT NOT NULL,
  requested_service VARCHAR(255) NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED','SERVED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mission_id) REFERENCES missions(id),
  FOREIGN KEY (requester_user_id) REFERENCES users(id),
  INDEX (mission_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- EXTERNAL API INTEGRATIONS
-- =====================================================================

CREATE TABLE external_providers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  type ENUM('alert_feed','knowledge_base','telemetry') NOT NULL,
  base_url VARCHAR(512) NULL,
  api_key_ref VARCHAR(128) NULL,     -- reference to secrets manager, not the key itself
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_extprov_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE provider_sync_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  provider_id BIGINT NOT NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME NULL,
  status ENUM('SUCCESS','PARTIAL','FAILED') NOT NULL,
  fetched_count INT NOT NULL DEFAULT 0,
  error_blob TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES external_providers(id),
  INDEX (provider_id, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- OPTIONAL QUALITY-OF-LIFE INDEXES (add as needed under load)
-- =====================================================================

-- Example: speeding up transparency dashboard joins
CREATE INDEX idx_fin_docs_campaign ON financial_documents (campaign_id, type, issued_at);
CREATE INDEX idx_disb_campaign ON disbursements (campaign_id, disbursed_at);

-- Example: messaging hot paths
CREATE INDEX idx_consult_msg_sender_time ON consult_messages (sender_user_id, created_at);
CREATE INDEX idx_sg_msg_sender_time ON support_group_messages (sender_user_id, created_at);

-- Example: requests triage
CREATE INDEX idx_requests_triage ON requests (status, urgency, created_at);















-- 1) Transparency: campaign updates & feedback
CREATE TABLE campaign_updates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_id BIGINT NOT NULL,
  author_user_id BIGINT NULL,                 -- staff/NGO or patient
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  published_at DATETIME NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  FOREIGN KEY (author_user_id) REFERENCES users(id),
  INDEX (campaign_id, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE campaign_feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_id BIGINT NOT NULL,
  from_user_id BIGINT NULL,                   -- donors/patients can leave feedback
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  INDEX (campaign_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Crowdsourced listings by individuals
ALTER TABLE listings
  ADD COLUMN lister_user_id BIGINT NULL,
  ADD CONSTRAINT fk_listings_lister_user
    FOREIGN KEY (lister_user_id) REFERENCES users(id);

-- If you want to enforce "either org-backed inventory OR user-listed":
-- (MySQL CHECKs evaluate but historically weren’t enforced <8.0.16; keep app-side too)
-- ALTER TABLE listings
--   ADD CONSTRAINT chk_listing_has_source
--   CHECK (
--     (lister_user_id IS NOT NULL) OR
--     (lister_user_id IS NULL AND inventory_item_id IS NOT NULL)
--   );

-- 3) Workshops in local centers (augment webinars)
ALTER TABLE webinars
  ADD COLUMN location VARCHAR(255) NULL;      -- physical venue for offline sessions

-- 4) Patient medical history & documents (consent-gated)
CREATE TABLE patient_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_user_id BIGINT NOT NULL,
  clinician_user_id BIGINT NULL,              -- who authored/verified
  title VARCHAR(255) NOT NULL,
  notes_encrypted LONGBLOB NULL,              -- app-layer encryption
  recorded_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_user_id) REFERENCES users(id),
  FOREIGN KEY (clinician_user_id) REFERENCES users(id),
  INDEX (patient_user_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_record_files (
  record_id BIGINT NOT NULL,
  file_id BIGINT NOT NULL,
  PRIMARY KEY (record_id, file_id),
  FOREIGN KEY (record_id) REFERENCES patient_records(id),
  FOREIGN KEY (file_id) REFERENCES files(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) Optional: status history for key flows (example for requests)
CREATE TABLE request_status_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  request_id BIGINT NOT NULL,
  old_status ENUM('OPEN','MATCHED','FULFILLED','CANCELLED') NOT NULL,
  new_status ENUM('OPEN','MATCHED','FULFILLED','CANCELLED') NOT NULL,
  changed_by_user_id BIGINT NULL,
  changed_at DATETIME NOT NULL,
  note VARCHAR(512) NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id),
  FOREIGN KEY (changed_by_user_id) REFERENCES users(id),
  INDEX (request_id, changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Optional: auth QoL (reset tokens & notification prefs)
CREATE TABLE password_reset_tokens (
  token CHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notification_preferences (
  user_id BIGINT PRIMARY KEY,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  lang ENUM('ar','en') NOT NULL DEFAULT 'ar',
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
