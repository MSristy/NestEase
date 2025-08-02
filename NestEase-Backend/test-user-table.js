const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nestease'
    });

    console.log('✅ Connected to database successfully');

    // Check if user table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "user"');
    if (tables.length === 0) {
      console.log('❌ User table does not exist');
      return;
    }
    console.log('✅ User table exists');

    // Check table structure
    const [columns] = await connection.execute('DESCRIBE user');
    console.log('📋 User table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check if there are any users
    const [users] = await connection.execute('SELECT id, name, email, phone, address FROM user LIMIT 5');
    console.log('👥 Sample users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: "${user.name}", Email: "${user.email}", Phone: "${user.phone}", Address: "${user.address}"`);
    });

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testDatabase(); 