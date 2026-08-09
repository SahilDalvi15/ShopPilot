import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { useToast } from '../contexts/ToastContext';
import { Search, Grid, List, Heart, ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error: toastError } = useToast();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/deals': return 'Deals & Offers';
      case '/new-arrivals': return 'New Arrivals';
      default: return 'All Products';
    }
  };

  const [filters, setFilters] = useState({
    limit: 12,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: location.pathname === '/new-arrivals' ? 'createdAt' : 'createdAt',
    sortOrder: 'desc',
    isDeal: location.pathname === '/deals' ? 'true' : undefined
  });
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state when URL params or path changes
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      category: searchParams.get('category') || '', 
      brand: searchParams.get('brand') || '', 
      search: searchParams.get('search') || '',
      isDeal: location.pathname === '/deals' ? 'true' : undefined,
      sortBy: location.pathname === '/new-arrivals' ? 'createdAt' : prev.sortBy
    }));
  }, [location.pathname, searchParams]);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products', filters, location.pathname],
    queryFn: ({ pageParam = 1 }) => productService.getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const products = data?.pages?.flatMap(page => page.data) || [];

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getBrands(),
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ ...filters, search: '', minPrice: '', maxPrice: '', category: '', brand: '' });
    setSearchParams({}); // Clear URL params
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toastError('Authentication Required', 'Please login to add items to your wishlist.');
      navigate('/login');
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Area */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-xl w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
              
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Top Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categoriesData?.data?.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Brands</option>
                  {brandsData?.data?.map((brand) => (
                    <option key={brand.id || brand._id} value={brand.id || brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="soldCount-desc">Best Selling</option>
                </select>
              </div>
              
              <div className="md:col-span-4 flex justify-end mt-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Grid - Now takes full width */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 text-center">
              Error loading products: {error.message}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex cursor-pointer ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full'}`}>
                      <img
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.title}
                        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${viewMode === 'list' ? 'h-full' : 'h-56'}`}
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
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                          {product.brand?.name || 'Brand'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      {viewMode === 'list' && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex items-center text-yellow-400 bg-yellow-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold text-yellow-700 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-end justify-between mb-4">
                          <div>
                            {product.discount > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 line-through mb-0.5">
                                  ₹{(product.price || 0).toLocaleString()}
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  ₹{(product.discountedPrice || 0).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-gray-900">
                                ₹{(product.price || 0).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock <= 0}
                          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-full font-semibold shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
