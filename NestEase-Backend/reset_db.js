const mysql = require('mysql2/promise');

async function resetDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Add your password if you have one
    });

    console.log('Connected to MySQL server');

    // Drop the database if it exists
    await connection.execute('DROP DATABASE IF EXISTS nestease');
    console.log('Dropped existing database');

    // Create a fresh database
    await connection.execute('CREATE DATABASE nestease');
    console.log('Created fresh database');

    console.log('Database reset successful!');
    console.log('You can now restart your backend with synchronize: true');

  } catch (error) {
    console.error('Error resetting database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetDatabase(); 