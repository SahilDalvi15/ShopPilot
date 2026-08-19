import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Info, CheckCircle2, PackagePlus, ArrowRight, Loader2 } from 'lucide-react';
import { productService } from '../services/product.service';
import { useCurrency } from '../contexts/CurrencyContext';
import { addToCart, applyCouponAsync } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';

const BUNDLE_TIERS = [
  { minItems: 2, discountPercent: 10, code: 'BUNDLE10' },
  { minItems: 3, discountPercent: 15, code: 'BUNDLE15' },
  { minItems: 4, discountPercent: 25, code: 'BUNDLE25' },
];

const BundleBuilderPage = () => {
  const { formatPrice } = useCurrency();
  const [bundleItems, setBundleItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  // Fetch some products to build bundles with (for example, we fetch top products)
  const { data, isLoading, error } = useQuery({
    queryKey: ['bundleProducts'],
    queryFn: () => productService.getProducts({ limit: 12 }),
  });

  const products = data?.data?.products || [];

  const handleAddItem = (product) => {
    setBundleItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId) => {
    setBundleItems((prev) => {
      const existing = prev.find((item) => item.product._id === productId);
      if (existing.quantity > 1) {
        return prev.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.product._id !== productId);
    });
  };

  const totalItems = bundleItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = bundleItems.reduce((acc, item) => acc + (item.product.discountedPrice || item.product.price) * item.quantity, 0);

  const currentTier = useMemo(() => {
    return [...BUNDLE_TIERS].reverse().find(tier => totalItems >= tier.minItems) || { discountPercent: 0, code: null };
  }, [totalItems]);

  const nextTier = useMemo(() => {
    return BUNDLE_TIERS.find(tier => totalItems < tier.minItems);
  }, [totalItems]);

  const discountAmount = (subtotal * currentTier.discountPercent) / 100;
  const finalPrice = subtotal - discountAmount;
  
  // Progress bar logic
  let progressPercentage = 0;
  if (nextTier) {
    const prevMinItems = currentTier.discountPercent === 0 ? 0 : currentTier.minItems;
    const itemsInCurrentRange = totalItems - prevMinItems;
    const itemsNeededForRange = nextTier.minItems - prevMinItems;
    
    progressPercentage = (currentTier.discountPercent > 0 ? (currentTier.minItems / BUNDLE_TIERS[BUNDLE_TIERS.length - 1].minItems) * 100 : 0) +
                         (itemsInCurrentRange / itemsNeededForRange) * ((nextTier.minItems - prevMinItems) / BUNDLE_TIERS[BUNDLE_TIERS.length - 1].minItems) * 100;
  } else {
    progressPercentage = 100;
  }

  const handleAddBundleToCart = async () => {
    setIsAdding(true);
    try {
      // 1. Add all items to cart
      for (const item of bundleItems) {
        await dispatch(addToCart({ 
          productId: item.product._id, 
          quantity: item.quantity,
          selectedSize: item.product.sizes?.length > 0 ? item.product.sizes[0] : undefined
        })).unwrap();
      }

      // 2. Apply bundle coupon if applicable
      if (currentTier.code) {
        try {
          await dispatch(applyCouponAsync(currentTier.code)).unwrap();
          success('Bundle added!', `You unlocked ${currentTier.discountPercent}% off!`);
        } catch (couponErr) {
          console.error("Coupon error", couponErr);
          toastError('Notice', 'Failed to apply bundle discount automatically. You can enter it manually at checkout.');
        }
      } else {
        success('Items added!', 'Items have been added to your cart.');
      }

      // 3. Navigate to cart
      navigate('/cart');
    } catch (err) {
      toastError('Error', 'Failed to add bundle to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium text-lg bg-red-50 px-6 py-4 rounded-xl border border-red-100 shadow-sm">
          Failed to load products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-4">
            <PackagePlus className="w-4 h-4" />
            Build Your Own Bundle
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Mix, Match & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Save More</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your perfect routine. Add 2 items for 10% off, 3 items for 15% off, and 4+ items for 25% off!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Product Grid */}
          <div className="lg:w-2/3 xl:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const bundleItem = bundleItems.find(item => item.product._id === product._id);
                const quantity = bundleItem ? bundleItem.quantity : 0;
                
                return (
                  <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                    {/* Selected Overlay Indicator */}
                    {quantity > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        {quantity}
                      </div>
                    )}
                    
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 relative">
                      <img 
                        src={product.images[0] || '/placeholder.jpg'} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-indigo-600 font-medium mb-1 truncate">{product.brand?.name || 'ShopPilot'}</p>
                      <h3 className="font-semibold text-gray-900 leading-tight mb-1 truncate">{product.title}</h3>
                      <p className="font-bold text-gray-900">{formatPrice(product.discountedPrice || product.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3">
                      {quantity === 0 ? (
                        <button 
                          onClick={() => handleAddItem(product)}
                          className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add to Bundle
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between bg-gray-100 rounded-xl p-1">
                          <button 
                            onClick={() => handleRemoveItem(product._id)}
                            className="w-10 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-indigo-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-gray-900">{quantity}</span>
                          <button 
                            onClick={() => handleAddItem(product)}
                            className="w-10 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-indigo-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="lg:w-1/3 xl:w-1/4 w-full sticky top-24">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/40 border border-indigo-50 overflow-hidden relative">
              {/* Decorative top gradient */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" />
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  Your Bundle
                </h2>

                {/* Progress Bar & Tier Info */}
                <div className="mb-6 bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">
                        {currentTier.discountPercent > 0 ? `${currentTier.discountPercent}% Off Unlocked!` : 'Build Your Bundle'}
                      </p>
                      {nextTier && (
                        <p className="text-xs text-indigo-600/80 font-medium mt-0.5">
                          Add {nextTier.minItems - totalItems} more for {nextTier.discountPercent}% off
                        </p>
                      )}
                      {!nextTier && (
                        <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Max discount reached
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* The Bar */}
                  <div className="h-2.5 w-full bg-indigo-100 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  
                  {/* Tier markers */}
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-indigo-400">
                    <span>0</span>
                    {BUNDLE_TIERS.map((tier) => (
                      <span key={tier.discountPercent} className={totalItems >= tier.minItems ? 'text-indigo-700' : ''}>
                        {tier.minItems} items
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selected Items List */}
                <div className="max-h-[30vh] overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                  {bundleItems.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Your bundle is empty</p>
                    </div>
                  ) : (
                    bundleItems.map((item) => (
                      <div key={item.product._id} className="flex gap-3 items-center">
                        <img 
                          src={item.product.images[0] || '/placeholder.jpg'} 
                          alt={item.product.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.product.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-bold text-gray-900 shrink-0">
                          {formatPrice((item.product.discountedPrice || item.product.price) * item.quantity)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Bundle Discount ({currentTier.discountPercent}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Bundle Total</span>
                    <span>{formatPrice(finalPrice)}</span>
                  </div>
                </div>

                {/* Add to Cart Action */}
                <button 
                  onClick={handleAddBundleToCart}
                  disabled={totalItems === 0 || isAdding}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {isAdding ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Adding to Cart...</>
                  ) : (
                    <>Add Bundle to Cart <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-100/80 p-3 rounded-lg">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
              <p>Discount is automatically applied as a coupon code when adding to cart. Cannot be combined with other codes.</p>
            </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};

export default BundleBuilderPage;
