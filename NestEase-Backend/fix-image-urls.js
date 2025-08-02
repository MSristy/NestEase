const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixImageUrls() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nestease',
    });

    console.log('Connected to database');

    // First, let's see what the current data looks like
    const [rows] = await connection.execute(`
      SELECT id, title, images 
      FROM property 
      WHERE images LIKE '%uploads/properties%' 
      LIMIT 10
    `);

    console.log('Current image data:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}`);
      console.log(`Images: ${row.images}`);
      console.log('---');
    });

    // Get all properties with image data
    const [properties] = await connection.execute(`
      SELECT id, images 
      FROM property 
      WHERE images IS NOT NULL AND images != '[]' AND images != 'null' AND images != ''
    `);

    console.log(`Found ${properties.length} properties with images`);

    let updatedCount = 0;

    for (const property of properties) {
      try {
        let images;
        let isJson = false;
        
        // Try to parse as JSON first
        try {
          images = JSON.parse(property.images);
          isJson = true;
        } catch (e) {
          // If it's not JSON, treat it as a single string
          images = [property.images];
          isJson = false;
        }
        
        if (!Array.isArray(images)) {
          console.log(`Property ${property.id}: images is not an array, treating as single image`);
          images = [images];
        }

        let hasChanges = false;
        const fixedImages = images.map(imagePath => {
          if (!imagePath) return imagePath;
          
          let fixedPath = imagePath;
          
          // Fix duplicate /uploads/properties/ paths
          if (fixedPath.includes('/uploads/properties/uploads/properties/')) {
            fixedPath = fixedPath.replace('/uploads/properties/uploads/properties/', '/uploads/properties/');
            hasChanges = true;
          }
          
          // Fix filename/uploads/properties/filename pattern
          const regex = /([a-f0-9-]+\.[a-z]+)\/uploads\/properties\/([a-f0-9-]+\.[a-z]+)/;
          if (regex.test(fixedPath)) {
            const match = fixedPath.match(regex);
            if (match) {
              fixedPath = `/uploads/properties/${match[2]}`;
              hasChanges = true;
            }
          }
          
          // Ensure path starts with /
          if (fixedPath && !fixedPath.startsWith('/') && fixedPath.includes('uploads/properties/')) {
            fixedPath = `/${fixedPath}`;
            hasChanges = true;
          }
          
          return fixedPath;
        });

        if (hasChanges) {
          // If it was originally a single string, keep it as a string
          const newValue = isJson ? JSON.stringify(fixedImages) : fixedImages[0];
          
          await connection.execute(
            'UPDATE property SET images = ? WHERE id = ?',
            [newValue, property.id]
          );
          updatedCount++;
          console.log(`Fixed property ${property.id}: ${property.images} -> ${newValue}`);
        }
      } catch (error) {
        console.error(`Error processing property ${property.id}:`, error);
      }
    }

    console.log(`Updated ${updatedCount} properties`);

    // Verify the fix
    const [verifyRows] = await connection.execute(`
      SELECT id, title, images 
      FROM property 
      WHERE images LIKE '%uploads/properties%' 
      LIMIT 5
    `);

    console.log('\nVerification - Fixed image data:');
    verifyRows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}`);
      console.log(`Images: ${row.images}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the fix
fixImageUrls().then(() => {
  console.log('Image URL fix completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 