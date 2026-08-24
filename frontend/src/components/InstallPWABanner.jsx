import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWABanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between flex-wrap max-w-7xl mx-auto">
        <div className="w-0 flex-1 flex items-center">
          <span className="flex p-2 rounded-lg bg-indigo-800">
            <Download className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <p className="ml-3 font-medium text-sm sm:text-base truncate">
            <span className="md:hidden">Get the ShopPilot App!</span>
            <span className="hidden md:inline">Install the ShopPilot app for a faster, offline-ready experience.</span>
          </p>
        </div>
        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
          >
            Install Now
          </button>
        </div>
        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 transition-colors"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWABanner;
