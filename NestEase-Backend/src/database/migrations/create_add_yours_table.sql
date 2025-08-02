CREATE TABLE add_yours (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    condition VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    discount DECIMAL(5,2),
    original_price DECIMAL(10,2),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0
);

-- Create index for faster searches
CREATE INDEX idx_add_yours_category ON add_yours(category);
CREATE INDEX idx_add_yours_transaction_type ON add_yours(transaction_type);
CREATE INDEX idx_add_yours_user_id ON add_yours(user_id);
CREATE INDEX idx_add_yours_status ON add_yours(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_add_yours_updated_at
    BEFORE UPDATE ON add_yours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 