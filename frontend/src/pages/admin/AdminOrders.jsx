import { useState } from 'react';
import { Search, Filter, Eye, Download, MoreVertical, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminOrderService from '../../services/adminOrderService';
import { useToast } from '../../contexts/ToastContext';

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch orders
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminOrderService.getAllOrders(),
  });

  const orders = response?.data || [];

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => adminOrderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      success('Order status updated successfully');
      queryClient.invalidateQueries(['admin-orders']);
    },
    onError: (err) => {
      toastError(err.response?.data?.message || 'Failed to update order status');
    },
  });

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         order.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleExport = () => {
    if (!filteredOrders.length) return;
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Items', 'Total', 'Payment', 'Status', 'Date'];
    const csvData = filteredOrders.map(order => [
      order._id,
      order.user?.name || 'Unknown',
      order.user?.email || 'N/A',
      order.items?.length || 0,
      order.totalAmount,
      order.paymentMethod || 'N/A',
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-purple-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{order.items?.length || 0}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-gray-700 capitalize">{order.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updateStatusMutation.isLoading}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border border-transparent hover:border-gray-200 transition-colors ${getStatusColor(order.status)} cursor-pointer disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
