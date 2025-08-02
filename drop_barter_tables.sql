USE nestease;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all barter-related tables
DROP TABLE IF EXISTS barter_items;
DROP TABLE IF EXISTS barter_images;
DROP TABLE IF EXISTS barter_offers;
DROP TABLE IF EXISTS barter_messages;
DROP TABLE IF EXISTS barter_favorites;
DROP TABLE IF EXISTS barter_views;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 