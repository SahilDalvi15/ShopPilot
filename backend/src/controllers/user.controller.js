const userService = require('../services/user.service');

const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve profile',
      error: {
        code: error.code || 'GET_PROFILE_ERROR'
      }
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update profile',
      error: {
        code: error.code || 'UPDATE_PROFILE_ERROR'
      }
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    // TODO: Implement file upload with Cloudinary
    const profile = await userService.updateProfile(req.user.id, {
      profilePicture: req.file?.path || req.body.profilePicture
    });
    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profilePicture: profile.profilePicture }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to upload profile picture',
      error: {
        code: error.code || 'UPLOAD_PICTURE_ERROR'
      }
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await userService.getAddresses(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: addresses
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve addresses',
      error: {
        code: error.code || 'GET_ADDRESSES_ERROR'
      }
    });
  }
};

const addAddress = async (req, res) => {
  try {
    const address = await userService.addAddress(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add address',
      error: {
        code: error.code || 'ADD_ADDRESS_ERROR'
      }
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await userService.updateAddress(req.user.id, req.params.addressId, req.body);
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update address',
      error: {
        code: error.code || 'UPDATE_ADDRESS_ERROR'
      }
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await userService.deleteAddress(req.user.id, req.params.addressId);
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete address',
      error: {
        code: error.code || 'DELETE_ADDRESS_ERROR'
      }
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    await userService.setDefaultAddress(req.user.id, req.params.addressId);
    res.status(200).json({
      success: true,
      message: 'Default address set successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to set default address',
      error: {
        code: error.code || 'SET_DEFAULT_ADDRESS_ERROR'
      }
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
