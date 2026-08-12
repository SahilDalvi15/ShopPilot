import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Lock, Bell, LogOut, X } from 'lucide-react';
import { updateProfile } from '../store/slices/authSlice';
import { useToast } from '../contexts/ToastContext';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const AVAILABLE_AVATARS = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png'
  ];

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    profilePicture: user?.profilePicture || '',
  });

  const selectAvatar = (avatarUrl) => {
    setFormData(prev => ({ ...prev, profilePicture: avatarUrl }));
    setIsAvatarModalOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const resultAction = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(resultAction)) {
        success('Profile Updated', 'Your profile has been updated successfully.');
        setIsEditing(false);
      } else {
        toastError('Update Failed', resultAction.payload || 'Failed to update profile.');
      }
    } catch (err) {
      toastError('Update Failed', 'An unexpected error occurred.');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      profilePicture: user?.profilePicture || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-100 p-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeTab === 'notifications'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Notifications
                </button>
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    {(isEditing ? formData.profilePicture : user?.profilePicture) ? (
                      <img
                        src={isEditing ? formData.profilePicture : user?.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-purple-50"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                        <span className="text-white font-bold text-4xl">
                          {user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 bg-white text-purple-600 p-2.5 rounded-full hover:bg-purple-50 hover:-translate-y-0.5 transition-all shadow-lg border border-gray-100 group"
                        title="Change Avatar"
                      >
                        <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Member since {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1.5 hover:underline"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        Choose 3D Avatar
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <span className="text-gray-900 capitalize">
                          {user?.gender || 'Not set'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-gray-100">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2 font-medium"
                        >
                          {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          )}
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={loading}
                          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <div className="space-y-6">
                  {/* Change Password - Temporarily disabled as backend route does not exist
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Lock className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                      </div>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                      Change
                    </button>
                  </div>
                  */}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Verification</h3>
                        <p className="text-sm text-gray-600">
                          {user?.isEmailVerified ? 'Your email is verified' : 'Verify your email address'}
                        </p>
                      </div>
                    </div>
                    {!user?.isEmailVerified && (
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                        Verify
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <LogOut className="h-6 w-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Delete Account</h3>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Order Updates</h3>
                        <p className="text-sm text-gray-600">Receive notifications about your orders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Promotional Emails</h3>
                        <p className="text-sm text-gray-600">Receive offers and promotions</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Wishlist Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when wishlist items are on sale</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/orders"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 border border-gray-100 transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">My Orders</h3>
              <p className="text-sm text-gray-500">View your order history and track shipments</p>
            </Link>
            <Link
              to="/addresses"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 border border-gray-100 transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Addresses</h3>
              <p className="text-sm text-gray-500">Manage your shipping addresses</p>
            </Link>
            <Link
              to="/wishlist"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 border border-gray-100 transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Wishlist</h3>
              <p className="text-sm text-gray-500">View your saved items</p>
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Avatar Selector Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Choose your 3D Avatar</h2>
                <p className="text-sm text-gray-500 mt-1">Select a premium 3D character for your profile</p>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {AVAILABLE_AVATARS.map((avatar, idx) => (
                  <div 
                    key={idx}
                    onClick={() => selectAvatar(avatar)}
                    className="relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar Option ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur text-purple-700 text-sm font-semibold py-1.5 px-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Select
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
