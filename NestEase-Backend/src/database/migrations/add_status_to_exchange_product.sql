-- Add status column to exchange_product table (MariaDB compatible)
ALTER TABLE exchange_product 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending'; 