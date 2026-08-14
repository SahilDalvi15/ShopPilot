import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Star, ArrowRight, Share2, Copy } from 'lucide-react';
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../store/slices/wishlistSlice';
import { addToCart as addToCartAction } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import WishlistItemSkeleton from '../components/skeletons/WishlistItemSkeleton';
import { wishlistService } from '../services/wishlist.service';

const WishlistPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const dispatch = useDispatch();
  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleShareWishlist = async () => {
    try {
      setIsSharing(true);
      const res = await wishlistService.generateShareToken();
      if (res.success && res.data.shareToken) {
        const link = `${window.location.origin}/shared-wishlist/${res.data.shareToken}`;
        setShareLink(link);
        await navigator.clipboard.writeText(link);
        success('Link Copied!', 'Share link copied to clipboard.');
      }
    } catch (err) {
      toastError('Failed', 'Could not generate share link.');
    } finally {
      setIsSharing(false);
    }
  };

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

  const handleRemoveFromWishlist = async (itemId) => {
    if (window.confirm('Remove this item from wishlist?')) {
      const result = await dispatch(removeFromWishlist(itemId));
      if (removeFromWishlist.fulfilled.match(result)) {
        success('Removed', 'Item removed from wishlist.');
        setSelectedItems(selectedItems.filter((id) => id !== itemId));
      } else if (removeFromWishlist.rejected.match(result)) {
        toastError('Failed', result.payload || 'Failed to remove item.');
      }
    }
  };

  const handleRemoveSelected = async () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      let successCount = 0;
      for (const itemId of selectedItems) {
        const result = await dispatch(removeFromWishlist(itemId));
        if (removeFromWishlist.fulfilled.match(result)) {
          successCount++;
        }
      }
      if (successCount > 0) {
        success('Removed', `${successCount} items removed from wishlist.`);
      }
      setSelectedItems([]);
    }
  };

  const handleMoveToCart = async (item) => {
    const result = await dispatch(addToCartAction({
      productId: item._id,
      quantity: 1,
      price: item.discountedPrice || item.price,
    }));
    if (addToCartAction.fulfilled.match(result)) {
      success('Added to Cart', `${item.title} has been added to your cart.`);
    } else if (addToCartAction.rejected.match(result)) {
      toastError('Failed', result.payload || 'Failed to add item to cart.');
    }
  };

  const handleMoveSelectedToCart = async () => {
    let successCount = 0;
    for (const itemId of selectedItems) {
      const item = wishlistItems.find((i) => i._id === itemId);
      if (item) {
        const result = await dispatch(addToCartAction({
          productId: item._id,
          quantity: 1,
          price: item.discountedPrice || item.price,
        }));
        if (addToCartAction.fulfilled.match(result)) {
          successCount++;
        }
      }
    }
    if (successCount > 0) {
      success('Added to Cart', `${successCount} items added to your cart.`);
    }
  };

  const calculateTotal = () => {
    return wishlistItems.reduce((total, item) => total + (item.discountedPrice || item.price), 0);
  };

  const calculateSavings = () => {
    return wishlistItems.reduce(
      (total, item) => total + (item.price - (item.discountedPrice || item.price)),
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
              <p className="text-gray-500 mt-2 font-medium">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <div className="flex items-center gap-3">
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleShareWishlist}
                  disabled={isSharing}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-full font-bold transition-all duration-200 shadow-sm"
                >
                  {isSharing ? (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  <span>Share Wishlist</span>
                </button>
              )}
              {selectedItems.length > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full font-bold transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove Selected ({selectedItems.length})</span>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <WishlistItemSkeleton />
              <WishlistItemSkeleton />
              <WishlistItemSkeleton />
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto mt-12 flex flex-col items-center">
              <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8 relative">
                <Heart className="h-16 w-16 text-pink-400 absolute" />
                <div className="w-4 h-4 bg-pink-300 rounded-full absolute top-4 right-4 animate-ping" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-8 text-lg">Save items you love to your wishlist to easily find them later and keep track of price drops.</p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-600 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 group"
              >
                <span>Discover Products</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Wishlist Items (Main Column) */}
              <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-4">
                {/* Header with Select All */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between sticky top-24 z-10">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedItems.length === wishlistItems.length ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-500'}`}>
                      {selectedItems.length === wishlistItems.length && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === wishlistItems.length}
                      onChange={handleSelectAll}
                      className="hidden"
                    />
                    <span className="text-sm font-bold text-gray-700 select-none">Select All Items</span>
                  </label>
                  
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleMoveSelectedToCart}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 active:scale-95 text-sm font-bold"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add Selected to Cart</span>
                    </button>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Checkbox */}
                      <div className="hidden sm:block">
                        <label className="flex items-center cursor-pointer">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedItems.includes(item._id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                            {selectedItems.includes(item._id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                          />
                        </label>
                      </div>

                      {/* Product Image */}
                      <Link to={`/products/${item.slug}`} className="relative w-full sm:w-32 aspect-square shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Mobile Checkbox Absolute */}
                        <div className="absolute top-3 left-3 sm:hidden">
                          <label className="flex items-center cursor-pointer bg-white/90 backdrop-blur rounded p-1 shadow-sm">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedItems.includes(item._id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                              {selectedItems.includes(item._id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleSelectItem(item._id)}
                            />
                          </label>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {item.brand}
                          </span>
                        </div>
                        
                        <Link to={`/products/${item.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                            {item.title}
                          </h3>
                        </Link>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2 mt-3">
                          <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-sm font-bold text-yellow-700 ml-1.5">{item.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({item.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end space-x-3 mt-4">
                          <span className="text-2xl font-black text-gray-900 tracking-tight">
                            ₹{(item.discountedPrice || item.price).toLocaleString()}
                          </span>
                          {item.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-400 line-through mb-1">
                                ₹{item.price.toLocaleString()}
                              </span>
                              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md mb-1">
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="mt-3">
                          {item.stock > 0 ? (
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex w-max items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full flex w-max items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-3 sm:w-48 shrink-0 w-full sm:border-l sm:border-gray-100 sm:pl-6">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={item.stock === 0}
                          className={`w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                            item.stock > 0
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="w-full flex items-center justify-center space-x-2 px-5 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card (Right Sidebar) */}
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 p-6 sticky top-24">
                  <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Wishlist Summary</h3>
                  
                  <div className="space-y-4 mb-6 text-sm font-medium">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Items</span>
                      <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full">{wishlistItems.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Value</span>
                      <span className="text-gray-900 font-bold">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                      <span className="text-green-700">Your Savings</span>
                      <span className="text-green-700 font-bold">₹{calculateSavings().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total</span>
                      <span className="text-3xl font-black text-gray-900 tracking-tight">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    
                    <Link
                      to="/products"
                      className="block w-full bg-gray-900 text-white text-center py-4 rounded-full font-bold hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
