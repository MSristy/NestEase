USE nestease;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all barter-related tables
TRUNCATE TABLE barter_items;
TRUNCATE TABLE barter_images;
TRUNCATE TABLE barter_offers;
TRUNCATE TABLE barter_messages;
TRUNCATE TABLE barter_favorites;
TRUNCATE TABLE barter_views;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 