const axios = require('axios');

async function testUpdateProfile() {
  try {
    // 1. login to get token
    const loginRes = await axios.post('https://shoppilot-backend-cw8j.onrender.com/api/v1/auth/login', {
      email: 'test-profile-500@example.com', 
      password: 'Password123!'
    });
    const token = loginRes.data.data.tokens.accessToken;
    
    // 2. call PUT /api/v1/users/profile
    const updateRes = await axios.put('https://shoppilot-backend-cw8j.onrender.com/api/v1/users/profile', {
      firstName: 'UpdatedName'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update Success:', updateRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status:', err.response.status);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Network error:', err.message);
    }
  }
}

testUpdateProfile();
