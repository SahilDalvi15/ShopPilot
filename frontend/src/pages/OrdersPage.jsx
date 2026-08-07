import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { orderService } from '../services/order.service';

const OrdersPage = () => {
  const [expandedOrders, setExpandedOrders] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });

  const orders = data?.data || [];


  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'packed':
      case 'shipped':
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
      case 'packed':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Failed to load orders. {error.message}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      <p className={`text-sm ${order.paymentStatus === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={item.product?.images?.[0] || '/placeholder.jpg'}
                          alt={item.product?.title || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.title || 'Product Unavailable'}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    {expandedOrders[order.id] ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>
                  
                  {order.orderStatus === 'pending' || order.orderStatus === 'confirmed' ? (
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Cancel Order
                    </button>
                  ) : null}
                </div>

                {/* Order Status History */}
                {expandedOrders[order.id] && order.statusHistory && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Status History</h3>
                    <div className="space-y-3">
                      {order.statusHistory.map((history, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              index === order.statusHistory.length - 1 ? 'bg-indigo-600' : 'bg-gray-300'
                            }`} />
                            {index < order.statusHistory.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {history.status.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-gray-600">{history.note}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(history.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
