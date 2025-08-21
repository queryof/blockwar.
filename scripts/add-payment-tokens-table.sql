-- Create payment tokens table for secure token-based payment verification
CREATE TABLE IF NOT EXISTS payment_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_payment_tokens_token ON payment_tokens(token);
CREATE INDEX IF NOT EXISTS idx_payment_tokens_order_id ON payment_tokens(order_id);
