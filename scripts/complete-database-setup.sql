-- BLOCKWAR Complete Database Setup
-- This file contains all SQL scripts consolidated into one
-- Run this script to set up the complete database schema

-- =====================================================
-- CLEANUP EXISTING OBJECTS (to avoid conflicts)
-- =====================================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS trigger_generate_ticket_number ON support_tickets;
DROP TRIGGER IF EXISTS trigger_update_participant_last_seen ON chat_messages;

-- Drop existing functions if they exist to avoid conflicts
DROP FUNCTION IF EXISTS generate_ticket_number() CASCADE;
DROP FUNCTION IF EXISTS update_participant_last_seen() CASCADE;
DROP FUNCTION IF EXISTS mark_inactive_participants_offline() CASCADE;

-- Drop existing sequences
DROP SEQUENCE IF EXISTS ticket_number_seq CASCADE;

-- =====================================================
-- CREATE SEQUENCES FIRST
-- =====================================================

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- =====================================================
-- MAIN DATABASE SCHEMA (in dependency order)
-- =====================================================

-- Create products table for dynamic product management
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  category VARCHAR(100) NOT NULL, -- 'coins' or 'ranks'
  gamemode VARCHAR(100) DEFAULT 'lifesteal',
  image_url TEXT,
  perks_html TEXT, -- HTML content for perks popup
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB, -- Additional product data (coins amount, rank level, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for order management
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  minecraft_username VARCHAR(100) NOT NULL,
  is_bedrock BOOLEAN DEFAULT false,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT',
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, cancelled
  payment_method VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  terms_accepted BOOLEAN DEFAULT false,
  age_consent BOOLEAN DEFAULT false,
  delivery_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table for order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL, -- Store name at time of purchase
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUPPORT SYSTEM TABLES (create before functions)
-- =====================================================

-- Create support tickets table FIRST (before functions that reference it)
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    minecraft_username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, closed
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support ticket replies table
CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_username VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAT SYSTEM TABLES
-- =====================================================

-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'support' NOT NULL, -- support, general, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_username VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(50) DEFAULT 'text', -- text, system, file, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat participants table (to track who's in which room)
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

-- =====================================================
-- PAYMENT SYSTEM TABLES
-- =====================================================

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(100) NOT NULL,
    payment_provider VARCHAR(100), -- bkash, nagad, rocket, etc.
    transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADMIN SYSTEM TABLES
-- =====================================================

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, moderator, support
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS (create after all tables exist)
-- =====================================================

-- Create function to generate ticket numbers with proper return type
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number := 'TKT-' || LPAD(nextval('ticket_number_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update participant last_seen with proper return type
CREATE OR REPLACE FUNCTION update_participant_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_participants 
    SET last_seen = NOW(), is_online = TRUE
    WHERE room_id = NEW.room_id AND username = NEW.sender_username;
    
    -- If participant doesn't exist, create them
    IF NOT FOUND THEN
        INSERT INTO chat_participants (room_id, username, email, is_staff, is_online)
        VALUES (NEW.room_id, NEW.sender_username, NEW.sender_email, NEW.is_staff, TRUE)
        ON CONFLICT (room_id, username) DO UPDATE SET
            last_seen = NOW(),
            is_online = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark participants as offline after inactivity
CREATE OR REPLACE FUNCTION mark_inactive_participants_offline()
RETURNS void AS $$
BEGIN
    UPDATE chat_participants 
    SET is_online = FALSE
    WHERE last_seen < NOW() - INTERVAL '5 minutes' AND is_online = TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS (create after functions exist)
-- =====================================================

-- Create trigger for ticket number generation
CREATE TRIGGER trigger_generate_ticket_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- Create trigger to update participant status when message is sent
CREATE TRIGGER trigger_update_participant_last_seen
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_participant_last_seen();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_username ON orders(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_username ON chat_participants(username);

-- Support indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_username ON support_tickets(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_support_ticket_replies_ticket_id ON support_ticket_replies(ticket_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;

-- =====================================================
-- DEFAULT DATA INSERTION
-- =====================================================

-- Insert default support chat room
INSERT INTO chat_rooms (name, type) 
VALUES ('General Support', 'support')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admin_users (username, email, password_hash, role) 
VALUES ('admin', 'admin@blockwar.com', '$2b$10$rQZ8kqH5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5FqJ5F', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample products data
INSERT INTO products (name, description, price, category, image_url, perks_html, is_popular, metadata, sort_order) VALUES
-- Ranks
('DEVIL Rank', 'Ultimate DEVIL prefix with exclusive perks', 500.00, 'ranks', '/minecraft-devil-rank-icon.png', 
 '<div class="perks-content"><h3 style="color: #ff0000; margin-bottom: 16px;">🔥 DEVIL Rank Perks</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">⚡</span> Ultimate DEVIL prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">👑</span> Maximum server privileges</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">⚔️</span> Exclusive commands access</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff6b6b;">🎯</span> Priority support</li><li style="padding: 8px 0;"><span style="color: #ff6b6b;">✨</span> Special cosmetics & effects</li></ul></div>', 
 true, '{"rank_level": 5, "prefix": "DEVIL", "color": "#FF0000"}', 1),

('MADARA Rank', 'Special MADARA premium rank with unique abilities', 400.00, 'ranks', '/minecraft-madara-rank-icon.png',
 '<div class="perks-content"><h3 style="color: #8b0000; margin-bottom: 16px;">🌟 MADARA Special Rank</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">🔮</span> Special MADARA prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">⚡</span> Unique abilities & powers</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">🗡️</span> Exclusive commands</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ff4757;">💎</span> Premium support</li><li style="padding: 8px 0;"><span style="color: #ff4757;">🎨</span> Custom cosmetics</li></ul></div>',
 true, '{"rank_level": 4, "prefix": "MADARA", "color": "#8B0000", "special": true}', 2),

('BOSS Rank', 'BOSS rank with leadership privileges', 200.00, 'ranks', '/minecraft-boss-rank-icon.png',
 '<div class="perks-content"><h3 style="color: #ff8c00; margin-bottom: 16px;">👑 BOSS Rank Perks</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffa726;">💼</span> BOSS prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffa726;">📋</span> Leadership commands</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffa726;">🔑</span> Advanced permissions</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffa726;">⏰</span> Priority queue</li><li style="padding: 8px 0;"><span style="color: #ffa726;">🎭</span> Boss cosmetics</li></ul></div>',
 false, '{"rank_level": 3, "prefix": "BOSS", "color": "#FF8C00"}', 3),

('VIP Rank', 'VIP membership with premium benefits', 120.00, 'ranks', '/minecraft-vip-rank-icon.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">⭐ VIP Rank Perks</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🌟</span> VIP prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🎮</span> Premium commands</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">💬</span> VIP chat access</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⚡</span> Faster respawn</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">✨</span> VIP cosmetics</li></ul></div>',
 false, '{"rank_level": 2, "prefix": "VIP", "color": "#FFD700", "duration": "monthly"}', 4),

('KING Rank', 'Royal KING rank with majestic privileges', 60.00, 'ranks', '/minecraft-king-rank-icon.png',
 '<div class="perks-content"><h3 style="color: #4169e1; margin-bottom: 16px;">👑 KING Rank Perks</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #5c6bc0;">👑</span> Royal KING prefix</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #5c6bc0;">⚔️</span> Majestic commands</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #5c6bc0;">🏰</span> Royal privileges</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #5c6bc0;">💎</span> Crown cosmetics</li><li style="padding: 8px 0;"><span style="color: #5c6bc0;">🏛️</span> Kingdom access</li></ul></div>',
 false, '{"rank_level": 1, "prefix": "KING", "color": "#4169E1", "duration": "monthly"}', 5),

-- Coins
('4500 Coins', 'Large coin package for LifeSteal gamemode', 550.00, 'coins', '/minecraft-gold-coins-stack.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">💰 4500 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 4500 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🛒</span> Use in coin shop</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⚔️</span> Buy special items</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⬆️</span> Upgrade equipment</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">🤝</span> Trade with players</li></ul></div>',
 true, '{"coins_amount": 4500, "gamemode": "lifesteal"}', 1),

('3700 Coins', 'Premium coin package for LifeSteal', 400.00, 'coins', '/minecraft-gold-coins-bag.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">💎 3700 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 3700 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">💰</span> Great value package</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🛍️</span> Shop upgrades</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">⚡</span> Equipment enhancement</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">🔄</span> Player trading</li></ul></div>',
 false, '{"coins_amount": 3700, "gamemode": "lifesteal"}', 2),

('2400 Coins', 'Standard coin package for LifeSteal', 200.00, 'coins', '/minecraft-gold-treasure.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">🏆 2400 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 2400 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">📦</span> Standard package</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🔧</span> Basic upgrades</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🛒</span> Item purchases</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">💹</span> Economy participation</li></ul></div>',
 false, '{"coins_amount": 2400, "gamemode": "lifesteal"}', 3),

('1400 Coins', 'Basic coin package for LifeSteal', 100.00, 'coins', '/minecraft-gold-coins-small.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">🥉 1400 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 1400 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">📋</span> Basic package</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🔨</span> Essential items</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🆙</span> Starter upgrades</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">🚪</span> Economy access</li></ul></div>',
 false, '{"coins_amount": 1400, "gamemode": "lifesteal"}', 4),

('750 Coins', 'Starter coin package for LifeSteal', 60.00, 'coins', '/minecraft-gold-coins-tiny.png',
 '<div class="perks-content"><h3 style="color: #ffd700; margin-bottom: 16px;">🌱 750 Coins Package</h3><ul style="list-style: none; padding: 0;"><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🪙</span> 750 LifeSteal coins</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🎯</span> Starter package</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">🔰</span> Basic items</li><li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #ffeb3b;">📈</span> Entry level</li><li style="padding: 8px 0;"><span style="color: #ffeb3b;">🚀</span> Get started</li></ul></div>',
 false, '{"coins_amount": 750, "gamemode": "lifesteal"}', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Database setup is now complete!
-- Remember to update the credentials in lib/credentials.ts with your actual Supabase details
