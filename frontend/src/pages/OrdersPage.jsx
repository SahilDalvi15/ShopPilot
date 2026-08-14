import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, MapPin, Calendar, CreditCard, Box, PackageCheck, Download } from 'lucide-react';
import { orderService } from '../services/order.service';
import { useToast } from '../contexts/ToastContext';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Box },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: PackageCheck },
  { key: 'delivered', label: 'Delivered', icon: Package },
];

const OrdersPage = () => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      success('Order Cancelled', 'Your order has been cancelled successfully.');
      setCancellingOrderId(null);
    },
    onError: (err) => {
      toastError('Cancellation Failed', err.response?.data?.message || 'Failed to cancel order.');
      setCancellingOrderId(null);
    },
  });

  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const handleDownloadInvoice = async (order) => {
    setDownloadingInvoiceId(order.id);
    try {
      const blob = await orderService.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      success('Invoice Downloaded', 'Your invoice has been downloaded successfully.');
    } catch (err) {
      toastError('Download Failed', 'Could not download the invoice.');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const orders = data?.data || [];

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === activeFilter);

  const getStepIndex = (status) => {
    const idx = ORDER_STEPS.findIndex(s => s.key === status);
    return idx === -1 ? -1 : idx;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
      case 'packed': return 'bg-blue-100 text-blue-700';
      case 'shipped':
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'returned': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const filters = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500 mb-6">Track, manage, and review your orders</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeFilter === f.key
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Failed to load orders. {error.message}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
            </h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStepIndex = getStepIndex(order.orderStatus);
              const isCancelled = order.orderStatus === 'cancelled';
              const isExpanded = expandedOrders[order.id];

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  {/* Order Header */}
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">{order.orderNumber}</h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            {order.paymentMethod?.toUpperCase() || 'N/A'}
                          </span>
                          {order.estimatedDelivery && !isCancelled && order.orderStatus !== 'delivered' && (
                            <span className="flex items-center gap-1 text-indigo-600 font-medium">
                              <Truck className="w-3.5 h-3.5" />
                              Est. {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                        <p className={`text-xs font-medium ${order.paymentStatus === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                          Payment {order.paymentStatus?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Timeline Stepper */}
                  {!isCancelled && (
                    <div className="px-5 py-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        {ORDER_STEPS.map((step, index) => {
                          const StepIcon = step.icon;
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          return (
                            <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  isCurrent
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 ring-4 ring-purple-100 animate-pulse'
                                    : isCompleted
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                }`}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                                  isCurrent ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                              {index < ORDER_STEPS.length - 1 && (
                                <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${
                                  index < currentStepIndex ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm' : 'bg-gray-100'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Banner */}
                  {isCancelled && (
                    <div className="px-5 py-3 bg-red-50 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-700 font-medium">This order was cancelled</span>
                    </div>
                  )}

                  {/* Order Items (always visible, compact) */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <img
                            src={item.product?.images?.[0] || '/placeholder.jpg'}
                            alt={item.product?.title || 'Product'}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product?.title || 'Product Unavailable'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString()}</p>
                            {item.selectedSize && (
                              <p className="text-sm text-gray-500 mt-0.5">Size: <span className="font-medium text-gray-700">{item.selectedSize}</span></p>
                            )}
                          </div>
                          <p className="font-bold text-gray-900 text-lg">₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-4 h-4" /> Hide Details</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> View Details</>
                      )}
                    </button>

                    <div className="flex gap-4 items-center">
                      {!isCancelled && (
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={downloadingInvoiceId === order.id}
                          className="text-gray-600 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          {downloadingInvoiceId === order.id ? 'Downloading...' : 'Invoice'}
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(order.orderStatus) && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              setCancellingOrderId(order.id);
                              cancelOrderMutation.mutate(order.id);
                            }
                          }}
                          disabled={cancellingOrderId === order.id}
                          className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                        >
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="p-5 border-b border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" /> Shipping Address
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.addressLine1}
                            {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                          </p>
                        </div>
                      )}

                      {/* Status History Timeline */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="p-6 bg-gray-50/50">
                          <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" /> Tracking History
                          </h4>
                          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {[...order.statusHistory].reverse().map((history, index) => (
                              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Icon */}
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                                  index === 0 ? 'bg-purple-600' : 'bg-gray-300'
                                } z-10 mx-4 md:mx-0 absolute left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2`}>
                                </div>
                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl shadow-sm bg-white border border-gray-100 ml-12 md:ml-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className={`font-bold capitalize ${index === 0 ? 'text-purple-600' : 'text-gray-900'}`}>
                                      {history.status?.replace(/_/g, ' ')}
                                    </h5>
                                    <time className="text-xs font-medium text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
                                      {new Date(history.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </time>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{history.note || 'Status updated'}</p>
                                  <time className="text-xs text-gray-400 mt-2 block">
                                    {new Date(history.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </time>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
