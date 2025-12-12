INSERT IGNORE INTO roles(code, name) VALUES
('patient','Patient'),('doctor','Doctor'),('admin','Admin');
INSERT IGNORE INTO specialties(name) VALUES
('General Practice'),('Pediatrics'),('Mental Health');

insert into users(email,phone,password_hash,full_name,local,is_active)
values("Zinab@gmail.com",null,"123456","Zinab",ar,true);


INSERT INTO doctor_profiles(user_id, license_no, bio, years_experience, is_international)
SELECT id, 'PSY-98765', 'Psychiatrist focused on trauma/PTSD', 8, TRUE
FROM users WHERE email='Zinab@gmail.com';


INSERT INTO doctor_specialties(doctor_user_id, specialty_id)
SELECT u.id, s.id
FROM users u, specialties s
WHERE u.email='Zinab@gmail.com' AND s.name='Mental Health'
;




CREATE TABLE IF NOT EXISTS patient_donation_feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  donation_id BIGINT NOT NULL,
  patient_user_id BIGINT NOT NULL,
  rating TINYINT NULL,
  feedback_text TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id),
  FOREIGN KEY (patient_user_id) REFERENCES users(id),
  INDEX idx_pdf_donation (donation_id),
  INDEX idx_pdf_patient (patient_user_id),
  INDEX idx_pdf_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;









-- A) Add column + FK
ALTER TABLE appointments
  ADD COLUMN appointment_slot_id BIGINT NULL AFTER mode,
  ADD INDEX idx_appt_slot (appointment_slot_id),
  ADD CONSTRAINT fk_appointments_slot
    FOREIGN KEY (appointment_slot_id) REFERENCES doctor_availability(id);


UPDATE appointments a
JOIN doctor_availability s
  ON s.doctor_user_id = a.doctor_user_id
 AND s.starts_at      = a.starts_at
 AND s.ends_at        = a.ends_at
SET a.appointment_slot_id = s.id
WHERE a.appointment_slot_id IS NULL;

ALTER TABLE appointments
  MODIFY COLUMN appointment_slot_id BIGINT NOT NULL;


  ALTER TABLE patient_profiles
  ADD COLUMN country VARCHAR(128) NULL,
  ADD COLUMN city VARCHAR(128) NULL,
  ADD COLUMN case_summary TEXT NULL,
  ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN verified_by BIGINT NULL,
  ADD COLUMN verification_date DATETIME NULL,
  ADD FOREIGN KEY (verified_by) REFERENCES users(id);


ALTER TABLE patient_records
  ADD COLUMN hospital_name VARCHAR(255) NULL,
  ADD COLUMN attending_physician VARCHAR(255) NULL,
  ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE patient_profiles
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP;


CREATE TABLE patient_donation_goals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_user_id BIGINT NOT NULL,
  campaign_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  start_date DATE NULL,
  end_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_user_id) REFERENCES patient_profiles(user_id),
  FOREIGN KEY (campaign_id) REFERENCES sponsorship_campaigns(id),
  INDEX idx_patient_goal_status (patient_user_id, status),
  INDEX idx_goal_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE patient_recovery_updates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_user_id BIGINT NOT NULL,
  update_date DATETIME NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  author_user_id BIGINT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_user_id) REFERENCES patient_profiles(user_id),
  FOREIGN KEY (author_user_id) REFERENCES users(id),
  INDEX idx_updates_public (patient_user_id, is_public, update_date),
  INDEX idx_updates_author (author_user_id, update_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO patient_profiles (
    user_id, 
    dob, 
    gender, 
    blood_type, 
    primary_condition, 
    consent_to_display_case, 
    country, 
    city, 
    case_summary, 
    is_verified, 
    verified_by, 
    verification_date, 
    created_at, 
    updated_at
)
VALUES (
    14,                               -- user_id
    '1995-04-12',                    -- dob
    'male',                          -- gender
    'A+',                            -- blood_type
    'Diabetes Type 1',               -- primary_condition
    TRUE,                            -- consent_to_display_case
    'Palestine',                     -- country
    'Nablus',                        -- city
    'Patient suffers from Type 1 Diabetes and requires continuous insulin therapy.',
    TRUE,                            -- is_verified
    1,                               -- verified_by (doctor/admin ID)
    NOW(),                           -- verification_date
    NOW(),                           -- created_at
    NOW()                         
);

