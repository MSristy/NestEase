import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { itemId, sellerId, message, itemTitle, sellerName } = body;

    // Log each field separately for debugging
    console.log('Parsed fields:', {
      itemId: itemId,
      sellerId: sellerId,
      message: message,
      itemTitle: itemTitle,
      sellerName: sellerName
    });

    // Validate required fields with specific messages
    const missingFields = [];
    if (!itemId) missingFields.push('itemId');
    if (!sellerId) missingFields.push('sellerId');
    if (!message) missingFields.push('message');
    if (!itemTitle) missingFields.push('itemTitle');
    if (!sellerName) missingFields.push('sellerName');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          error: `The following fields are required: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Create MySQL connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nestease'
    });

    console.log('Database connection established');

    // Create the contact_messages table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        seller_id INT NOT NULL,
        message TEXT NOT NULL,
        item_title VARCHAR(255) NOT NULL,
        seller_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'read', 'replied') DEFAULT 'pending'
      )
    `);

    console.log('Table check/creation completed');

    // Insert the message
    const [result] = await connection.execute(
      'INSERT INTO contact_messages (item_id, seller_id, message, item_title, seller_name) VALUES (?, ?, ?, ?, ?)',
      [itemId, sellerId, message, itemTitle, sellerName]
    );

    console.log('Message inserted successfully:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: result 
    });

  } catch (error) {
    console.error('Detailed error in contact-seller API:', error);
    
    // Check for specific MySQL errors
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database connection failed',
            error: 'Could not connect to the database. Please check if MySQL is running.'
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('ER_NO_SUCH_TABLE')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database table not found',
            error: 'The required table does not exist.'
          },
          { status: 500 }
        );
      }

      if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database access denied',
            error: 'Could not access the database. Please check your database credentials.'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
} 