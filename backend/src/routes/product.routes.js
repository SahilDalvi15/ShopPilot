const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorize(['admin', 'super_admin']), createProduct);
router.put('/:productId', authenticate, authorize(['admin', 'super_admin']), updateProduct);
router.delete('/:productId', authenticate, authorize(['admin', 'super_admin']), deleteProduct);

module.exports = router;
