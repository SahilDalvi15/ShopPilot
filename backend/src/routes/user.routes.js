const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getProfile, updateProfile, uploadProfilePicture, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/user.controller');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/profile-picture', authenticate, uploadProfilePicture);
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:addressId', authenticate, updateAddress);
router.delete('/addresses/:addressId', authenticate, deleteAddress);
router.put('/addresses/:addressId/default', authenticate, setDefaultAddress);

module.exports = router;
