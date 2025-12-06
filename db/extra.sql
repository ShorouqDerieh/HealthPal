
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