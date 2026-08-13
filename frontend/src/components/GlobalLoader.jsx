import { useState, useEffect } from 'react';
import { topLoader } from '../utils/TopLoaderController';

const GlobalLoader = () => {
  const [state, setState] = useState({ progress: 0, visible: false });

  useEffect(() => {
    const unsubscribe = topLoader.subscribe(setState);
    return () => unsubscribe();
  }, []);

  if (!state.visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all ease-out"
        style={{ 
          width: `${state.progress}%`,
          transitionDuration: state.progress === 100 ? '200ms' : '500ms',
          opacity: state.progress === 100 ? 0 : 1
        }}
      />
    </div>
  );
};

export default GlobalLoader;
