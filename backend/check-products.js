const axios = require('axios');
async function run() {
  const productsRes = await axios.get('http://localhost:5000/api/v1/products');
  console.log(JSON.stringify(productsRes.data, null, 2));
}
run();
