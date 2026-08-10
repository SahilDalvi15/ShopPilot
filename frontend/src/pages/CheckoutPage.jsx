import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Truck, Shield, ArrowRight, Plus, Check, CreditCard } from 'lucide-react';
import { fetchAddresses } from '../store/slices/addressSlice';
import { clearCart, applyCouponAsync, removeCouponAsync } from '../store/slices/cartSlice';
import { orderService } from '../services/order.service';
import { useToast } from '../contexts/ToastContext';
import AddressCardSkeleton from '../components/skeletons/AddressCardSkeleton';
import MockPaymentModal from '../components/MockPaymentModal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: toastError, success, warning } = useToast();
  
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartDiscount = useSelector((state) => state.cart.totalDiscount);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const { addresses, loading: addressesLoading } = useSelector((state) => state.address);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    // Set default address as selected
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id || defaultAddress.id);
    }
  }, [addresses]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    return cartTotal >= 999 ? 0 : 99;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax() - cartDiscount;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      warning('Address Required', 'Please select a shipping address to continue.');
      return;
    }

    if (paymentMethod === 'mock') {
      setIsMockModalOpen(true);
      return;
    }

    // Process COD directly
    await processOrder('cod');
  };

  const handleMockPaymentSuccess = async () => {
    setIsMockModalOpen(false);
    await processOrder('mock');
  };

  const processOrder = async (method) => {
    setIsProcessing(true);

    try {
      const shippingAddress = addresses.find((addr) => (addr._id || addr.id) === selectedAddress);
      
      const orderData = {
        shippingAddressId: selectedAddress,
        billingAddressId: selectedAddress,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phoneNumber: shippingAddress.phoneNumber,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
        },
        paymentMethod: method, 
      };

      // Create order via API
      await orderService.createOrder(orderData);

      success('Order Placed!', `Your order has been placed successfully via ${method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}.`);
      await dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toastError('Order Failed', error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const [couponCode, setCouponCode] = useState('');
  const cartLoading = useSelector((state) => state.cart.loading);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      warning('Required', 'Please enter a coupon code.');
      return;
    }
    const result = await dispatch(applyCouponAsync(couponCode));
    if (applyCouponAsync.fulfilled.match(result)) {
      success('Coupon Applied', 'Your coupon has been applied successfully.');
      setCouponCode('');
    } else {
      toastError('Failed', result.payload || 'Failed to apply coupon.');
    }
  };

  const handleRemoveCoupon = async () => {
    const result = await dispatch(removeCouponAsync());
    if (removeCouponAsync.fulfilled.match(result)) {
      success('Coupon Removed', 'Your coupon has been removed.');
    } else {
      toastError('Failed', result.payload || 'Failed to remove coupon.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart to proceed with checkout</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span>Shipping Address</span>
                  </h2>
                  <Link
                    to="/addresses"
                    className="text-purple-600 hover:text-purple-700 transition text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {addressesLoading ? (
                    <AddressCardSkeleton />
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-4">No addresses found</p>
                      <Link
                        to="/addresses"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Add an address
                      </Link>
                    </div>
                  ) : (
                    addresses.map((address) => (
                    <div
                      key={address._id || address.id}
                      onClick={() => setSelectedAddress(address._id || address.id)}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedAddress === (address._id || address.id)
                          ? 'bg-purple-50/50 border-2 border-purple-600 shadow-md ring-4 ring-purple-600/10'
                          : 'bg-white border-2 border-gray-100 shadow-sm hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900 text-lg">
                              {address.fullName}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                             {address.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}<br />
                            {address.city}, {address.state} - {address.postalCode}
                          </p>
                        </div>
                        {selectedAddress === (address._id || address.id) && (
                          <div className="absolute top-4 right-4 bg-purple-600 p-1.5 rounded-full shadow-sm animate-in zoom-in duration-200">
                            <Check className="h-4 w-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product?.title}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600">Size: <span className="font-medium text-gray-900">{item.selectedSize}</span></p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <span>Payment Method</span>
                </h2>

                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod('mock')}
                    className={`relative flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'mock'
                        ? 'bg-purple-50/50 border-2 border-purple-600 shadow-md ring-4 ring-purple-600/10'
                        : 'bg-white border-2 border-gray-100 shadow-sm hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 ${paymentMethod === 'mock' ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                      {paymentMethod === 'mock' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">Credit/Debit Card (Mock)</div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          Secure online payment via FakeGateway
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${paymentMethod === 'mock' ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-400'}`}>
                        <CreditCard className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`relative flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'cod'
                        ? 'bg-purple-50/50 border-2 border-purple-600 shadow-md ring-4 ring-purple-600/10'
                        : 'bg-white border-2 border-gray-100 shadow-sm hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 ${paymentMethod === 'cod' ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">Cash on Delivery</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        Pay with cash when your order is delivered
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 sticky top-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium text-gray-900">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">FREE</span>
                      ) : (
                        `₹${calculateShipping()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span className="font-medium text-gray-900">₹{calculateTax().toLocaleString()}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{cartDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-200">
                    <div className="flex justify-between items-end">
                      <span className="font-semibold text-gray-900 text-lg">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-green-800">
                          Coupon Applied: {appliedCoupon.code}
                        </span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon} 
                        disabled={cartLoading}
                        className="text-green-600 hover:text-green-700 text-sm disabled:opacity-50"
                      >
                        {cartLoading ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button 
                        onClick={handleApplyCoupon} 
                        disabled={cartLoading || !couponCode.trim()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cartLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="bg-gray-50/80 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Secure checkout & encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="bg-purple-100 p-1.5 rounded-full text-purple-600">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Easy returns and refunds</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress}
                  className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold text-lg flex items-center justify-center space-x-2 ${
                    isProcessing || !selectedAddress
                      ? 'opacity-50 cursor-not-allowed saturate-50'
                      : 'hover:-translate-y-0.5'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MockPaymentModal 
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        amount={calculateTotal()}
        onSuccess={handleMockPaymentSuccess}
      />
    </div>
  );
};

export default CheckoutPage;
