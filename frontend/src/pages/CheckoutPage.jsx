import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Shield, ArrowRight, Plus, Check } from 'lucide-react';
import { fetchAddresses } from '../store/slices/addressSlice';
import { createPaymentOrder, verifyPayment } from '../store/slices/paymentSlice';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartDiscount = useSelector((state) => state.cart.totalDiscount);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);
  const { addresses } = useSelector((state) => state.address);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    // Set default address as selected
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
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
      alert('Please select a shipping address');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        shippingAddress: addresses.find((addr) => addr._id === selectedAddress),
        paymentMethod,
        items: cartItems,
        subtotal: calculateSubtotal(),
        discount: cartDiscount,
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal(),
        coupon: appliedCoupon,
      };

      if (paymentMethod === 'razorpay') {
        const result = await dispatch(createPaymentOrder({
          amount: calculateTotal(),
          currency: 'INR',
        }));

        if (createPaymentOrder.fulfilled.match(result)) {
          const { orderId, keyId, amount } = result.payload;

          const options = {
            key: keyId,
            amount: amount * 100,
            currency: 'INR',
            name: 'ShopPilot',
            description: 'Order Payment',
            order_id: orderId,
            handler: async function (response) {
              const verifyResult = await dispatch(verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }));

              if (verifyPayment.fulfilled.match(verifyResult)) {
                await dispatch(clearCart());
                navigate('/orders');
              } else {
                alert('Payment verification failed');
              }
            },
            prefill: {
              name: addresses[0]?.fullName,
              email: '',
              contact: addresses[0]?.phoneNumber,
            },
            theme: {
              color: '#9333ea',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } else {
        // Cash on delivery - create order directly
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
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
              <div className="bg-white rounded-lg shadow-md p-6">
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
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddress === address._id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {address.fullName}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-700">
                            {address.city}, {address.state} - {address.postalCode}
                          </p>
                        </div>
                        {selectedAddress === address._id && (
                          <div className="bg-purple-600 p-2 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span>Payment Method</span>
                </h2>

                <div className="space-y-4">
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'razorpay'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Razorpay</div>
                      <div className="text-sm text-gray-600">
                        Pay securely with credit/debit cards, UPI, or net banking
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        VISA
                      </div>
                      <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        MasterCard
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">
                        Pay with cash when your order is delivered
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${calculateShipping()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{calculateTax().toLocaleString()}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{cartDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-semibold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-green-800">
                          Coupon Applied: {appliedCoupon}
                        </span>
                      </div>
                      <button className="text-green-600 hover:text-green-700 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-purple-600" />
                    <span>Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Secure payment with Razorpay</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>Easy returns and refunds</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress}
                  className={`w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center space-x-2 ${
                    isProcessing || !selectedAddress
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
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
    </div>
  );
};

export default CheckoutPage;
