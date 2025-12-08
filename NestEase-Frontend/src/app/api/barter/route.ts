import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

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
    const query = `INSERT INTO barter_items (
      title, category, transaction_type, price, condition, description, 
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
      'SELECT * FROM barter_items WHERE status = "active" ORDER BY created_at DESC'
    );
    console.log('Fetched items:', rows);
    
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
} 