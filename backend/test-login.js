const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('https://shoppilot-backend-cw8j.onrender.com/api/v1/auth/login', {
      email: 'test@example.com', // just to see the error response
      password: 'wrongpassword'
    });
    console.log('Success:', res.data);
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
      console.log('Error headers:', error.response.headers);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testLogin();
