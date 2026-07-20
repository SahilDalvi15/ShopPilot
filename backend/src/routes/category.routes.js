const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');

router.get('/', getCategories);
router.post('/', authenticate, authorize(['admin', 'super_admin']), createCategory);
router.put('/:categoryId', authenticate, authorize(['admin', 'super_admin']), updateCategory);
router.delete('/:categoryId', authenticate, authorize(['admin', 'super_admin']), deleteCategory);

module.exports = router;
