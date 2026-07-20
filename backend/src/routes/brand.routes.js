const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller');

router.get('/', getBrands);
router.post('/', authenticate, authorize(['admin', 'super_admin']), createBrand);
router.put('/:brandId', authenticate, authorize(['admin', 'super_admin']), updateBrand);
router.delete('/:brandId', authenticate, authorize(['admin', 'super_admin']), deleteBrand);

module.exports = router;
