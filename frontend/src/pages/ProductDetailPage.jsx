import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/productService';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronDown, ChevronUp, Share2, AlertCircle, X, ArrowRightLeft } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCompare, selectCompareItems } from '../store/slices/compareSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import ProductRecommendations from '../components/ProductRecommendations';
import SizeGuideModal from '../components/SizeGuideModal';
import { fetchProductReviews, createReview, markReviewHelpful } from '../store/slices/reviewSlice';
import { addRecentlyViewed } from '../store/slices/recentSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector(selectCompareItems);
  const { formatPrice } = useCurrency();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  });

  const product = data?.data;
  const isFashion = product?.category?.slug === 'fashion' || product?.category?.slug === 'sports-fitness';
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const { reviews, loading: reviewsLoading, submitting } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductReviews(product.id));
      dispatch(addRecentlyViewed({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        discount: product.discount,
        images: product.images,
        slug: product.slug,
        rating: product.rating
      }));
      window.scrollTo(0, 0); // Scroll to top when product changes
    }
  }, [dispatch, product?.id, product]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await dispatch(createReview(reviewData)).unwrap();
      success('Review submitted successfully!');
    } catch (err) {
      toastError(err || 'Failed to submit review');
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await dispatch(markReviewHelpful(reviewId)).unwrap();
      success('Thanks for your feedback!');
    } catch (err) {
      toastError(err || 'Failed to mark review as helpful');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toastError('Authentication Required', 'Please login to add items to your cart.');
      return;
    }
    
    if (isFashion && !selectedSize) {
      toastError('Size Required', 'Please select a size before adding to cart.');
      return;
    }
    
    try {
      await dispatch(addToCart({ productId: product.id, quantity, selectedSize })).unwrap();
      success('Added to Cart', `${product.title} was successfully added to your cart.`);
    } catch (err) {
      toastError('Error', err || 'Failed to add item to cart.');
    }
  };

  const handleToggleWishlist = async () => {
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

  const handleToggleCompare = () => {
    try {
      dispatch(addToCompare(product));
      success('Added to Compare', `${product.title} added to comparison.`);
    } catch (err) {
      toastError('Limit Reached', err.message);
    }
  };

  const scrollToReviews = () => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold">Error loading product</h2>
          <p>{error?.message || 'Product not found'}</p>
          <Link to="/" className="text-indigo-600 font-medium hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const specsEntries = hasSpecs ? Object.entries(product.specifications) : [];
  const visibleSpecs = expandedSpecs ? specsEntries : specsEntries.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>›</span>
            <Link to={`/products?category=${product.category?._id || product.categoryId}`} className="hover:text-indigo-600 transition">
              {product.category?.name || 'Category'}
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-slate-100 truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* HERO SECTION: Images & Buy Box */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          
          {/* Left Column: Images (approx 55%) */}
          <div className="lg:w-[55%] flex flex-col-reverse md:flex-row gap-4 h-max sticky top-24">
            {/* Vertical Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-20 md:h-[500px] shrink-0">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSelectedImage(index)}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-indigo-600 shadow-md scale-95' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden relative group h-[400px] md:h-[500px] flex items-center justify-center">
              <img
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.title}
                className="max-w-full max-h-full object-contain cursor-crosshair group-hover:scale-125 transition-transform duration-500 ease-in-out origin-center"
              />
              <button 
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md hover:bg-white dark:bg-slate-800 transition-all z-10"
              >
                <Heart 
                  className={`w-6 h-6 ${wishlistItems?.some(item => item._id === product.id) ? 'text-red-500 fill-current' : 'text-gray-500 hover:text-red-500'}`} 
                />
              </button>
              <button 
                onClick={handleToggleCompare}
                className={`absolute top-20 right-4 p-3 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md hover:bg-white dark:bg-slate-800 transition-all z-10 ${compareItems.some(item => item.id === product.id) ? 'text-indigo-600' : 'text-gray-500'}`}
                title="Add to Compare"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              <button className="absolute top-4 right-20 p-3 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md hover:bg-white dark:bg-slate-800 transition-all z-10">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Right Column: Details & Buy Box (approx 45%) */}
          <div className="lg:w-[45%] flex flex-col">
            <Link to={`/products?brand=${product.brand?._id || product.brandId}`} className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-2 hover:underline inline-block w-max">
              Visit the {product.brand?.name || 'Brand'} Store
            </Link>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-slate-100 leading-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button onClick={scrollToReviews} className="flex items-center gap-1 hover:opacity-80 transition group">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= product.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-indigo-600 group-hover:underline">
                  {product.rating} ({product.reviewCount} ratings)
                </span>
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400 bg-gray-100 px-3 py-1 rounded-full">
                {product.soldCount} bought in past month
              </span>
            </div>

            <hr className="border-gray-200 dark:border-slate-700 mb-6" />

            {/* Price & Offers */}
            <div className="mb-6">
              {product.discount > 0 && (
                <div className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm font-bold mb-3 shadow-sm animate-pulse">
                  Freedom Sale Deal - {product.discount}% OFF
                </div>
              )}
              
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-slate-100 leading-none">
                  {formatPrice(product.discountedPrice || product.price)}
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-gray-500 line-through mb-1">
                    M.R.P: {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              <p className="text-sm text-gray-700 dark:text-slate-300 mt-2 font-medium">
                <span className="font-bold">EMI</span> starts at {formatPrice(product.discountedPrice / 12)}. No Cost EMI available.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-5 h-5 text-green-700" />
                <span className="font-semibold text-green-800">FREE scheduled delivery</span>
              </div>
              <p className="text-sm text-green-700 ml-7">
                Available as soon as <span className="font-bold">Tomorrow, 8 AM - 12 PM</span>.
              </p>
            </div>

            {/* Size Selector for Fashion */}
            {isFashion && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-slate-100">Select Size</h3>
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1"
                  >
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg font-bold border-2 transition-all flex items-center justify-center ${
                        selectedSize === size 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:bg-slate-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Specs Snippet */}
            {hasSpecs && (
              <div className="mb-8 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {specsEntries.slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 font-medium capitalize">{key}</span>
                    <span className="text-gray-900 dark:text-slate-100 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Buy Box Container */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </h3>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-4">
                <div className="flex items-center justify-between border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2 bg-gray-50 dark:bg-slate-900 sm:w-1/3">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-1 hover:text-indigo-600 disabled:opacity-30">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="p-1 hover:text-indigo-600 disabled:opacity-30">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:text-slate-100 py-3 px-6 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              <button
                onClick={handleAddToCart} // Mocking buy now
                disabled={product.stock === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mb-4"
              >
                Buy Now
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-slate-700">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure transaction</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-4 h-4" /> 7-day Replacement</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS / CAROUSEL SECTION */}
        <RelatedProducts categoryId={product.category?._id || product.categoryId} currentProductId={product.id} />

        {/* DETAILED PRODUCT INFORMATION & TABS */}
        <div className="py-12 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: From the Brand */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">From the Brand</h2>
              <div className="bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-90 z-0"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-1000 z-0"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-extrabold mb-4 tracking-tight uppercase">{product.brand?.name || 'Premium Brand'}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Experience unmatched quality and innovation. Designed for those who demand the best in everyday life.
                  </p>
                  <Link to={`/products?brand=${product.brand?._id || product.brandId}`} className="inline-block border-2 border-white px-6 py-2 rounded-full font-bold hover:bg-white dark:bg-slate-800 hover:text-gray-900 dark:text-slate-100 transition-colors">
                    Explore Store
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Technical Details & Description */}
            <div className="lg:w-2/3">
              <div className="border-b border-gray-200 dark:border-slate-700 mb-6 flex gap-8">
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`pb-4 text-lg font-bold border-b-4 transition-colors ${activeTab === 'specs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-slate-200'}`}
                >
                  Technical Details
                </button>
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`pb-4 text-lg font-bold border-b-4 transition-colors ${activeTab === 'desc' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-slate-200'}`}
                >
                  About this item
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  {hasSpecs ? (
                    <table className="w-full text-left text-sm text-gray-700 dark:text-slate-300">
                      <tbody>
                        {visibleSpecs.map(([key, value], index) => (
                          <tr key={key} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-800'}>
                            <th className="py-4 px-6 font-semibold text-gray-900 dark:text-slate-100 capitalize w-1/3 border-r border-gray-200 dark:border-slate-700">{key}</th>
                            <td className="py-4 px-6">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No technical specifications available for this product.</div>
                  )}
                  {hasSpecs && specsEntries.length > 4 && (
                    <button 
                      onClick={() => setExpandedSpecs(!expandedSpecs)}
                      className="w-full py-4 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 border-t border-gray-200 dark:border-slate-700"
                    >
                      {expandedSpecs ? (
                        <><ChevronUp className="w-4 h-4" /> Show Less</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> See all {specsEntries.length} specifications</>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none text-gray-600 dark:text-slate-400 leading-relaxed bg-gray-50 dark:bg-slate-900 p-6 rounded-xl">
                  <p className="whitespace-pre-line text-base">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <div id="reviews-section" className="py-12 border-t border-gray-200 dark:border-slate-700 scroll-mt-24">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Reviews Summary & Form */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Customer Reviews</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-8 h-8 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-slate-100">{product.rating.toFixed(1)} out of 5</div>
              </div>
              <p className="text-gray-500 mb-8">{product.reviewCount} global ratings</p>

              <hr className="border-gray-200 dark:border-slate-700 mb-8" />
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Review this product</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6 text-sm">Share your thoughts with other customers</p>
              
              {!isAuthenticated ? (
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center">
                  <p className="text-gray-600 dark:text-slate-400 mb-4 font-medium">Please sign in to write a review.</p>
                  <Link to="/login" className="inline-block bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 px-6 py-2 rounded-lg font-bold hover:bg-gray-50 dark:bg-slate-900 transition">
                    Sign in to Review
                  </Link>
                </div>
              ) : (
                <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} loading={submitting} />
              )}
            </div>
            
            {/* Review List */}
            <div className="lg:w-2/3">
              {reviewsLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
              ) : (
                <ReviewList 
                  reviews={reviews || product.reviews || []} 
                  loading={reviewsLoading}
                  onHelpful={handleHelpful}
                />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedProducts currentProductId={product.id} />
      </div>

      {/* Size Chart Modal */}
      <SizeGuideModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
      
      {/* AI Recommendations */}
      <ProductRecommendations currentProductId={product.id} />
      
      {/* Recently Viewed Carousel */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
};

export default ProductDetailPage;
