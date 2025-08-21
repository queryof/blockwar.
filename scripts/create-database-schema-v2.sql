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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_username ON orders(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

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
 false, '{"coins_amount": 750, "gamemode": "lifesteal"}', 5);
