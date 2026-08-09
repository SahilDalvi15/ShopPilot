const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingAddressId: Joi.string().required().messages({
    'any.required': 'Shipping address ID is required',
  }),
  billingAddressId: Joi.string().optional(),
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().allow('', null),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().optional(),
  }).optional(),
  paymentMethod: Joi.string()
    .valid('cod', 'mock', 'razorpay')
    .required()
    .messages({
      'any.only': 'Payment method must be one of: cod, mock, razorpay',
      'any.required': 'Payment method is required',
    }),
  couponCode: Joi.string().optional().allow('', null),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
