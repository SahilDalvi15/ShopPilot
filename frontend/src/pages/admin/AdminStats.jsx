import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const AdminStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹4,52,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Products',
      value: '456',
      change: '+5.1%',
      trend: 'up',
      icon: Package,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: '3,456',
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'orange',
    },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '₹2,499', status: 'Delivered', date: '2 hours ago' },
    { id: '#12346', customer: 'Jane Smith', amount: '₹1,899', status: 'Processing', date: '4 hours ago' },
    { id: '#12347', customer: 'Bob Johnson', amount: '₹3,299', status: 'Shipped', date: '6 hours ago' },
    { id: '#12348', customer: 'Alice Brown', amount: '₹999', status: 'Pending', date: '8 hours ago' },
    { id: '#12349', customer: 'Charlie Wilson', amount: '₹4,599', status: 'Delivered', date: '1 day ago' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234, revenue: '₹5,85,000' },
    { name: 'Smart Watch', sales: 189, revenue: '₹4,72,500' },
    { name: 'Laptop Stand', sales: 156, revenue: '₹2,34,000' },
    { name: 'USB-C Hub', sales: 145, revenue: '₹1,45,000' },
    { name: 'Mechanical Keyboard', sales: 123, revenue: '₹3,69,000' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
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
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
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
            {recentOrders.map((order) => (
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
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
