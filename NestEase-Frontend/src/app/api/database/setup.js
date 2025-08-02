const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('Connected to MySQL server');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'setup.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split the SQL file into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('Executed:', statement.trim().substring(0, 50) + '...');
      }
    }

    console.log('Database setup completed successfully');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 