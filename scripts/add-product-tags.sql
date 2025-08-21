-- Add product tags column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag VARCHAR(50);

-- Update existing products with tags
UPDATE products SET tag = 'Special Rank' WHERE name = 'MADARA';
UPDATE products SET tag = 'Ultimate Power' WHERE name = 'DEVIL';
UPDATE products SET tag = 'Most Popular' WHERE name = '4500 Coins';
UPDATE products SET tag = 'Best Value' WHERE name = '3700 Coins';
UPDATE products SET tag = 'Starter Pack' WHERE name = '750 Coins';

-- Update DEVIL rank to show proper coin bonus
UPDATE products SET bonus_coins = 5000 WHERE name = 'DEVIL';
UPDATE products SET bonus_coins = 4000 WHERE name = 'MADARA';
UPDATE products SET bonus_coins = 0 WHERE name = 'BOSS';
UPDATE products SET bonus_coins = 0 WHERE name = 'VIP';
UPDATE products SET bonus_coins = 0 WHERE name = 'KING';
