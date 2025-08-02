const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to the nestease database
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Add your password if you have one
      database: 'nestease',
    });

    console.log('Connected to nestease database');

    // Create Property table with UUID primary key
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS property (
        id VARCHAR(36) PRIMARY KEY,
        yourName VARCHAR(255),
        yourPhone VARCHAR(255),
        yourEmail VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zipCode VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        bedrooms INT NOT NULL,
        bathrooms INT NOT NULL,
        squareFeet INT NOT NULL,
        type ENUM('RENT', 'SALE') DEFAULT 'RENT',
        status ENUM('AVAILABLE', 'BOOKED', 'SOLD') DEFAULT 'AVAILABLE',
        amenities JSON,
        images TEXT,
        isAvailable BOOLEAN DEFAULT true,
        isVerified BOOLEAN DEFAULT false,
        category VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Created property table');

    // Create PropertyBooking table with UUID primary key
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS property_booking (
        id VARCHAR(36) PRIMARY KEY,
        checkInDate DATETIME NOT NULL,
        checkOutDate DATETIME NOT NULL,
        totalPrice DECIMAL(10,2) NOT NULL,
        status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
        paymentStatus ENUM('PENDING', 'PAID', 'REFUNDED', 'FAILED') DEFAULT 'PENDING',
        paymentIntentId VARCHAR(255),
        paymentDetails JSON,
        cancellationReason VARCHAR(255),
        isRefundable BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Created property_booking table');

    // Create User table (if not exists)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        phone VARCHAR(255),
        address VARCHAR(255),
        role VARCHAR(255) DEFAULT 'user',
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        emailNotifications BOOLEAN DEFAULT true,
        smsNotifications BOOLEAN DEFAULT false,
        showProfile BOOLEAN DEFAULT true,
        customization JSON
      )
    `);
    console.log('Created user table');

    console.log('Database setup completed successfully!');
    console.log('You can now restart your backend with synchronize: true');

  } catch (error) {
    console.error('Error setting up database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 