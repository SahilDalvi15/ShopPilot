import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const ProductRecommendations = ({ currentProductId }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['product-recommendations', currentProductId],
    queryFn: () => productService.getProductRecommendations(currentProductId),
    enabled: !!currentProductId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const items = response?.data || [];
  
  // Filter out the current product just in case the backend returns it
  const displayItems = items.filter(item => item.id !== currentProductId);

  if (isLoading) {
    return (
      <div className="py-12 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-8"></div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-48 sm:w-56 h-72 shrink-0 bg-gray-100 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !displayItems || displayItems.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">You Might Also Like</h2>
              <p className="text-sm text-gray-500 font-medium">Frequently bought together and similar products</p>
            </div>
          </div>
          
          {/* Scroll Buttons - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {displayItems.map((product) => (
              <div 
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="w-48 sm:w-56 shrink-0 snap-start bg-white dark:bg-slate-900 rounded-2xl p-3 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-100 dark:hover:border-purple-900 transition-all cursor-pointer flex flex-col group/card"
              >
                {/* Image */}
                <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden mb-4 relative">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/200'} 
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover/card:scale-110"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex flex-col flex-1 px-1">
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm line-clamp-2 leading-tight mb-2 group-hover/card:text-purple-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="font-black text-gray-900 dark:text-slate-100">
                      ₹{product.discountedPrice || product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through font-medium">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient Edges to indicate scrollability */}
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white/90 dark:from-slate-800/90 to-transparent pointer-events-none sm:hidden"></div>
        </div>

      </div>
    </div>
  );
};

export default ProductRecommendations;
