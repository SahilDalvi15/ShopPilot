const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove refresh token from response
    const { refreshToken, ...tokensWithoutRefresh } = result.tokens;
    result.tokens = tokensWithoutRefresh;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: {
        code: error.code || 'REGISTRATION_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove refresh token from response
    const { refreshToken, ...tokensWithoutRefresh } = result.tokens;
    result.tokens = tokensWithoutRefresh;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Login failed',
      error: {
        code: error.code || 'LOGIN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    const result = await authService.googleAuth(token);
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove refresh token from response
    const { refreshToken, ...tokensWithoutRefresh } = result.tokens;
    result.tokens = tokensWithoutRefresh;

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Google login failed',
      error: {
        code: error.code || 'GOOGLE_LOGIN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.user.id);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Logout failed',
      error: {
        code: error.code || 'LOGOUT_ERROR'
      }
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const result = await authService.refreshToken(refreshToken);
    
    // Set new refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    res.clearCookie('refreshToken');
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Token refresh failed',
      error: {
        code: error.code || 'REFRESH_ERROR'
      }
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to send password reset email',
      error: {
        code: error.code || 'FORGOT_PASSWORD_ERROR'
      }
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Password reset failed',
      error: {
        code: error.code || 'RESET_PASSWORD_ERROR'
      }
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Email verification failed',
      error: {
        code: error.code || 'VERIFY_EMAIL_ERROR'
      }
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleAuth
};
