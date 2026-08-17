import { useSelector, useDispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCompareItems, removeFromCompare, clearCompare } from '../store/slices/compareSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Trash2, ShoppingCart, Star, Check, X, ArrowRightLeft } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const ComparePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  
  const compareItems = useSelector(selectCompareItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { formatPrice } = useCurrency();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toastError('Authentication Required', 'Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      success('Added to Cart', `${product.title} was successfully added to your cart.`);
    } catch (err) {
      toastError('Error', err || 'Failed to add item to cart.');
    }
  };

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ArrowRightLeft className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Compare Products</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          You haven't added any products to compare yet. Browse our catalog and select up to 3 products to see them side-by-side.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Extract all unique specification keys across all products
  const allSpecKeys = Array.from(new Set(
    compareItems.reduce((acc, item) => {
      if (item.specifications) {
        return [...acc, ...Object.keys(item.specifications)];
      }
      return acc;
    }, [])
  ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Compare Products</h1>
            <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
              {compareItems.length} items
            </span>
          </div>
          <button
            onClick={() => dispatch(clearCompare())}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Comparison Matrix */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-x-auto hide-scrollbar relative">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr>
                <th className="w-48 sticky left-0 z-20 bg-gray-50 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 p-6 shadow-[1px_0_0_0_#e5e7eb]">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Features</div>
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className="w-1/3 border-b border-l border-gray-200 dark:border-slate-700 p-6 align-top bg-white dark:bg-slate-800 relative group">
                    <button
                      onClick={() => dispatch(removeFromCompare(item.id))}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from compare"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex justify-center mb-6 h-48">
                      <img 
                        src={item.images?.[0] || 'https://via.placeholder.com/400'} 
                        alt={item.title} 
                        className="h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2 min-h-[56px] leading-tight">
                      {item.title}
                    </h3>
                    
                    <div className="mb-4">
                      {item.discount > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{formatPrice(item.discountedPrice)}</span>
                          <span className="text-sm text-gray-400 line-through font-medium">{formatPrice(item.price)}</span>
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            -{item.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">{formatPrice(item.price)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed group/btn"
                    >
                      {item.stock === 0 ? 'Out of Stock' : (
                        <>
                          <ShoppingCart className="w-5 h-5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </th>
                ))}
                
                {/* Empty columns to keep layout consistent if less than 3 items */}
                {[...Array(3 - compareItems.length)].map((_, i) => (
                  <th key={`empty-${i}`} className="w-1/3 border-b border-l border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50">
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center opacity-50">
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-gray-400 text-3xl font-light">+</span>
                      </div>
                      <p className="text-sm font-medium text-gray-500">Add a product<br/>to compare</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Brand */}
              <tr className="hover:bg-gray-50 dark:bg-slate-900 transition-colors group">
                <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 p-6 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-gray-100/90">
                  <span className="font-bold text-gray-700 dark:text-slate-300">Brand</span>
                </td>
                {compareItems.map(item => (
                  <td key={item.id} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 align-middle font-medium text-gray-900 dark:text-slate-100">
                    {item.brand?.name || 'Generic'}
                  </td>
                ))}
                {[...Array(3 - compareItems.length)].map((_, i) => (
                  <td key={`empty-brand-${i}`} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50"></td>
                ))}
              </tr>
              
              {/* Rating */}
              <tr className="hover:bg-gray-50 dark:bg-slate-900 transition-colors group">
                <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 p-6 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-gray-100/90">
                  <span className="font-bold text-gray-700 dark:text-slate-300">Rating</span>
                </td>
                {compareItems.map(item => (
                  <td key={item.id} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold text-gray-900 dark:text-slate-100 ml-1">{item.rating || 0}</span>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">({item.reviewCount || 0} reviews)</span>
                    </div>
                  </td>
                ))}
                {[...Array(3 - compareItems.length)].map((_, i) => (
                  <td key={`empty-rating-${i}`} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50"></td>
                ))}
              </tr>
              
              {/* Stock Status */}
              <tr className="hover:bg-gray-50 dark:bg-slate-900 transition-colors group">
                <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 p-6 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-gray-100/90">
                  <span className="font-bold text-gray-700 dark:text-slate-300">Availability</span>
                </td>
                {compareItems.map(item => (
                  <td key={item.id} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 align-middle">
                    {item.stock > 0 ? (
                      <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200/50">
                        <Check className="w-4 h-4" /> In Stock
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-bold border border-red-200/50">
                        <X className="w-4 h-4" /> Out of Stock
                      </div>
                    )}
                  </td>
                ))}
                {[...Array(3 - compareItems.length)].map((_, i) => (
                  <td key={`empty-stock-${i}`} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50"></td>
                ))}
              </tr>
              
              {/* Dynamic Specifications */}
              {allSpecKeys.map(specKey => (
                <tr key={specKey} className="hover:bg-gray-50 dark:bg-slate-900 transition-colors group">
                  <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-700 p-6 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-gray-100/90">
                    <span className="font-bold text-gray-700 dark:text-slate-300 capitalize">{specKey}</span>
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 align-middle text-gray-600 dark:text-slate-400 font-medium">
                      {item.specifications?.[specKey] || <span className="text-gray-300">-</span>}
                    </td>
                  ))}
                  {[...Array(3 - compareItems.length)].map((_, i) => (
                    <td key={`empty-spec-${specKey}-${i}`} className="border-b border-l border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
