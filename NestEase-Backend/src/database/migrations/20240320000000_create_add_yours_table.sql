CREATE TABLE add_yours (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    swap_value DECIMAL(10,2),
    discount INTEGER,
    original_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 