import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateItemQuantity, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const totalDiscount = useSelector((state) => state.cart.totalDiscount);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);

  const [couponCode, setCouponCode] = useState('');

  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      dispatch(applyCoupon({ code: couponCode.toUpperCase(), discountAmount: 100 })); // Mock discount
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add items to get started</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <img
                  src={item.product?.images[0] || '/placeholder.jpg'}
                  alt={item.product?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product?.slug}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2"
                  >
                    {item.product?.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{item.product?.brand?.name}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{item.subtotal.toLocaleString()}
                      </p>
                      {item.discountedPrice && item.discountedPrice < item.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="self-start p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Apply
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-700">₹{appliedCoupon.discountAmount} off</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Link
                to="/checkout"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block w-full mt-3 text-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
