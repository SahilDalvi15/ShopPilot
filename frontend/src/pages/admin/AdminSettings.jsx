import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Save, Store, Mail, Lock, Shield, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/auth.service';
import { settingService } from '../../services/settingService';

const AdminSettings = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const { user } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: settingService.getSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: settingService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      success('Settings Saved', 'General store settings have been updated.');
    },
    onError: (err) => {
      error('Error', err.response?.data?.message || 'Failed to update settings');
    }
  });

  const [generalSettings, setGeneralSettings] = useState({
    storeName: '',
    contactEmail: '',
    currency: 'INR',
    logoUrl: '',
    taxRate: 18,
    shippingCharge: 50,
    freeShippingThreshold: 500
  });

  useEffect(() => {
    if (settingsData?.data) {
      setGeneralSettings({
        storeName: settingsData.data.storeName || '',
        contactEmail: settingsData.data.contactEmail || '',
        currency: settingsData.data.currency || 'INR',
        logoUrl: settingsData.data.logoUrl || '',
        taxRate: settingsData.data.taxRate ?? 18,
        shippingCharge: settingsData.data.shippingCharge ?? 50,
        freeShippingThreshold: settingsData.data.freeShippingThreshold ?? 500
      });
    }
  }, [settingsData]);

  const [securitySettings, setSecuritySettings] = useState({
    adminEmail: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(generalSettings);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (!securitySettings.currentPassword) {
      return error('Error', 'Current password is required to save changes.');
    }
    if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
      return error('Error', 'New passwords do not match.');
    }
    
    setIsUpdatingSecurity(true);
    try {
      await authService.updateSecurity({
        currentPassword: securitySettings.currentPassword,
        newPassword: securitySettings.newPassword || undefined,
        email: securitySettings.adminEmail
      });
      success('Success', 'Security settings updated successfully.');
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      error('Error', err.response?.data?.message || 'Failed to update security settings.');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your store configuration and admin account</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Settings Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors mr-8 ${
                activeTab === 'general'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Store className="w-4 h-4" />
              General Store Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Security
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'general' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Store Configuration</h2>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={generalSettings.storeName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">This email will be displayed to customers.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={generalSettings.logoUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, logoUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalSettings.taxRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Charge ({generalSettings.currency === 'INR' ? '₹' : generalSettings.currency === 'USD' ? '$' : '€'})</label>
                    <input
                      type="number"
                      value={generalSettings.shippingCharge}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, shippingCharge: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                    <input
                      type="number"
                      value={generalSettings.freeShippingThreshold}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, freeShippingThreshold: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    disabled={updateSettingsMutation.isPending}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
                  >
                    {updateSettingsMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security & Credentials</h2>

              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={securitySettings.adminEmail}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, adminEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingSecurity}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
                  >
                    {isUpdatingSecurity ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Update Credentials
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
