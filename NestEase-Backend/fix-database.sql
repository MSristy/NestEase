-- Fix database schema issues
-- Run this script in your MySQL/MariaDB database

-- 1. Add status column to exchange_product table if it doesn't exist
ALTER TABLE exchange_product 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- 2. Update existing records to have 'pending' status if they don't have one
UPDATE exchange_product 
SET status = 'pending' 
WHERE status IS NULL OR status = '';

-- 3. Check if the column was added successfully
DESCRIBE exchange_product; 