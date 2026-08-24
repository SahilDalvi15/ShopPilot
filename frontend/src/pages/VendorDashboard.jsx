import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, DollarSign, Package, TrendingUp, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import vendorService from '../services/vendor.service';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VendorDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'vendor') {
      navigate('/vendor/register');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await vendorService.getVendorDashboard();
        setDashboardData(data.data);
      } catch (error) {
        toast.error('Failed to load vendor dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
  }

  if (!dashboardData) return null;

  const { vendor, stats, recentOrderItems } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.storeName} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-500">
                <Store className="w-8 h-8 text-indigo-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {vendor.storeName}
              </h1>
              <a href={`/store/${vendor.slug}`} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View Public Store
              </a>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/admin/products/new')} // We can reuse the admin product creation flow, backend will assign vendorId
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.balance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSales}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.productCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trends Line Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales Trends (Last 30 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.salesTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 8 }} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Bar Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top 5 Products</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topProducts || []} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{fontSize: 12}} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" tick={{fontSize: 11}} stroke="#94a3b8" width={90} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="sales" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Sales</h3>
          </div>
          {recentOrderItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No sales yet. Keep adding great products!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900/50">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {recentOrderItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {item.productImage && (
                            <img src={item.productImage} alt={item.productTitle} className="w-10 h-10 rounded object-cover" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.productTitle}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{item.subtotal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {item.orderId?.orderStatus || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
