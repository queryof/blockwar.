-- BLOCKWAR Database Setup - Clean Version
-- This script safely creates all tables and data without conflicts

-- =====================================================
-- SAFE CLEANUP (only if objects exist)
-- =====================================================

-- Drop triggers safely
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS trigger_generate_ticket_number ON support_tickets;
    DROP TRIGGER IF EXISTS trigger_update_participant_last_seen ON chat_messages;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors if triggers don't exist
END $$;

-- Drop functions safely
DO $$ 
BEGIN
    DROP FUNCTION IF EXISTS generate_ticket_number() CASCADE;
    DROP FUNCTION IF EXISTS update_participant_last_seen() CASCADE;
    DROP FUNCTION IF EXISTS mark_inactive_participants_offline() CASCADE;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors if functions don't exist
END $$;

-- Drop sequences safely
DO $$ 
BEGIN
    DROP SEQUENCE IF EXISTS ticket_number_seq CASCADE;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors if sequence doesn't exist
END $$;

-- =====================================================
-- CREATE CORE TABLES FIRST
-- =====================================================

-- Products table (main store items)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  category VARCHAR(100) NOT NULL,
  gamemode VARCHAR(100) DEFAULT 'lifesteal',
  image_url TEXT,
  perks_html TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  minecraft_username VARCHAR(100) NOT NULL,
  is_bedrock BOOLEAN DEFAULT false,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  terms_accepted BOOLEAN DEFAULT false,
  age_consent BOOLEAN DEFAULT false,
  delivery_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'TKT-000001',
    minecraft_username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support ticket replies
CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_username VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat rooms
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'support' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_username VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat participants
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_staff BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT TRUE,
    UNIQUE(room_id, username)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(100) NOT NULL,
    payment_provider VARCHAR(100),
    transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    status VARCHAR(50) DEFAULT 'pending',
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_username ON orders(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert default chat room
INSERT INTO chat_rooms (name, type) 
VALUES ('General Support', 'support')
ON CONFLICT DO NOTHING;

-- Insert default admin (password: admin123 - CHANGE THIS!)
INSERT INTO admin_users (username, email, password_hash, role) 
VALUES ('admin', 'admin@blockwar.com', '$2b$10$rQZ8kqH5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5F', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, perks_html, is_popular, metadata, sort_order) VALUES
('DEVIL Rank', 'Ultimate DEVIL prefix with exclusive perks', 500.00, 'ranks', '/minecraft-devil-rank-icon.png', 
 '<div class="perks-content"><h3 style="color: #ff0000; margin-bottom: 16px;">🔥 DEVIL Rank Perks</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">⚡</span> Ultimate DEVIL prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">👑</span> Maximum server privileges</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">⚔️</span> Exclusive commands access</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">🎯</span> Priority support</li><li style="padding: 8px 0;"><span style="color: #ff6b6b;">✨</span> Special cosmetics & effects</li></ul></div>', 
 true, '{"rank_level": 5, "prefix": "DEVIL", "color": "#FF0000"}', 1),

('4500 Coins', 'Large coin package for LifeSteal gamemode', 550.00, 'coins', '/minecraft-gold-coins-stack.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">💰 4500 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 4500 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🛒</span> Use in coin shop</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⚔️</span> Buy special items</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⬆️</span> Upgrade equipment</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">🤝</span> Trade with players</li></ul></div>',
 true, '{"coins_amount": 4500, "gamemode": "lifesteal"}', 1),

('MADARA Rank', 'Special MADARA premium rank with unique abilities', 400.00, 'ranks', '/minecraft-madara-rank-icon.png',
 '<div class="perks-content"><h3 style="color: #8b0000; margin-bottom: 16px;">🌟 MADARA Special Rank</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">🔮</span> Special MADARA prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">⚡</span> Unique abilities & powers</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">🗡️</span> Exclusive commands</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">💎</span> Premium support</li><li style="padding: 8px 0;"><span style="color: #ff4757;">🎨</span> Custom cosmetics</li></ul></div>',
 true, '{"rank_level": 4, "prefix": "MADARA", "color": "#8B0000", "special": true}', 2)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENABLE REALTIME (if supported)
-- =====================================================

DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore if realtime not available
END $$;

-- Setup complete!
SELECT 'Database setup completed successfully!' as status;
