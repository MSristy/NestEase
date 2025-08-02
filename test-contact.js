// Test script for contact form API
const testContactForm = async () => {
  try {
    const response = await fetch('http://localhost:3001/contact-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Contact Form',
        message: 'This is a test message from the contact form to verify the API is working correctly.'
      }),
    });

    const data = await response.json();
    console.log('Contact form response:', data);
    
    if (response.ok) {
      console.log('✅ Contact form submission successful!');
    } else {
      console.log('❌ Contact form submission failed:', data);
    }
  } catch (error) {
    console.error('❌ Error testing contact form:', error);
  }
};

// Test admin access to messages
const testAdminAccess = async () => {
  try {
    // Note: This will fail without a valid admin token, but it tests the endpoint exists
    const response = await fetch('http://localhost:3001/contact-messages', {
      headers: {
        'Authorization': 'Bearer invalid-token',
      },
    });

    console.log('Admin access test response status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Admin endpoint exists and requires authentication');
    } else {
      console.log('⚠️ Unexpected response:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  }
};

// Run tests
console.log('🧪 Testing Contact Messages API...\n');

testContactForm();
setTimeout(() => {
  testAdminAccess();
}, 1000); 