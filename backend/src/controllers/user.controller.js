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

const adminGetUsers = async (req, res) => {
  try {
    const result = await userService.adminGetUsers(req.query);
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve users',
      error: { code: error.code || 'ADMIN_GET_USERS_ERROR' }
    });
  }
};

const adminUpdateUserRole = async (req, res) => {
  try {
    const user = await userService.adminUpdateUserRole(req.params.userId, req.body.role);
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update user role',
      error: { code: error.code || 'ADMIN_UPDATE_ROLE_ERROR' }
    });
  }
};

const adminToggleUserBlock = async (req, res) => {
  try {
    const user = await userService.adminToggleUserBlock(req.params.userId, req.body.isBlocked);
    res.status(200).json({
      success: true,
      message: `User ${req.body.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to toggle user block status',
      error: { code: error.code || 'ADMIN_TOGGLE_BLOCK_ERROR' }
    });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    await userService.adminDeleteUser(req.params.userId);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete user',
      error: { code: error.code || 'ADMIN_DELETE_USER_ERROR' }
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
  setDefaultAddress,
  adminGetUsers,
  adminUpdateUserRole,
  adminToggleUserBlock,
  adminDeleteUser
};
