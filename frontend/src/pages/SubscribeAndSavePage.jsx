import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, ShoppingBag, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { productService } from '../services/product.service';
import { addToCart } from '../store/slices/cartSlice';
import { applyCoupon } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const FREQUENCIES = [
  { id: 30, label: 'Every 30 Days', desc: 'Most popular for daily essentials' },
  { id: 60, label: 'Every 60 Days', desc: 'Perfect for moderate use' },
  { id: 90, label: 'Every 90 Days', desc: 'Great for occasional restocking' },
];

const SubscribeAndSavePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [frequency, setFrequency] = useState(30);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ['subscribeProducts'],
    queryFn: () => productService.getProducts({ limit: 12 }),
  });

  const products = data?.data?.products || [];

  const handleToggleProduct = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) {
        return prev.filter(p => p._id !== product._id);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setSelectedProducts(prev => prev.map(p => {
      if (p._id === productId) {
        const newQuantity = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce((sum, item) => sum + ((item.discountedPrice || item.price) * item.quantity), 0);
    const discount = subtotal * 0.15; // 15% off
    return { subtotal, discount, total: subtotal - discount };
  };

  const handleSubscribe = async () => {
    if (selectedProducts.length === 0) return;
    setIsSubscribing(true);

    try {
      // Add all items to cart
      for (const item of selectedProducts) {
        await dispatch(addToCart({
          productId: item._id,
          quantity: item.quantity,
          selectedSize: item.sizes?.length > 0 ? item.sizes[0] : undefined
        })).unwrap();
      }

      // Apply the SUBSCRIBE15 coupon
      await dispatch(applyCoupon('SUBSCRIBE15')).unwrap();

      // Store the frequency for checkout
      localStorage.setItem('checkoutSubscriptionFreq', frequency);

      success('Subscription Created!', 'Your items have been added to the cart with a 15% discount.');
      navigate('/cart');
    } catch (err) {
      toastError('Error', 'Failed to create subscription box. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const { subtotal, discount, total } = calculateTotal();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-6 rotate-3">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Subscribe & <span className="text-green-600">Save 15%</span>
          </h1>
          <p className="text-lg text-gray-600">
            Build your custom recurring box. Never run out of your favorites, and enjoy a flat 15% discount on every delivery.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content: Steps */}
          <div className="flex-1 space-y-12">
            
            {/* Step 1: Products */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <h2 className="text-2xl font-bold text-gray-900">Select Your Essentials</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => {
                  const isSelected = selectedProducts.some(p => p._id === product._id);
                  return (
                    <div 
                      key={product._id}
                      onClick={() => handleToggleProduct(product)}
                      className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-300 p-4 flex flex-col ${
                        isSelected ? 'border-green-500 bg-green-50/30 shadow-md' : 'border-gray-100 hover:border-green-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 relative">
                        <img src={product.images[0] || '/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm animate-in zoom-in">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">{product.brand?.name || 'ShopPilot'}</p>
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                        <div className="mt-auto flex items-center gap-2">
                          <span className="font-bold text-gray-900">{formatPrice(product.discountedPrice || product.price)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Frequency */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Delivery Frequency</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FREQUENCIES.map(freq => (
                  <button
                    key={freq.id}
                    onClick={() => setFrequency(freq.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      frequency === freq.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-lg">{freq.label}</span>
                      {frequency === freq.id && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{freq.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Subscription Box Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="sticky top-24 bg-gray-900 rounded-3xl p-8 text-white shadow-xl animate-in slide-in-from-right-8 duration-700 delay-300">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-400" />
                Your Subscription Box
              </h3>

              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-2xl">
                  <p>No items selected yet.</p>
                  <p className="text-sm mt-2">Pick your essentials to start saving!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Items List */}
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedProducts.map(item => (
                      <div key={item._id} className="flex gap-4">
                        <img src={item.images[0] || '/placeholder.jpg'} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-gray-800" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold line-clamp-2 mb-1">{item.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 font-medium">{formatPrice(item.discountedPrice || item.price)}</span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(item._id, -1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item._id, 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Math */}
                  <div className="border-t border-gray-700 pt-6 space-y-3">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-400 font-medium">
                      <span>Subscription Discount (15%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-gray-700">
                      <span>Total Box Value</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <p className="text-sm text-gray-400 text-center mt-2">
                      Ships every <span className="font-bold text-white">{frequency} days</span>. Cancel anytime.
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-green-500/25 disabled:opacity-75 flex items-center justify-center gap-2"
                  >
                    {isSubscribing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <>Subscribe Now <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}} />
    </div>
  );
};

export default SubscribeAndSavePage;
