import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Eye, Heart, Send, MessageCircle, X, ShoppingBag, Loader2 } from 'lucide-react';
import { productService } from '../services/product.service';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const MOCK_CHAT = [
  { id: 1, user: 'Sarah123', message: 'Omg love that color!' },
  { id: 2, user: 'Mike_T', message: 'Is it true to size?' },
  { id: 3, user: 'FashionGuru', message: 'I need this right now 🔥' },
  { id: 4, user: 'Elena_V', message: 'Just bought it!' },
  { id: 5, user: 'ShopAholic', message: 'Are there other colors available?' },
  { id: 6, user: 'Jessica.B', message: 'So cute 😍' },
];

const LiveShoppingPage = () => {
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT.slice(0, 2));
  const [newMessage, setNewMessage] = useState('');
  const [viewers, setViewers] = useState(1243);
  const [featuredProductIndex, setFeaturedProductIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();

  // Fetch products for the stream
  const { data } = useQuery({
    queryKey: ['liveProducts'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const products = data?.data?.products || [];
  const featuredProduct = products[featuredProductIndex];

  // Simulate chat and viewers
  useEffect(() => {
    let messageIndex = 2;
    
    const chatInterval = setInterval(() => {
      if (messageIndex < MOCK_CHAT.length) {
        setChatMessages(prev => [...prev, MOCK_CHAT[messageIndex]]);
        messageIndex++;
      } else {
        // Loop chat for simulation
        const randomMessage = MOCK_CHAT[Math.floor(Math.random() * MOCK_CHAT.length)];
        setChatMessages(prev => [...prev, { ...randomMessage, id: Date.now() }]);
      }
    }, 3500);

    const viewersInterval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 11) - 3); // Fluctuate viewers
    }, 5000);

    const productInterval = setInterval(() => {
      if (products.length > 0) {
        setFeaturedProductIndex(prev => (prev + 1) % products.length);
      }
    }, 12000); // Change product every 12 seconds

    return () => {
      clearInterval(chatInterval);
      clearInterval(viewersInterval);
      clearInterval(productInterval);
    };
  }, [products.length]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), user: 'You', message: newMessage }]);
    setNewMessage('');
  };

  const handleAddToCart = async () => {
    if (!featuredProduct) return;
    setIsAdding(true);
    try {
      await dispatch(addToCart({ 
        productId: featuredProduct._id, 
        quantity: 1,
        selectedSize: featuredProduct.sizes?.length > 0 ? featuredProduct.sizes[0] : undefined
      })).unwrap();
      success('Got it!', `${featuredProduct.title} added to your cart.`);
    } catch (err) {
      toastError('Error', 'Failed to add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Video Area */}
      <div className="relative flex-1 bg-gray-900 flex flex-col justify-center overflow-hidden">
        {/* Placeholder Video Stream (Using an image for now, you can replace with a real video element) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Live Stream" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Subtle overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Top Bar overlays */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              LIVE
            </div>
            <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {viewers.toLocaleString()}
            </div>
          </div>
          <button className="bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Featured Product */}
        {featuredProduct && (
          <div className="absolute bottom-24 left-6 md:bottom-12 md:left-12 z-10 animate-in slide-in-from-bottom-8 fade-in duration-500" key={featuredProduct._id}>
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white max-w-sm shadow-2xl">
               <div className="flex items-center gap-2 mb-3">
                 <ShoppingBag className="w-4 h-4 text-pink-400" /> 
                 <p className="text-xs font-bold text-pink-400 uppercase tracking-wider">Featured Now</p>
               </div>
               
               <div className="flex gap-4 mb-4">
                 <img 
                   src={featuredProduct.images?.[0] || '/placeholder.jpg'} 
                   alt={featuredProduct.title}
                   className="w-20 h-20 rounded-xl object-cover border border-white/20"
                 />
                 <div>
                   <h3 className="text-sm font-bold leading-tight mb-1 line-clamp-2">{featuredProduct.title}</h3>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-lg">{formatPrice(featuredProduct.discountedPrice || featuredProduct.price)}</span>
                     {featuredProduct.discountedPrice && (
                       <span className="text-sm text-white/60 line-through">{formatPrice(featuredProduct.price)}</span>
                     )}
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleAddToCart}
                 disabled={isAdding}
                 className="w-full bg-white text-gray-900 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
               >
                 {isAdding ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                 ) : (
                   'Buy Now'
                 )}
               </button>
             </div>
          </div>
        )}
      </div>

      {/* Chat & Interactions Area */}
      <div className="w-full md:w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-[50vh] md:h-auto shrink-0 z-20">
        <div className="p-4 border-b border-gray-800 bg-gray-900/95 sticky top-0">
          <h2 className="text-white font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
            Live Chat
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {chatMessages.map((chat) => (
            <div key={chat.id} className="animate-in slide-in-from-left-4 fade-in duration-300">
              <span className="font-bold text-indigo-400 text-sm mr-2">{chat.user}</span>
              <span className="text-gray-200 text-sm">{chat.message}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-900/95 border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Say something..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-full disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-4 flex justify-end">
            <button className="relative group">
              <Heart className="w-8 h-8 text-red-500 hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default LiveShoppingPage;
