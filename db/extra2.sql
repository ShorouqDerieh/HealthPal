INSERT INTO organizations (name, type, verified_at)
VALUES
('Health NGO', 'NGO', NOW());
ALTER TABLE alerts
  ADD COLUMN status ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
  ADD COLUMN expires_at DATETIME NULL;

CREATE TABLE webinar_registrations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  webinar_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  status ENUM('REGISTERED','CANCELLED','ATTENDED','NO_SHOW') NOT NULL DEFAULT 'REGISTERED',
  registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (webinar_id) REFERENCES webinars(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uq_webinar_user (webinar_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE inventory_items
  ADD COLUMN min_threshold INT NULL AFTER quantity;
CREATE TABLE resource_shortage_alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  inventory_item_id BIGINT NOT NULL,
  org_id BIGINT NULL,
  current_quantity INT NOT NULL,
  threshold INT NOT NULL,
  status ENUM('OPEN','RESOLVED') DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by BIGINT NULL,
  FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (resolved_by) REFERENCES users(id),
  INDEX (inventory_item_id),
  INDEX (org_id),
  INDEX (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



ALTER TABLE support_groups 
DROP COLUMN is_moderated;
ALTER TABLE support_groups 
ADD COLUMN category VARCHAR(100) AFTER description;


CREATE TABLE join_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surgical_missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    speciality VARCHAR(255) NOT NULL,
    max_patients INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE mission_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mission_id INT NOT NULL,
    patient_user_id INT NOT NULL,
    notes TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (mission_id) REFERENCES surgical_missions(id) ON DELETE CASCADE
);
