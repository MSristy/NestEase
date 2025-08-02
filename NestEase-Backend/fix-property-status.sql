-- Fix property status enums to include REJECTED status
-- Run this script in your MySQL/MariaDB database

-- Update property_booking status enum
ALTER TABLE property_booking 
MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING';

-- Update property_purchase status enum  
ALTER TABLE property_purchase 
MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING';

-- Check the updated structure
DESCRIBE property_booking;
DESCRIBE property_purchase; 