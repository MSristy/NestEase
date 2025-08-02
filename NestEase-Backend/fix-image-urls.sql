-- Fix malformed image URLs in the property table
-- This script removes duplicate /uploads/properties/ paths

-- First, let's see what the current data looks like
SELECT id, title, images FROM property WHERE images LIKE '%uploads/properties/uploads/properties%' LIMIT 5;

-- Update the images column to fix malformed URLs
UPDATE property 
SET images = JSON_REPLACE(
    images,
    '$[*]',
    JSON_UNQUOTE(
        JSON_EXTRACT(
            images,
            '$[*]'
        )
    )
)
WHERE images LIKE '%uploads/properties/uploads/properties%';

-- Alternative approach: Update each image path individually
UPDATE property 
SET images = JSON_ARRAY(
    CASE 
        WHEN JSON_EXTRACT(images, '$[0]') LIKE '%uploads/properties/uploads/properties%' 
        THEN REPLACE(JSON_EXTRACT(images, '$[0]'), '/uploads/properties/uploads/properties/', '/uploads/properties/')
        ELSE JSON_EXTRACT(images, '$[0]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[1]') LIKE '%uploads/properties/uploads/properties%' 
        THEN REPLACE(JSON_EXTRACT(images, '$[1]'), '/uploads/properties/uploads/properties/', '/uploads/properties/')
        ELSE JSON_EXTRACT(images, '$[1]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[2]') LIKE '%uploads/properties/uploads/properties%' 
        THEN REPLACE(JSON_EXTRACT(images, '$[2]'), '/uploads/properties/uploads/properties/', '/uploads/properties/')
        ELSE JSON_EXTRACT(images, '$[2]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[3]') LIKE '%uploads/properties/uploads/properties%' 
        THEN REPLACE(JSON_EXTRACT(images, '$[3]'), '/uploads/properties/uploads/properties/', '/uploads/properties/')
        ELSE JSON_EXTRACT(images, '$[3]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[4]') LIKE '%uploads/properties/uploads/properties%' 
        THEN REPLACE(JSON_EXTRACT(images, '$[4]'), '/uploads/properties/uploads/properties/', '/uploads/properties/')
        ELSE JSON_EXTRACT(images, '$[4]')
    END
)
WHERE images LIKE '%uploads/properties/uploads/properties%';

-- Also fix URLs that have filename/uploads/properties/filename pattern
UPDATE property 
SET images = JSON_ARRAY(
    CASE 
        WHEN JSON_EXTRACT(images, '$[0]') REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+' 
        THEN CONCAT('/uploads/properties/', SUBSTRING_INDEX(JSON_EXTRACT(images, '$[0]'), '/uploads/properties/', -1))
        ELSE JSON_EXTRACT(images, '$[0]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[1]') REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+' 
        THEN CONCAT('/uploads/properties/', SUBSTRING_INDEX(JSON_EXTRACT(images, '$[1]'), '/uploads/properties/', -1))
        ELSE JSON_EXTRACT(images, '$[1]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[2]') REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+' 
        THEN CONCAT('/uploads/properties/', SUBSTRING_INDEX(JSON_EXTRACT(images, '$[2]'), '/uploads/properties/', -1))
        ELSE JSON_EXTRACT(images, '$[2]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[3]') REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+' 
        THEN CONCAT('/uploads/properties/', SUBSTRING_INDEX(JSON_EXTRACT(images, '$[3]'), '/uploads/properties/', -1))
        ELSE JSON_EXTRACT(images, '$[3]')
    END,
    CASE 
        WHEN JSON_EXTRACT(images, '$[4]') REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+' 
        THEN CONCAT('/uploads/properties/', SUBSTRING_INDEX(JSON_EXTRACT(images, '$[4]'), '/uploads/properties/', -1))
        ELSE JSON_EXTRACT(images, '$[4]')
    END
)
WHERE images REGEXP '[a-f0-9-]+\\.[a-z]+/uploads/properties/[a-f0-9-]+\\.[a-z]+';

-- Verify the fix
SELECT id, title, images FROM property WHERE images LIKE '%uploads/properties%' LIMIT 5; 