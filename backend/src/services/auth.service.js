const User = require('../models/User.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { setCache, getCache, deleteCache } = require('../utils/redis');
const logger = require('../utils/logger');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phoneNumber } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      error.code = 'USER_EXISTS';
      throw error;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // TODO: Send verification email
    logger.info(`Verification token for ${email}: ${verificationToken}`);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in Redis
    await setCache(`refresh_token:${user._id}`, refreshToken, 7 * 24 * 60 * 60);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async login(email, password) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error('Account is deactivated');
      error.statusCode = 401;
      error.code = 'ACCOUNT_DEACTIVATED';
      throw error;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in Redis
    await setCache(`refresh_token:${user._id}`, refreshToken, 7 * 24 * 60 * 60);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async logout(userId) {
    // Delete refresh token from Redis
    await deleteCache(`refresh_token:${userId}`);
    logger.info(`User ${userId} logged out`);
  }

  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Check if refresh token exists in Redis
      const storedToken = await getCache(`refresh_token:${decoded.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        const error = new Error('Invalid refresh token');
        error.statusCode = 401;
        error.code = 'INVALID_REFRESH_TOKEN';
        throw error;
      }

      // Check if user still exists and is active
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        const error = new Error('User not found or inactive');
        error.statusCode = 401;
        error.code = 'USER_NOT_FOUND';
        throw error;
      }

      // Generate new tokens
      const accessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      // Update refresh token in Redis
      await setCache(`refresh_token:${user._id}`, newRefreshToken, 7 * 24 * 60 * 60);

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Refresh token expired');
        err.statusCode = 401;
        err.code = 'TOKEN_EXPIRED';
        throw err;
      }
      throw error;
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return;
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Send password reset email
    logger.info(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token, newPassword) {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      const error = new Error('Invalid or expired password reset token');
      error.statusCode = 400;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for user ${user._id}`);
  }

  async verifyEmail(token) {
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      const error = new Error('Invalid or expired verification token');
      error.statusCode = 400;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user ${user._id}`);
  }
}

module.exports = new AuthService();
