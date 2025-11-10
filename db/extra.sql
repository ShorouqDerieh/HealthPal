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
