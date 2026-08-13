import { useState, useEffect } from 'react';
import { topLoader } from '../utils/TopLoaderController';

const GlobalLoader = () => {
  const [state, setState] = useState({ progress: 0, visible: false });

  useEffect(() => {
    const unsubscribe = topLoader.subscribe(setState);
    return () => unsubscribe();
  }, []);

  // Render the overlay loader instead of the top bar
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[2px] transition-opacity duration-300 ${
        state.visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-75"></div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 border-r-indigo-600 animate-spin relative z-10"></div>
        </div>
        <div className="text-indigo-900 font-bold tracking-widest uppercase text-xs animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
