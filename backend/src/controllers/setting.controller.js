const Setting = require('../models/Setting.model');

// Helper to get or create settings document since there should only be one
const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
};

const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve settings',
      error: { code: 'GET_SETTINGS_ERROR' }
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Update fields
    const { storeName, contactEmail, logoUrl, currency, taxRate, shippingCharge, freeShippingThreshold } = req.body;
    
    if (storeName !== undefined) settings.storeName = storeName;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (currency !== undefined) settings.currency = currency;
    if (taxRate !== undefined) settings.taxRate = Number(taxRate);
    if (shippingCharge !== undefined) settings.shippingCharge = Number(shippingCharge);
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update settings',
      error: { code: 'UPDATE_SETTINGS_ERROR' }
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
