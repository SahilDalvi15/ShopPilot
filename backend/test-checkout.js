const axios = require('axios');

async function testCheckout() {
  try {
    // 1. Login as a user
    console.log('Registering...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!'
    });
    const token = loginRes.data.data.tokens.accessToken;
    console.log('Token received');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Clear cart
    await axios.delete('http://localhost:5000/api/v1/cart', { headers }).catch(() => {});
    
    // 3. Add an item to cart
    const productsRes = await axios.get('http://localhost:5000/api/v1/products');
    const productsArray = productsRes.data.data.products || productsRes.data.data;
    const product = productsArray[0];
    
    console.log(`Adding product ${product.id} to cart...`);
    await axios.post('http://localhost:5000/api/v1/cart/items', {
      productId: product.id,
      quantity: 1
    }, { headers });

    // 4. Get Addresses
    const addrRes = await axios.get('http://localhost:5000/api/v1/users/addresses', { headers });
    let address = addrRes.data.data[0];
    if (!address) {
      console.log('Creating an address...');
      const newAddrRes = await axios.post('http://localhost:5000/api/v1/users/addresses', {
        fullName: 'John Doe',
        phoneNumber: '1234567890',
        addressLine1: '123 Main St',
        city: 'Mumbai',
        state: 'MH',
        country: 'India',
        postalCode: '400001',
        isDefault: true
      }, { headers });
      address = newAddrRes.data.data;
    }

    // 5. Place order
    console.log('Placing order...');
    const orderRes = await axios.post('http://localhost:5000/api/v1/orders', {
      shippingAddressId: address.id || address._id,
      paymentMethod: 'mock'
    }, { headers });

    console.log('Order created successfully!', orderRes.data);

  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCheckout();
