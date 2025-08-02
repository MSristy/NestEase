-- Create the add_yours table
CREATE TABLE IF NOT EXISTS add_yours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type ENUM('sell', 'buy', 'swap', 'offer') NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    condition VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    discount INT,
    original_price DECIMAL(10, 2),
    owner_id INT NOT NULL,
    status ENUM('active', 'pending', 'sold', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
); 