-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nestease;
USE nestease;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert a default admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@nestease.com', '$2b$10$your_hashed_password', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Insert a default test user
INSERT INTO users (name, email, password, role)
VALUES ('Test User', 'test@nestease.com', '$2b$10$your_hashed_password', 'user')
ON DUPLICATE KEY UPDATE id=id; 