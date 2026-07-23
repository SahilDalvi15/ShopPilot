import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Star, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock wishlist items - will be replaced with API call
  const [wishlistItems, setWishlistItems] = useState([
    {
      _id: '1',
      title: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      brand: 'Sony',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      price: 12999,
      discount: 15,
      discountedPrice: 11049,
      rating: 4.5,
      reviewCount: 234,
      stock: 15,
      addedAt: '2024-01-15',
    },
    {
      _id: '2',
      title: 'Smart Watch Series 5',
      slug: 'smart-watch-series-5',
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      price: 32999,
      discount: 10,
      discountedPrice: 29699,
      rating: 4.8,
      reviewCount: 567,
      stock: 8,
      addedAt: '2024-01-10',
    },
    {
      _id: '3',
      title: 'Mechanical Keyboard RGB',
      slug: 'mechanical-keyboard-rgb',
      brand: 'Logitech',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=400'],
      price: 8999,
      discount: 20,
      discountedPrice: 7199,
      rating: 4.3,
      reviewCount: 189,
      stock: 25,
      addedAt: '2024-01-05',
    },
  ]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(wishlistItems.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRemoveFromWishlist = (itemId) => {
    if (window.confirm('Remove this item from wishlist?')) {
      setWishlistItems(wishlistItems.filter((item) => item._id !== itemId));
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleRemoveSelected = () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      setWishlistItems(
        wishlistItems.filter((item) => !selectedItems.includes(item._id))
      );
      setSelectedItems([]);
    }
  };

  const handleMoveToCart = (item) => {
    // TODO: Add to cart API call
    alert(`${item.title} added to cart!`);
  };

  const handleMoveSelectedToCart = () => {
    // TODO: Add multiple items to cart API call
    alert(`${selectedItems.length} items added to cart!`);
  };

  const calculateTotal = () => {
    return wishlistItems.reduce((total, item) => total + item.discountedPrice, 0);
  };

  const calculateSavings = () => {
    return wishlistItems.reduce(
      (total, item) => total + (item.price - item.discountedPrice),
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={handleRemoveSelected}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
              >
                <Trash2 className="h-5 w-5" />
                <span>Remove Selected ({selectedItems.length})</span>
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                <span>Start Shopping</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                {/* Header with Select All */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === wishlistItems.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                  </label>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleMoveSelectedToCart}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add Selected to Cart</span>
                    </button>
                  )}
                </div>

                {/* Items List */}
                <div className="divide-y">
                  {wishlistItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 flex items-start space-x-4 hover:bg-gray-50 transition"
                    >
                      {/* Checkbox */}
                      <div className="pt-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => handleSelectItem(item._id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                        />
                      </div>

                      {/* Product Image */}
                      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.brand}</p>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(item.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({item.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{item.discountedPrice.toLocaleString()}
                          </span>
                          {item.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="mt-2">
                          {item.stock > 0 ? (
                            <span className="text-sm text-green-600">
                              In Stock ({item.stock} available)
                            </span>
                          ) : (
                            <span className="text-sm text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={item.stock === 0}
                          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition ${
                            item.stock > 0
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span>{wishlistItems.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Value</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Your Savings</span>
                    <span>₹{calculateSavings().toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="mt-6 block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
