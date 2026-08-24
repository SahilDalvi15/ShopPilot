import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, getCurrentUser } from '../store/slices/authSlice';
import vendorService from '../services/vendor.service';
import toast from 'react-hot-toast';

const VendorOnboarding = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loadUser = () => dispatch(getCurrentUser());
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    logo: '',
    banner: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vendorService.registerVendor(formData);
      await loadUser(); // Reload user to get the new 'vendor' role
      toast.success('Store created successfully! Welcome to the marketplace.');
      navigate('/vendor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're already a seller!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Head over to your dashboard to manage your products and track sales.</p>
          <button 
            onClick={() => navigate('/vendor/dashboard')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <Store className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Become a Seller
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Open your own store and reach millions of customers instantly.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Store Name *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  placeholder="e.g. Tech Haven"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Store Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  placeholder="Tell customers what your store is about..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Logo URL (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Banner URL (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="banner"
                  name="banner"
                  type="url"
                  value={formData.banner}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
                  placeholder="https://example.com/banner.png"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating Store...' : (
                  <>
                    Open My Store <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
