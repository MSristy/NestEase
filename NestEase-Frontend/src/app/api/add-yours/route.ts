import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nestease',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database table if it doesn't exist
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create add_yours table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS add_yours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_type ENUM('sell', 'buy', 'swap', 'offer') NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2),
        item_condition VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(255),
        discount INT,
        original_price DECIMAL(10, 2),
        owner_id INT NOT NULL,
        status ENUM('active', 'pending', 'sold', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);

    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on startup
initializeDatabase();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'transactionType', 'price', 'condition', 'description', 'location', 'imageUrl', 'ownerId', 'ownerName'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Insert into database
    const query = `INSERT INTO add_yours (
      title, category, transaction_type, price, item_condition, description, 
      location, image_url, owner_id, owner_name, swap_value, discount, 
      original_price, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const values = [
      data.title,
      data.category,
      data.transactionType,
      data.price,
      data.condition,
      data.description,
      data.location,
      data.imageUrl,
      data.ownerId,
      data.ownerName,
      data.swapValue || null,
      data.discount || null,
      data.originalPrice || null,
      data.status || 'active'
    ];

    console.log('Executing query:', query);
    console.log('With values:', values);

    const [result] = await pool.execute(query, values);
    console.log('Insert result:', result);

    return NextResponse.json({ 
      message: 'Item added successfully',
      itemId: (result as any).insertId 
    });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('Fetching items from database...');
    const [rows] = await pool.execute(
      'SELECT * FROM add_yours WHERE status = "active" ORDER BY created_at DESC'
    );
    console.log('Fetched items:', rows);
    
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
} 