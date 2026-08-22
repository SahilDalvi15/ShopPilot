import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCurrency } from '../contexts/CurrencyContext';

const VisualSearchModal = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  // States: 'upload' -> 'scanning' -> 'results'
  const [searchState, setSearchState] = useState('upload');
  const [results, setResults] = useState([]);
  const fileInputRef = useRef(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setSearchState('upload');
      setImageFile(null);
      setImagePreviewUrl(null);
      setResults([]);
    }
  }, [isOpen]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      startScanning();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const startScanning = () => {
    setSearchState('scanning');
    
    // Simulate AI processing delay (3 seconds)
    setTimeout(async () => {
      try {
        // Mock fetching visually similar products by getting 4 random products
        const response = await productService.getProducts({ limit: 4 });
        setResults(response.data || []);
      } catch (error) {
        console.error('Failed to fetch similar products', error);
      } finally {
        setSearchState('results');
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Visual Search</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {searchState === 'upload' && (
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Drag & drop an image here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Upload a photo of a product, pattern, or style, and our AI will find the closest matches in our catalog!
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md"
              >
                Browse Files
              </button>
            </div>
          )}

          {searchState === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-200 dark:border-slate-700">
                <img 
                  src={imagePreviewUrl} 
                  alt="Analyzing..." 
                  className="w-full h-full object-cover"
                />
                {/* Overlay darkening */}
                <div className="absolute inset-0 bg-indigo-900/30 mix-blend-multiply"></div>
                
                {/* Laser Scanning Animation */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_3px_rgba(34,211,238,0.7)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>

                {/* Corner reticles */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
              </div>
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium">
                <Search className="w-5 h-5 animate-pulse" />
                <span className="animate-pulse">AI is extracting visual features...</span>
              </div>
            </div>
          )}

          {searchState === 'results' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 mb-6 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Scan complete! We found these visually similar products:
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id || product._id}
                      to={`/products/${product.slug}`}
                      onClick={onClose}
                      className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 dark:bg-slate-900">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* 98% Match Badge */}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                          {90 + Math.floor(Math.random() * 9)}% Match
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.title}
                        </h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                          {formatPrice(product.discountedPrice || product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">We couldn't find any close matches for this image.</p>
                  <button 
                    onClick={() => setSearchState('upload')}
                    className="mt-4 text-indigo-600 hover:underline font-medium"
                  >
                    Try another image
                  </button>
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                 <button 
                    onClick={() => setSearchState('upload')}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                  >
                    Scan another image
                  </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      {/* Global Style for the laser scanning animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(256px); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default VisualSearchModal;
