-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (username: admin, password: Moinulislam#@)
-- Password hash for 'Moinulislam#@' using bcrypt
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$8K1p/a0dHTBS89/a0IRBZ.VQjsxot6CreuPuiAMuIEMTlEkm6qEFu', 'admin@blockwar.com', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Create admin sessions table for login tracking
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users can only be accessed by authenticated admin users
CREATE POLICY "Admin users access" ON admin_users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin sessions access" ON admin_sessions FOR ALL USING (auth.role() = 'authenticated');
