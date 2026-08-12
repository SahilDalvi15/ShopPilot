const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getProfile, updateProfile, updateSecuritySettings, uploadProfilePicture, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/user.controller');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/security', authenticate, updateSecuritySettings);
router.post('/profile-picture', authenticate, uploadProfilePicture);
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:addressId', authenticate, updateAddress);
router.delete('/addresses/:addressId', authenticate, deleteAddress);
router.put('/addresses/:addressId/default', authenticate, setDefaultAddress);

// Admin Routes
const { authorize } = require('../middlewares/auth.middleware');
const { adminGetUsers, adminUpdateUserRole, adminToggleUserBlock, adminDeleteUser } = require('../controllers/user.controller');

router.get('/admin/all', authenticate, authorize(['admin', 'super_admin']), adminGetUsers);
router.put('/admin/:userId/role', authenticate, authorize(['admin', 'super_admin']), adminUpdateUserRole);
router.put('/admin/:userId/block', authenticate, authorize(['admin', 'super_admin']), adminToggleUserBlock);
router.delete('/admin/:userId', authenticate, authorize(['admin', 'super_admin']), adminDeleteUser);

module.exports = router;
