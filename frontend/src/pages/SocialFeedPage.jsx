import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Heart, MessageCircle, Share2, ShoppingBag, Plus, Loader2, Volume2, VolumeX } from 'lucide-react';
import { productService } from '../services/product.service';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

// Reliable public sample videos to act as "Social Feed" content
const MOCK_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

const FeedItem = ({ product, videoUrl, isActive, isMuted, toggleMute }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 10000) + 100);
  const [isAdding, setIsAdding] = useState(false);
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1,
        selectedSize: product.sizes?.length > 0 ? product.sizes[0] : undefined
      })).unwrap();
      success('Added!', `${product.title} added to your cart.`);
    } catch (err) {
      toastError('Error', 'Failed to add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative w-full h-[100vh] sm:h-[calc(100vh-64px)] snap-start snap-always bg-black flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        loop
        muted={isMuted}
        playsInline
        onClick={toggleMute}
      />
      
      {/* Overlay Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

      {/* Mute Toggle indicator */}
      <button 
        onClick={toggleMute}
        className="absolute top-20 sm:top-6 left-4 z-20 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Right Action Bar */}
      <div className="absolute right-4 bottom-32 sm:bottom-24 z-20 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={handleLike}
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-all ${isLiked ? 'text-red-500' : 'text-white'}`}
          >
            <Heart className={`w-7 h-7 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'} transition-transform`} />
          </button>
          <span className="text-white text-xs font-bold shadow-sm">{likes}</span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white transition-transform group-hover:scale-110">
            <MessageCircle className="w-7 h-7" />
          </button>
          <span className="text-white text-xs font-bold shadow-sm">{Math.floor(likes / 10)}</span>
        </div>

        <div className="flex flex-col items-center gap-1 group">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white transition-transform group-hover:scale-110">
            <Share2 className="w-7 h-7" />
          </button>
          <span className="text-white text-xs font-bold shadow-sm">Share</span>
        </div>
      </div>

      {/* Bottom Product Card */}
      {product && (
        <div className="absolute bottom-6 left-4 right-20 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md sm:right-auto z-20 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group hover:bg-white/15 transition-colors">
            
            <img 
              src={product.images?.[0] || '/placeholder.jpg'} 
              alt={product.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10"
            />
            
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm line-clamp-1">{product.title}</h3>
              <p className="text-white/70 text-xs line-clamp-1 mb-1">{product.description}</p>
              <p className="text-white font-bold">{formatPrice(product.discountedPrice || product.price)}</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-12 h-12 flex-shrink-0 bg-white text-gray-900 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SocialFeedPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const observerRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['socialFeedProducts'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const products = data?.data?.products || [];

  // Setup intersection observer to track which video is in view
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6 // Trigger when 60% of the element is visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.feed-item');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-[100vh] sm:h-[calc(100vh-64px)] w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
      {products.map((product, index) => (
        <div 
          key={product._id} 
          className="feed-item" 
          data-index={index}
        >
          <FeedItem 
            product={product} 
            videoUrl={MOCK_VIDEOS[index % MOCK_VIDEOS.length]} 
            isActive={activeIndex === index}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(!isMuted)}
          />
        </div>
      ))}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default SocialFeedPage;
