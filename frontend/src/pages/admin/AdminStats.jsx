import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import adminStatsService from '../../services/adminStatsService';

const AdminStats = () => {
  const { data: statsResponse, isLoading, isError, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminStatsService.getAdminStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-semibold">Error Loading Statistics</h3>
        <p>{error?.message || 'Failed to fetch admin stats.'}</p>
      </div>
    );
  }

  const { overview, recentOrders, topProducts } = statsResponse.data;

  const stats = [
    {
      title: 'Total Revenue',
      value: overview.totalRevenue,
      change: '0%', // Simplified for now
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders,
      change: '0%', // Simplified for now
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Products',
      value: overview.totalProducts,
      change: '0%', // Simplified for now
      trend: 'up',
      icon: Package,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: overview.totalUsers,
      change: '0%', // Simplified for now
      trend: 'up', // Neutral/Up
      icon: Users,
      color: 'orange',
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  stat.color === 'green'
                    ? 'bg-green-100 text-green-600'
                    : stat.color === 'blue'
                    ? 'bg-blue-100 text-blue-600'
                    : stat.color === 'purple'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-orange-100 text-orange-600'
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              {/* Optional: Render trend if it's not 0% */}
              {stat.change !== '0%' && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{order.id}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{order.customer}</span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">No recent orders found.</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : index === 1
                          ? 'bg-gray-200 text-gray-700'
                          : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">No top products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
