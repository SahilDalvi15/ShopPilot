import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Sparkles, ArrowRight, ArrowLeft, Wallet, CreditCard, Gem, CheckCircle2, Loader2, ShoppingBag, Plus } from 'lucide-react';
import { productService } from '../services/product.service';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const QUIZ_QUESTIONS = [
  {
    id: 'style',
    title: 'What best describes your personal style?',
    subtitle: 'Select the vibe that resonates most with you.',
    options: [
      { id: 'minimalist', label: 'Minimalist & Clean', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'streetwear', label: 'Streetwear & Edgy', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'classic', label: 'Classic & Elegant', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'casual', label: 'Casual & Comfy', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'color',
    title: 'What is your preferred color palette?',
    subtitle: 'We will curate products that match your tones.',
    options: [
      { id: 'neutrals', label: 'Neutrals (Black, White, Beige)', color: 'bg-gradient-to-br from-stone-100 to-stone-300' },
      { id: 'earthy', label: 'Earthy (Brown, Olive, Rust)', color: 'bg-gradient-to-br from-amber-700 to-green-800' },
      { id: 'pastels', label: 'Pastels (Pink, Mint, Lilac)', color: 'bg-gradient-to-br from-pink-200 to-purple-200' },
      { id: 'bold', label: 'Bold (Red, Royal Blue, Yellow)', color: 'bg-gradient-to-br from-red-600 to-blue-600' }
    ]
  },
  {
    id: 'budget',
    title: 'What is your ideal budget range?',
    subtitle: 'This helps us find the best value for you.',
    options: [
      { id: 'budget', label: 'Budget Friendly (Under ₹1000)', icon: Wallet, desc: 'Great style doesn\'t have to break the bank.' },
      { id: 'mid', label: 'Mid-Range (₹1000 - ₹3000)', icon: CreditCard, desc: 'The sweet spot for quality and price.' },
      { id: 'premium', label: 'Premium (Over ₹3000)', icon: Gem, desc: 'Treat yourself to luxury and premium materials.' }
    ]
  }
];

const StyleQuizPage = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();

  // Fetch products for recommendations
  const { data } = useQuery({
    queryKey: ['stylistProducts'],
    queryFn: () => productService.getProducts({ limit: 50 }),
  });

  const products = data?.data?.products || [];

  const recommendedProducts = useMemo(() => {
    if (!products.length) return [];
    
    let filtered = [...products];

    // Simulate AI filtering based on answers
    if (answers.budget === 'budget') {
      filtered = filtered.filter(p => (p.discountedPrice || p.price) < 1000);
    } else if (answers.budget === 'mid') {
      filtered = filtered.filter(p => (p.discountedPrice || p.price) >= 1000 && (p.discountedPrice || p.price) <= 3000);
    } else if (answers.budget === 'premium') {
      filtered = filtered.filter(p => (p.discountedPrice || p.price) > 3000);
    }

    // Shuffle and pick top 4
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [answers, products]);

  const handleAddAllToCart = async () => {
    if (!recommendedProducts.length) return;
    setIsAddingAll(true);
    try {
      for (const product of recommendedProducts) {
        await dispatch(addToCart({ 
          productId: product._id, 
          quantity: 1,
          selectedSize: product.sizes?.length > 0 ? product.sizes[0] : undefined
        })).unwrap();
      }
      success('Added to Cart', 'Your curated wardrobe has been added to the cart!');
    } catch (err) {
      toastError('Error', 'Failed to add items to cart.');
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleStart = () => {
    setCurrentStep(0);
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    
    // Auto advance after a short delay
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
    } else {
      // Finished quiz
      setTimeout(() => {
        startAnalysis();
      }, 400);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Here we will eventually trigger the transition to the results UI
        setTimeout(() => {
          setIsAnalyzing(false);
          setCurrentStep(99); // 99 represents the results screen
        }, 800);
      }
      setAnalysisProgress(progress);
    }, 400);
  };

  const progressPercentage = ((currentStep) / QUIZ_QUESTIONS.length) * 100;

  // Render Intro Screen
  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="w-10 h-10" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Meet Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Stylist</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Take our 60-second style quiz. We'll analyze your preferences and curate a personalized selection of products just for you.
          </p>

          <button 
            onClick={handleStart}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/20 hover:-translate-y-1 transform duration-200"
          >
            Start the Quiz <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Render Analyzing Screen
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your profile...</h2>
            <p className="text-gray-500">Finding the perfect matches based on your unique style.</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <p className="text-sm font-semibold text-indigo-600">{analysisProgress}% Complete</p>
        </div>
      </div>
    );
  }

  // Render Results Screen
  if (currentStep === 99) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Custom Wardrobe is Ready!</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Based on your {answers.style} style and {answers.color} color preferences, we've curated these perfect matches for you.
            </p>
          </div>

          {recommendedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">We couldn't find exact matches. Try adjusting your preferences.</p>
              <button 
                onClick={() => { setCurrentStep(-1); setAnswers({}); }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                {recommendedProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
                      <img 
                        src={product.images[0] || '/placeholder.jpg'} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600 font-medium mb-1 truncate">{product.brand?.name || 'ShopPilot'}</p>
                      <h3 className="font-semibold text-gray-900 leading-tight mb-1 truncate">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{formatPrice(product.discountedPrice || product.price)}</span>
                        {product.discountedPrice && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto text-center space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                <button
                  onClick={handleAddAllToCart}
                  disabled={isAddingAll}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-xl shadow-indigo-200 disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isAddingAll ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Adding to Cart...</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5" /> Add Entire Wardrobe to Cart</>
                  )}
                </button>
                <button 
                  onClick={() => { setCurrentStep(-1); setAnswers({}); }}
                  className="text-gray-500 font-medium hover:text-gray-900 transition-colors text-sm"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Quiz Question
  const question = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => setCurrentStep(prev => prev > 0 ? prev - 1 : -1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Question Header */}
        <div className="mb-10 text-center animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{question.title}</h2>
          <p className="text-gray-500 text-lg">{question.subtitle}</p>
        </div>

        {/* Options Grid */}
        <div 
          key={question.id} // Forces re-animation on question change
          className={`grid gap-4 md:gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in ${
            question.id === 'style' ? 'grid-cols-2 lg:grid-cols-4' : 
            question.id === 'color' ? 'grid-cols-2 md:grid-cols-4' : 
            'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.id;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(question.id, option.id)}
                className={`relative group rounded-2xl overflow-hidden text-left transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-indigo-600 ring-offset-2 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-xl'
                } ${question.image ? 'aspect-[3/4]' : question.color ? 'aspect-square' : 'p-6 bg-white border-2 border-gray-100'}`}
              >
                {/* Image Option */}
                {question.image && (
                  <>
                    <img src={option.image} alt={option.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <p className="text-white font-semibold text-lg">{option.label}</p>
                    </div>
                  </>
                )}

                {/* Color Option */}
                {question.color && (
                  <>
                    <div className={`absolute inset-0 ${option.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center backdrop-blur-[2px]">
                      <p className={`font-bold text-lg shadow-sm ${option.id === 'neutrals' ? 'text-gray-900' : 'text-white'}`}>
                        {option.label}
                      </p>
                    </div>
                  </>
                )}

                {/* Text/Icon Option */}
                {!question.image && !question.color && (
                  <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                      {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{option.label}</h3>
                    <p className="text-gray-500 text-sm">{option.desc}</p>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default StyleQuizPage;
