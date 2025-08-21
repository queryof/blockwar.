-- Adding weekly pricing and moving tags to metadata
ALTER TABLE products 
ADD COLUMN weekly_price DECIMAL(10,2),
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Update existing products with weekly prices and metadata tags
UPDATE products SET 
  weekly_price = 20,
  metadata = '{"tag": "premium", "subscription_type": "weekly"}'
WHERE name = 'KING';

UPDATE products SET 
  weekly_price = 40,
  metadata = '{"tag": "premium", "subscription_type": "weekly"}'
WHERE name = 'VIP';

UPDATE products SET 
  metadata = '{"tag": "standard"}'
WHERE name = 'BOSS';

UPDATE products SET 
  metadata = '{"tag": "special", "description": "Special MADARA premium rank"}'
WHERE name = 'MADARA';

UPDATE products SET 
  metadata = '{"tag": "ultimate"}'
WHERE name = 'DEVIL';

-- Update coins metadata
UPDATE products SET 
  metadata = '{"tag": "currency"}'
WHERE category = 'coins';

-- Remove bonus_coins column since user wants it removed
ALTER TABLE products DROP COLUMN IF EXISTS bonus_coins;
