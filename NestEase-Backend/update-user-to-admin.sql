-- Update user role to admin
-- Replace 'your-email@example.com' with your actual email address

UPDATE user 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, name, email, role FROM user WHERE email = 'your-email@example.com'; 