const User = require('../models/User.model');
const Address = require('../models/Address.model');
const logger = require('../utils/logger');

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Update only allowed fields
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 'gender', 'profilePicture'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isEmailVerified: user.isEmailVerified
    };
  }

  async getAddresses(userId) {
    const addresses = await Address.find({ userId, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 });
    return addresses.map(addr => ({
      id: addr._id,
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      postalCode: addr.postalCode,
      addressType: addr.addressType,
      isDefault: addr.isDefault
    }));
  }

  async addAddress(userId, addressData) {
    const address = await Address.create({
      userId,
      ...addressData
    });

    return {
      id: address._id,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType,
      isDefault: address.isDefault
    };
  }

  async updateAddress(userId, addressId, updateData) {
    const address = await Address.findOne({ _id: addressId, userId, isDeleted: false });
    
    if (!address) {
      const error = new Error('Address not found');
      error.statusCode = 404;
      error.code = 'ADDRESS_NOT_FOUND';
      throw error;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      address[key] = updateData[key];
    });

    // If setting as default, remove default from other addresses
    if (updateData.isDefault && updateData.isDefault !== address.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId }, isDefault: true },
        { isDefault: false }
      );
    }

    await address.save();

    return {
      id: address._id,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType,
      isDefault: address.isDefault
    };
  }

  async deleteAddress(userId, addressId) {
    const address = await Address.findOne({ _id: addressId, userId, isDeleted: false });
    
    if (!address) {
      const error = new Error('Address not found');
      error.statusCode = 404;
      error.code = 'ADDRESS_NOT_FOUND';
      throw error;
    }

    address.isDeleted = true;
    await address.save();

    logger.info(`Address ${addressId} deleted for user ${userId}`);
  }

  async setDefaultAddress(userId, addressId) {
    const address = await Address.findOne({ _id: addressId, userId, isDeleted: false });
    
    if (!address) {
      const error = new Error('Address not found');
      error.statusCode = 404;
      error.code = 'ADDRESS_NOT_FOUND';
      throw error;
    }

    // Remove default from all addresses
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );

    // Set new default
    address.isDefault = true;
    await address.save();

    logger.info(`Address ${addressId} set as default for user ${userId}`);
  }
  async adminGetUsers(query) {
    const { page = 1, limit = 10, role, search } = query;
    const skip = (page - 1) * limit;

    const queryObj = { isDeleted: false };
    if (role && role !== 'all') {
      // In the frontend, roles are passed as 'Admin' or 'Customer'. Map appropriately.
      queryObj.role = role.toLowerCase() === 'admin' ? { $in: ['admin', 'super_admin'] } : 'customer';
    }

    if (search) {
      queryObj.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(queryObj)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(queryObj);

    const transformedUsers = users.map(user => ({
      _id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: ['admin', 'super_admin'].includes(user.role) ? 'Admin' : 'Customer',
      isBlocked: !user.isActive, // Map isActive to isBlocked for frontend
      avatar: user.profilePicture, 
      createdAt: user.createdAt
    }));

    return {
      users: transformedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    };
  }

  async adminUpdateUserRole(userId, role) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Role comes from frontend as 'Admin' or 'Customer'
    user.role = role.toLowerCase() === 'admin' ? 'admin' : 'customer';
    await user.save();
    
    return {
      _id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: ['admin', 'super_admin'].includes(user.role) ? 'Admin' : 'Customer',
      isBlocked: !user.isActive,
      avatar: user.profilePicture,
      createdAt: user.createdAt
    };
  }

  async adminToggleUserBlock(userId, isBlocked) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    user.isActive = !isBlocked;
    await user.save();
    
    return {
      _id: user._id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: ['admin', 'super_admin'].includes(user.role) ? 'Admin' : 'Customer',
      isBlocked: !user.isActive,
      avatar: user.profilePicture,
      createdAt: user.createdAt
    };
  }

  async adminDeleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    user.isDeleted = true;
    await user.save();
    
    return true;
  }
}

module.exports = new UserService();
