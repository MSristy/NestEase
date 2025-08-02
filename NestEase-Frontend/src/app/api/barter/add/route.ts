import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Get all form fields
    const transactionType = formData.get('transactionType') as string;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const condition = formData.get('condition') as string;
    const location = formData.get('location') as string;
    const swapValue = formData.get('swapValue') as string;
    const discount = formData.get('discount') as string;
    const originalPrice = formData.get('originalPrice') as string;
    const images = formData.getAll('images') as File[];

    // Validate required fields
    if (!transactionType || !category || !title || !description || !price || !condition || !location) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nestease'
    });

    // Handle image uploads
    const imageUrls = [];
    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const uniqueId = uuidv4();
      const extension = image.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      // Save image to public directory
      const publicDir = join(process.cwd(), 'public', 'uploads');
      const filePath = join(publicDir, filename);
      await writeFile(filePath, buffer);
      
      imageUrls.push(`/uploads/${filename}`);
    }

    // Insert item into database
    const [result] = await connection.execute(
      `INSERT INTO items (
        transaction_type,
        category,
        title,
        description,
        price,
        condition,
        location,
        swap_value,
        discount,
        original_price,
        images,
        created_at,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'active')`,
      [
        transactionType,
        category,
        title,
        description,
        price,
        condition,
        location,
        swapValue || null,
        discount || null,
        originalPrice || null,
        JSON.stringify(imageUrls)
      ]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Item added successfully',
      itemId: (result as any).insertId
    });

  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add item' },
      { status: 500 }
    );
  }
} 