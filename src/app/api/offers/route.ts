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

export async function GET() {
  let connection;
  try {
    console.log('Starting GET request handler...');
    console.log('Attempting to connect to database...');
    connection = await pool.getConnection();
    console.log('Connected to database successfully');
    
    // First, let's check if the table exists
    console.log('Checking if item_offer table exists...');
    const [tables] = await connection.query('SHOW TABLES LIKE "item_offer"');
    console.log('Tables check result:', tables);
    
    if (Array.isArray(tables) && tables.length === 0) {
      console.log('Creating item_offer table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS item_offer (
          id INT AUTO_INCREMENT PRIMARY KEY,
          owner_name VARCHAR(255) NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          discount DECIMAL(10,2) NOT NULL DEFAULT 0,
          category VARCHAR(100) NOT NULL,
          product_condition VARCHAR(20) NOT NULL,
          location VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          images TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Table created successfully');
    }
    
    console.log('Executing query to fetch offers...');
    const [rows] = await connection.query('SELECT * FROM item_offer');
    console.log('Query results:', JSON.stringify(rows, null, 2));
    
    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch offers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      console.log('Releasing database connection...');
      connection.release();
      console.log('Connection released');
    }
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    console.log('Starting POST request handler...');
    const body = await request.json();
    console.log('Received request body:', body);
    
    console.log('Getting database connection...');
    connection = await pool.getConnection();
    console.log('Connected to database successfully');
    
    console.log('Inserting new offer...');
    const [result] = await connection.query(
      'INSERT INTO item_offer (owner_name, product_name, price, discount, category, product_condition, location, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        body.owner_name,
        body.product_name,
        body.price,
        body.discount || 0,
        body.category,
        body.product_condition,
        body.location,
        body.description,
        body.images
      ]
    );
    console.log('Insert result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Offer added successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add offer',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      console.log('Releasing database connection...');
      connection.release();
      console.log('Connection released');
    }
  }
} 