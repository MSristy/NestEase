const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nestease'
  });

  try {
    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM user WHERE email = ?',
      ['admin@nestease.com']
    );

    if (existingUsers.length > 0) {
      console.log('Admin user already exists!');
      console.log('Email: admin@nestease.com');
      console.log('Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    await connection.execute(
      'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@nestease.com', hashedPassword, 'admin']
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@nestease.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await connection.end();
  }
}

createAdminUser(); 