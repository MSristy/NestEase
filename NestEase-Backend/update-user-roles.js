const mysql = require('mysql2/promise');

async function updateUserRoles() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nestease'
    });
    
    console.log('Connected to database successfully!');
    console.log('Updating user roles...');
    
    // First, let's see what roles currently exist
    const [currentRoles] = await connection.execute('SELECT DISTINCT role FROM user');
    console.log('Current roles in database:', currentRoles.map(r => r.role));
    
    // Update lowercase roles to uppercase
    const result1 = await connection.execute(`
      UPDATE user 
      SET role = 'USER' 
      WHERE role = 'user'
    `);
    console.log('Updated user roles:', result1[0].affectedRows, 'rows affected');
    
    const result2 = await connection.execute(`
      UPDATE user 
      SET role = 'SERVICE_PROVIDER' 
      WHERE role = 'service_provider'
    `);
    console.log('Updated service_provider roles:', result2[0].affectedRows, 'rows affected');
    
    const result3 = await connection.execute(`
      UPDATE user 
      SET role = 'PROPERTY_OWNER' 
      WHERE role = 'property_owner'
    `);
    console.log('Updated property_owner roles:', result3[0].affectedRows, 'rows affected');
    
    const result4 = await connection.execute(`
      UPDATE user 
      SET role = 'ADMIN' 
      WHERE role = 'admin'
    `);
    console.log('Updated admin roles:', result4[0].affectedRows, 'rows affected');
    
    console.log('User roles updated successfully!');
    
    // Show current roles
    const [rows] = await connection.execute('SELECT id, email, role FROM user');
    console.log('Current user roles:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Email: ${row.email}, Role: ${row.role}`);
    });
    
  } catch (error) {
    console.error('Error updating user roles:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

updateUserRoles(); 