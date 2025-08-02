-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nestease;
USE nestease;

-- Users table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_swaps INT DEFAULT 0
);

-- Categories table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    transaction_type ENUM('sell', 'buy', 'swap', 'offer') NOT NULL
);

-- Items table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_type ENUM('sell', 'buy', 'swap', 'offer') NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    swap_value DECIMAL(10, 2),
    discount INT,
    original_price DECIMAL(10, 2),
    images JSON,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'sold', 'inactive') DEFAULT 'active',
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Contact Messages table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'read', 'replied') DEFAULT 'pending',
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Cart table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Transactions table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    transaction_type ENUM('sale', 'swap') NOT NULL,
    amount DECIMAL(10,2),
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Reviews table (1NF and 2NF)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_id) REFERENCES users(id)
);

-- Create the add_swap table
CREATE TABLE IF NOT EXISTS add_swap (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

-- Insert sample categories
INSERT INTO categories (name, icon, transaction_type) VALUES
('Smartphone', '📱', 'sell'),
('Car', '🚗', 'sell'),
('Dress', '👗', 'sell'),
('Furniture', '🪑', 'sell'),
('Bike', '🚲', 'sell'),
('Books', '📚', 'sell'),
('Laptop', '💻', 'sell'),
('Tablet', '📱', 'sell'),
('Motorcycle', '🏍️', 'sell'),
('House', '🏠', 'sell'),
('Kitchen', '🍳', 'sell'),
('Tools', '🔧', 'sell'),
('Services', '🧹', 'offer'),
('Gardening', '🌿', 'offer'),
('Repairs', '🔧', 'offer'),
('Cooking', '🍳', 'offer'),
('Transport', '🚗', 'offer');

-- Insert sample users
INSERT INTO users (name, email, password, phone, location, rating, total_swaps) VALUES
('Ahmed Khan', 'ahmed@example.com', 'hashed_password', '01712345678', 'Gulshan, Dhaka', 4.7, 12),
('Fatima Rahman', 'fatima@example.com', 'hashed_password', '01812345678', 'Banani, Dhaka', 4.9, 8),
('Rahim Ali', 'rahim@example.com', 'hashed_password', '01912345678', 'Dhanmondi, Dhaka', 4.5, 5);

-- Insert sample items
INSERT INTO items (title, category_id, owner_id, price, swap_value, condition, description, location, image_bg, icon) VALUES
('Samsung Galaxy S21', 1, 1, 35000.00, 32000.00, 'Good', 'Samsung Galaxy S21, 2 years old, in good working condition with minor scratches.', 'Gulshan, Dhaka', 'bg-blue-400', '📱'),
('iPhone 13 Pro', 1, 2, 65000.00, 60000.00, 'Excellent', 'iPhone 13 Pro, 1 year old, perfect condition with original box and accessories.', 'Banani, Dhaka', 'bg-gray-400', '📱'),
('OnePlus 9', 1, 3, 25000.00, 22000.00, 'Good', 'OnePlus 9, 1.5 years old, good condition with original charger.', 'Dhanmondi, Dhaka', 'bg-red-400', '📱'); 