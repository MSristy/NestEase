const fetch = require('node-fetch');

async function testBooking() {
  try {
    const response = await fetch('http://localhost:3001/service-providers/1/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImlhdCI6MTczNTQ5NzI5MCwiZXhwIjoxNzM1NTgzNjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
      },
      body: JSON.stringify({
        serviceDate: '2025-01-15',
        serviceTime: '10:00',
        duration: 2,
        address: 'Test Address',
        description: 'Test booking'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testBooking(); 