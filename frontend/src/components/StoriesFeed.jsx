import React, { useState, useEffect, useCallback } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STORY_DURATION = 5000; // 5 seconds per story

const StoriesFeed = ({ stories = [], title = "Flash Deals" }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setActiveStoryIndex(null);
    setProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  }, [activeStoryIndex, stories.length, handleClose]);

  const handlePrev = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [activeStoryIndex]);

  useEffect(() => {
    let intervalId;
    if (activeStoryIndex !== null) {
      intervalId = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(intervalId);
            handleNext();
            return 0;
          }
          return oldProgress + (100 / (STORY_DURATION / 50)); // Update every 50ms
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [activeStoryIndex, handleNext]);

  if (!stories || stories.length === 0) return null;

  return (
    <>
      {/* Horizontal Stories Bar */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-4">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {title}
          </h3>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {stories.map((story, index) => (
              <button
                key={story.id || index}
                onClick={() => {
                  setActiveStoryIndex(index);
                  setProgress(0);
                }}
                className="flex flex-col items-center gap-2 shrink-0 snap-start group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-white">
                    <img 
                      src={story.images?.[0] || story.image || '/placeholder.jpg'} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300 w-16 sm:w-20 truncate text-center">
                  {story.brand?.name || "Featured"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Story Viewer */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-md">
          {/* Progress Bars */}
          <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-50 max-w-md mx-auto w-full">
            {stories.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                  style={{ 
                    width: `${
                      idx < activeStoryIndex ? 100 : 
                      idx === activeStoryIndex ? progress : 0
                    }%` 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-8 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Story Container */}
          <div className="relative w-full max-w-md h-[100dvh] sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-gray-900 flex flex-col justify-between shadow-2xl">
            
            {/* Background Image */}
            <img 
              src={stories[activeStoryIndex].images?.[0] || stories[activeStoryIndex].image || '/placeholder.jpg'}
              alt={stories[activeStoryIndex].title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            
            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

            {/* Header info */}
            <div className="relative z-10 pt-10 px-4 flex items-center gap-3 pointer-events-none">
              <div className="w-10 h-10 rounded-full border border-white/50 overflow-hidden bg-white/20 backdrop-blur-sm">
                <img 
                   src={stories[activeStoryIndex].brand?.logo || stories[activeStoryIndex].images?.[0] || '/placeholder.jpg'} 
                   alt="brand"
                   className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white drop-shadow-md">
                <h4 className="font-bold text-sm">{stories[activeStoryIndex].brand?.name || "ShopPilot"}</h4>
                <p className="text-xs text-white/80">Sponsored</p>
              </div>
            </div>

            {/* Click Areas for Navigation */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={handlePrev} />
            <div className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer" onClick={handleNext} />

            {/* Bottom Content Area */}
            <div className="relative z-30 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  {stories[activeStoryIndex].title}
                </h2>
                {stories[activeStoryIndex].discount > 0 && (
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse mb-2">
                    {stories[activeStoryIndex].discount}% OFF FLASH SALE
                  </span>
                )}
                <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">
                  {stories[activeStoryIndex].shortDescription || stories[activeStoryIndex].description}
                </p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                  navigate(`/products/${stories[activeStoryIndex].slug}`);
                }}
                className="w-full bg-white text-black py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors transform active:scale-95 z-40 relative pointer-events-auto shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesFeed;
