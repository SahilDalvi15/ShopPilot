const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');
const { getProducts, getProductBySlug, getProductRecommendations, createProduct, updateProduct, deleteProduct, importProductsCsv } = require('../controllers/product.controller');

router.post('/import/csv', authenticate, authorize(['admin', 'super_admin']), upload.single('file'), importProductsCsv);
router.get('/', getProducts);
router.get('/:productId/recommendations', getProductRecommendations);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorize(['admin', 'super_admin']), validate(createProductSchema), createProduct);
router.put('/:productId', authenticate, authorize(['admin', 'super_admin']), validate(updateProductSchema), updateProduct);
router.delete('/:productId', authenticate, authorize(['admin', 'super_admin']), deleteProduct);

module.exports = router;
