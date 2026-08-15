import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ currentProductId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { data, isLoading } = useQuery({
    queryKey: ['related-products', currentProductId],
    queryFn: () => productService.getProductRecommendations(currentProductId),
    enabled: !!currentProductId
  });

  const products = data?.data || [];

  if (isLoading || products.length === 0) return null;

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toastError('Authentication Required', 'Please login to add items to your cart.');
      return;
    }
    
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      success('Added to Cart', `${product.title} added to your cart.`);
    } catch (err) {
      toastError('Error', err || 'Failed to add item to cart.');
    }
  };

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toastError('Authentication Required', 'Please login to add items to your wishlist.');
      return;
    }

    const isInWishlist = wishlistItems?.some(item => item._id === product.id);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        success('Removed from Wishlist', `${product.title} removed from your wishlist.`);
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        success('Added to Wishlist', `${product.title} added to your wishlist.`);
      }
    } catch (err) {
      toastError('Error', err || 'Failed to update wishlist.');
    }
  };

  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together & Similar Items</h2>
      <div className="flex overflow-x-auto pb-6 gap-6 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.map((product) => (
          <div 
            key={product.id} 
            onClick={() => navigate(`/products/${product.slug}`)}
            className="snap-start min-w-[280px] w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all flex flex-col"
          >
            <div className="relative w-full h-48 bg-gray-50">
              <img 
                src={product.images[0] || '/placeholder.jpg'} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={(e) => handleToggleWishlist(e, product)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    wishlistItems?.some(item => item._id === product.id)
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400'
                  }`} 
                />
              </button>
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <div className="mb-2">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  {product.brand?.name || 'Brand'}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {product.title}
              </h3>
              
              <div className="flex items-center gap-1 mb-4">
                <div className="flex items-center text-yellow-400 bg-yellow-50 px-1.5 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-yellow-700 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              </div>

              <div className="mt-auto">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    {product.discount > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through mb-0.5">
                          ₹{(product.price || 0).toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{(product.discountedPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₹{(product.price || 0).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock <= 0}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
