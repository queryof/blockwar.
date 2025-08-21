-- Insert default admin user
-- Password: Moinulislam#@
-- The password hash below is bcrypt hash of "Moinulislam#@"

INSERT INTO admin_users (
  id,
  username,
  email,
  password_hash,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin',
  'admin@blockwar.com',
  '$2a$12$LQv3c1yqBWVHxkd0LQ4lqe7rdxs8/YCdCrcHubbMlrI7TwiAAeRaa',
  'super_admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;
