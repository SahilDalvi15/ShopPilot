import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCompare, selectCompareItems } from '../store/slices/compareSlice';
import { useToast } from '../contexts/ToastContext';
import { Search, Grid, List, Heart, ShoppingCart, Star, SlidersHorizontal, X, ArrowRightLeft } from 'lucide-react';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error: toastError } = useToast();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const compareItems = useSelector(selectCompareItems);
  
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
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') === 'true',
    sortBy: location.pathname === '/new-arrivals' ? 'createdAt' : 'createdAt',
    sortOrder: 'desc',
    isDeal: location.pathname === '/deals' ? 'true' : undefined
  });
  
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (filters.search.length >= 2) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true);
        try {
          const res = await productService.getSearchSuggestions(filters.search);
          setSuggestions(res.data?.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to get suggestions', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.search]);

  // Sync state when URL params or path changes
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      category: searchParams.get('category') || '', 
      brand: searchParams.get('brand') || '', 
      search: searchParams.get('search') || '',
      minRating: searchParams.get('minRating') || '',
      inStock: searchParams.get('inStock') === 'true',
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

  const handleCheckboxChange = (key, value) => {
    setFilters(prev => {
      const currentValues = prev[key] ? prev[key].split(',') : [];
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
      const newValueStr = newValues.join(',');
      const newParams = new URLSearchParams(searchParams);
      if (newValueStr === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, newValueStr);
      }
      setSearchParams(newParams);
      return { ...prev, [key]: newValueStr };
    });
  };

  const handleFilterChange = (key, value) => {
    // Sync with URL params first
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);

    // Update local state
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ ...filters, search: '', minPrice: '', maxPrice: '', category: '', brand: '', minRating: '', inStock: false });
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

  const handleToggleCompare = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      dispatch(addToCompare(product));
      success('Added to Compare', `${product.title} added to comparison.`);
    } catch (err) {
      toastError('Limit Reached', err.message);
    }
  };

  const renderFilters = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Categories</h3>
        <div className="space-y-3">
          {categoriesData?.data?.map((cat) => {
            const isChecked = filters.category.split(',').includes(cat.id || cat._id);
            return (
              <label key={cat.id || cat._id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-slate-600 group-hover:border-indigo-500'}`}>
                  {isChecked && <div className="w-3 h-3 bg-white dark:bg-slate-800 rounded-sm text-white flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>}
                </div>
                <input 
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange('category', cat.id || cat._id)}
                />
                <span className={`text-sm ${isChecked ? 'font-medium text-gray-900 dark:text-slate-100' : 'text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:text-slate-100'}`}>
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Brands</h3>
        <div className="flex flex-wrap gap-2">
          {brandsData?.data?.map((brand) => {
            const isChecked = filters.brand.split(',').includes(brand.id || brand._id);
            return (
              <button
                key={brand.id || brand._id}
                onClick={() => handleCheckboxChange('brand', brand.id || brand._id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isChecked
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Price Range</h3>
        <div className="px-2 pt-2">
          <Slider
            range
            min={0}
            max={100000}
            step={100}
            value={[filters.minPrice ? parseInt(filters.minPrice) : 0, filters.maxPrice ? parseInt(filters.maxPrice) : 100000]}
            onChange={(value) => {
              handleFilterChange('minPrice', value[0].toString());
              handleFilterChange('maxPrice', value[1].toString());
            }}
            trackStyle={{ backgroundColor: '#4f46e5', height: 6 }}
            railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
            handleStyle={[
              { borderColor: '#4f46e5', height: 20, width: 20, marginTop: -7, opacity: 1 },
              { borderColor: '#4f46e5', height: 20, width: 20, marginTop: -7, opacity: 1 }
            ]}
          />
          <div className="flex items-center justify-between mt-6 text-sm font-medium text-gray-600 dark:text-slate-400">
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">₹ {filters.minPrice || 0}</div>
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">₹ {filters.maxPrice || 100000}</div>
          </div>
        </div>
      </div>

      {/* Customer Ratings */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Customer Ratings</h3>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.minRating === String(rating) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-slate-600 group-hover:border-indigo-500'}`}>
                {filters.minRating === String(rating) && <div className="w-2.5 h-2.5 bg-white dark:bg-slate-800 rounded-sm" />}
              </div>
              <input 
                type="radio" 
                name="minRating"
                className="hidden"
                checked={filters.minRating === String(rating)}
                onChange={() => handleFilterChange('minRating', String(rating))}
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-600 dark:text-slate-400 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.inStock ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-slate-600 group-hover:border-indigo-500'}`}>
            {filters.inStock && <div className="w-2.5 h-2.5 bg-white dark:bg-slate-800 rounded-sm" />}
          </div>
          <input 
            type="checkbox" 
            className="hidden"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          />
          <span className={`text-sm ${filters.inStock ? 'font-medium text-gray-900 dark:text-slate-100' : 'text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:text-slate-100'}`}>
            In Stock Only
          </span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-4">Sort By</h3>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            handleFilterChange('sortBy', sortBy);
            handleFilterChange('sortOrder', sortOrder);
          }}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="soldCount-desc">Best Selling</option>
        </select>
      </div>

      <button
        onClick={() => {
          clearFilters();
          setIsMobileFiltersOpen(false);
        }}
        className="w-full py-3 text-sm font-bold text-gray-600 dark:text-slate-400 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <X className="w-4 h-4" /> Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900/50 pb-12">
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{getPageTitle()}</h1>
            <p className="text-gray-500 mt-1">Discover our collection of premium products</p>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 md:w-80 relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && filters.search.length >= 2 && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {suggestions.map((sug, idx) => (
                    <div 
                      key={idx}
                      onClick={() => navigate(`/products/${sug.slug}`)}
                      className="px-4 py-3 hover:bg-gray-50 dark:bg-slate-900 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                    >
                      {sug.image ? (
                        <img src={sug.image} alt={sug.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{sug.title}</div>
                        {sug.brand && <div className="text-xs text-gray-500">{sug.brand}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* View Mode Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:bg-slate-900'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:bg-slate-900'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-slate-700">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900 dark:text-slate-100 text-lg">Filters</h2>
              </div>
              {renderFilters()}
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
            
            {/* Drawer */}
            <div className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-gray-900 dark:text-slate-100 text-lg">Filters</h2>
                </div>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 dark:text-slate-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {renderFilters()}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Row */}
            {(filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.minRating || filters.inStock) && (
              <div className="flex items-center gap-2 flex-wrap mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <span className="text-sm font-bold text-gray-700 dark:text-slate-300 mr-2">Active Filters:</span>
                
                {filters.category && filters.category.split(',').map(catId => {
                  const cat = categoriesData?.data?.find(c => (c.id || c._id) === catId);
                  return cat ? (
                    <span key={catId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {cat.name}
                      <button onClick={() => handleCheckboxChange('category', catId)} className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ) : null;
                })}

                {filters.brand && filters.brand.split(',').map(brandId => {
                  const brand = brandsData?.data?.find(b => (b.id || b._id) === brandId);
                  return brand ? (
                    <span key={brandId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                      {brand.name}
                      <button onClick={() => handleCheckboxChange('brand', brandId)} className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ) : null;
                })}

                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                    ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '100k+'}
                    <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }} className="hover:bg-green-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {filters.minRating && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                    {filters.minRating}+ Stars
                    <button onClick={() => handleFilterChange('minRating', '')} className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {filters.inStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    In Stock
                    <button onClick={() => handleFilterChange('inStock', false)} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button onClick={clearFilters} className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors ml-auto underline">
                  Clear All
                </button>
              </div>
            )}
            
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-red-600 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <p className="font-medium">Error loading products: {error.message}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 group flex cursor-pointer ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'}`}
                    >
                      {/* Product Image Area */}
                      <div className={`relative bg-gray-50 dark:bg-slate-900 overflow-hidden ${viewMode === 'list' ? 'w-full sm:w-64 shrink-0' : 'w-full aspect-[4/3]'}`}>
                        <img
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.title}
                          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.discount > 0 && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-sm tracking-wide uppercase">
                              {product.discount}% OFF
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black shadow-sm tracking-wide uppercase">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className="absolute top-4 right-4 p-2.5 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:bg-slate-800 hover:scale-110 active:scale-95 transition-all z-10"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              wishlistItems?.some(item => item._id === product.id)
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </button>

                        {/* Compare Button */}
                        <button 
                          onClick={(e) => handleToggleCompare(e, product)}
                          className={`absolute top-16 right-4 p-2.5 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:bg-slate-800 hover:scale-110 active:scale-95 transition-all z-10 ${compareItems.some(item => item.id === product.id) ? 'text-indigo-600' : 'text-gray-400'}`}
                          title="Add to Compare"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Product Details Area */}
                      <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-800 relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {product.brand?.name || 'Brand'}
                          </span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1.5">{product.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 dark:text-slate-100 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                          {product.title}
                        </h3>
                        
                        {viewMode === 'list' && (
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between gap-4">
                          <div className="flex flex-col">
                            {product.discount > 0 ? (
                              <>
                                <span className="text-xs font-medium text-gray-400 line-through mb-0.5">
                                  ₹{(product.price || 0).toLocaleString()}
                                </span>
                                <span className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                                  ₹{(product.discountedPrice || 0).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                                ₹{(product.price || 0).toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.stock <= 0}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              product.stock > 0 
                                ? 'bg-gray-900 text-white hover:bg-indigo-600 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200 active:scale-95' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-5 h-5" />
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
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-indigo-600 hover:text-indigo-600 px-8 py-3.5 rounded-full font-bold shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
    </div>
  );
};

export default ProductsPage;
