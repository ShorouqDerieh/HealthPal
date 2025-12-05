
ALTER TABLE support_groups 
DROP COLUMN is_moderated;
ALTER TABLE support_groups 
ADD COLUMN category VARCHAR(100) AFTER description;
