const axios = require('axios');

async function testProfile() {
  try {
    const loginRes = await axios.post('https://shoppilot-backend-cw8j.onrender.com/api/v1/auth/login', {
      email: 'test-profile-500@example.com', 
      password: 'Password123!'
    });
    const token = loginRes.data.data.tokens.accessToken;
    
    const profRes = await axios.get('https://shoppilot-backend-cw8j.onrender.com/api/v1/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Profile Success:', profRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status:', err.response.status);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Network error:', err.message);
    }
  }
}

testProfile();
