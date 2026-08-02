const express = require('express');
const router = express.Router();
const { searchProducts, getSearchSuggestions } = require('../controllers/search.controller');

// Search products
router.get('/products', searchProducts);

// Get search suggestions
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
