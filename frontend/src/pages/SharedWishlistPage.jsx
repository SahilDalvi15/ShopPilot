import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, AlertCircle, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import WishlistItemSkeleton from '../components/skeletons/WishlistItemSkeleton';
import { wishlistService } from '../services/wishlist.service';

const SharedWishlistPage = () => {
  const { token } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        setLoading(true);
        const res = await wishlistService.getSharedWishlist(token);
        if (res.success) {
          setWishlist(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shared wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedWishlist();
  }, [token]);

  const handleAddToCart = async (item) => {
    const result = await dispatch(addToCartAction({
      productId: item.productId,
      quantity: 1,
      price: item.product.discountedPrice || item.product.price,
    }));
    if (addToCartAction.fulfilled.match(result)) {
      success('Added to Cart', `${item.product.title} has been added to your cart.`);
    } else if (addToCartAction.rejected.match(result)) {
      toastError('Failed', result.payload || 'Failed to add item to cart.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="space-y-4">
            <WishlistItemSkeleton />
            <WishlistItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50/50">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Wishlist Not Found</h2>
          <p className="text-gray-500 mb-8 font-medium">{error || 'This link may be invalid or has expired.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-600 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
              <Heart className="w-10 h-10 text-indigo-500 fill-indigo-100" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {wishlist.ownerName}&apos;s Wishlist
            </h1>
            <p className="text-gray-500 text-lg font-medium">
              Check out these {wishlist.items.length} amazing items they have saved!
            </p>
          </div>

          {/* Items Grid */}
          <div className="space-y-6">
            {wishlist.items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <Link to={`/products/${item.product.slug}`} className="relative w-full sm:w-40 aspect-square shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0 py-2">
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight mb-3">
                      {item.product.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold text-yellow-700 ml-1.5">
                        {item.product.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end space-x-3">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                      ₹{(item.product.discountedPrice || item.product.price).toLocaleString()}
                    </span>
                    {item.product.discount > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through mb-1">
                          ₹{item.product.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md mb-1">
                          {item.product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3 sm:w-48 shrink-0 w-full sm:border-l sm:border-gray-100 sm:pl-6 py-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.stock === 0}
                    className={`w-full flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                      item.product.stock > 0
                        ? 'bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy This Item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {wishlist.items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500 font-medium">This wishlist is currently empty.</p>
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want your own wishlist?</h3>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 transition-all duration-300"
            >
              <span>Create an Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedWishlistPage;
