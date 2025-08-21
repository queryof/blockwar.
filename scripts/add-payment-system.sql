-- Adding comprehensive payment system tables and order status management

-- Add payment status and payment_id to orders table
ALTER TABLE orders 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
ADD COLUMN payment_id UUID REFERENCES payments(id),
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded'));

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BDT',
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50) DEFAULT 'custom',
    transaction_id VARCHAR(255) UNIQUE,
    gateway_response JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment verification logs table
CREATE TABLE payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    verification_method VARCHAR(50) NOT NULL,
    verification_data JSONB,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'verified', 'failed')),
    verified_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_id ON orders(payment_id);
CREATE INDEX idx_payment_verifications_payment_id ON payment_verifications(payment_id);

-- Create function to update order status when payment is verified
CREATE OR REPLACE FUNCTION update_order_on_payment_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- When payment status changes to completed, update order status to processing
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE orders 
        SET 
            status = 'processing',
            payment_status = 'completed',
            updated_at = NOW()
        WHERE payment_id = NEW.id;
    END IF;
    
    -- When payment fails, update order status
    IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
        UPDATE orders 
        SET 
            status = 'cancelled',
            payment_status = 'failed',
            updated_at = NOW()
        WHERE payment_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic order status updates
CREATE TRIGGER trigger_update_order_on_payment_verification
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_order_on_payment_verification();

-- Add updated_at trigger for payments table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample payment methods configuration
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT true,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment method with provided API key
INSERT INTO payment_methods (name, provider, api_key_encrypted, configuration) VALUES 
('Default Payment Gateway', 'custom', 'L6XRNgC3tM1KmfUM3rcwqau5r9n9EWTZ69vlWvqkEifzSM6vJO', '{"currency": "BDT", "webhook_url": "/api/payments/webhook"}');
