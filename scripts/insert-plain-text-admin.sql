-- Insert admin user with plain text password
INSERT INTO admin_users (username, password_hash, email, role, is_active, created_at)
VALUES ('admin', 'Moinulislam#@', 'admin@blockwar.com', 'super_admin', true, NOW())
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = 'Moinulislam#@',
  email = 'admin@blockwar.com',
  role = 'super_admin',
  is_active = true;
