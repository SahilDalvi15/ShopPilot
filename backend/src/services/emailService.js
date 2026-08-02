const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@shoppilot.ai',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw error;
  }
};

// Email templates
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to ShopPilot!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">Welcome to ShopPilot, ${name}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
        <p>Start shopping and discover amazing products at great prices.</p>
        <p>Best regards,<br>The ShopPilot Team</p>
      </div>
    `,
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>You requested a password reset for your ShopPilot account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The ShopPilot Team</p>
      </div>
    `,
  }),

  orderConfirmation: (name, orderDetails) => ({
    subject: `Order Confirmation - ${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">Order Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your order has been successfully placed.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
          <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}</p>
        </div>
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The ShopPilot Team</p>
      </div>
    `,
  }),

  orderShipped: (name, orderDetails) => ({
    subject: `Order Shipped - ${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">Your Order Has Shipped!</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Shipping Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Tracking Number:</strong> ${orderDetails.trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>
        </div>
        <p>Best regards,<br>The ShopPilot Team</p>
      </div>
    `,
  }),

  orderDelivered: (name, orderDetails) => ({
    subject: `Order Delivered - ${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">Order Delivered!</h1>
        <p>Hi ${name},</p>
        <p>Your order has been delivered successfully.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Delivered On:</strong> ${orderDetails.deliveredDate}</p>
        </div>
        <p>Thank you for shopping with ShopPilot!</p>
        <p>Best regards,<br>The ShopPilot Team</p>
      </div>
    `,
  }),
};

// Send specific email types
const emailService = {
  sendWelcomeEmail: async (email, name) => {
    const template = templates.welcome(name);
    return sendEmail({ to: email, ...template });
  },

  sendPasswordResetEmail: async (email, name, resetLink) => {
    const template = templates.passwordReset(name, resetLink);
    return sendEmail({ to: email, ...template });
  },

  sendOrderConfirmationEmail: async (email, name, orderDetails) => {
    const template = templates.orderConfirmation(name, orderDetails);
    return sendEmail({ to: email, ...template });
  },

  sendOrderShippedEmail: async (email, name, orderDetails) => {
    const template = templates.orderShipped(name, orderDetails);
    return sendEmail({ to: email, ...template });
  },

  sendOrderDeliveredEmail: async (email, name, orderDetails) => {
    const template = templates.orderDelivered(name, orderDetails);
    return sendEmail({ to: email, ...template });
  },
};

module.exports = emailService;
