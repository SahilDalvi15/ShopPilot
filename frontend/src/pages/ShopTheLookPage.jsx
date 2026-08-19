import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Camera, Heart, MessageCircle, Share2, Tag, Loader2, X, ShoppingCart } from 'lucide-react';
import { productService } from '../services/product.service';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const MOCK_POSTS = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: {
      name: 'Sarah Style',
      handle: '@sarahstyle',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    likes: 1240,
    caption: 'Loving this new summer fit! The perfect blend of comfort and style. ☀️✨',
    tags: [
      { id: 'tag1', x: 45, y: 30, productId: null },
      { id: 'tag2', x: 60, y: 70, productId: null }
    ]
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: {
      name: 'Alex Designs',
      handle: '@alexdesigns',
      avatar: 'https://i.pravatar.cc/150?u=alex'
    },
    likes: 892,
    caption: 'Current skincare routine featuring my holy grail products. Dewy skin all day! 💧🌿',
    tags: [
      { id: 'tag3', x: 50, y: 50, productId: null }
    ]
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: {
      name: 'Emma Vogue',
      handle: '@emmavogue',
      avatar: 'https://i.pravatar.cc/150?u=emma'
    },
    likes: 3205,
    caption: 'Date night ready. This bag is everything! 🖤👜',
    tags: [
      { id: 'tag4', x: 70, y: 65, productId: null },
      { id: 'tag5', x: 30, y: 25, productId: null }
    ]
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: {
      name: 'Tech Guy',
      handle: '@techguy',
      avatar: 'https://i.pravatar.cc/150?u=tech'
    },
    likes: 452,
    caption: 'Minimal desk setup for maximum productivity. 🎧💻',
    tags: [
      { id: 'tag6', x: 50, y: 40, productId: null }
    ]
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: {
      name: 'Sneakerhead',
      handle: '@sneaks',
      avatar: 'https://i.pravatar.cc/150?u=sneaks'
    },
    likes: 5621,
    caption: 'Fresh out the box. The colorway is insane! 🔥👟',
    tags: [
      { id: 'tag7', x: 50, y: 70, productId: null }
    ]
  }
];

const ShopTheLookPage = () => {
  const [activePost, setActivePost] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ['shopTheLookProducts'],
    queryFn: () => productService.getProducts({ limit: 10 }),
  });

  const products = data?.data?.products || [];

  const postsWithProducts = useMemo(() => {
    if (!products.length) return MOCK_POSTS;
    
    let productIndex = 0;
    return MOCK_POSTS.map(post => ({
      ...post,
      tags: post.tags.map(tag => {
        const product = products[productIndex % products.length];
        productIndex++;
        return {
          ...tag,
          product
        };
      })
    }));
  }, [products]);

  const handleAddToCart = async () => {
    if (!quickViewProduct) return;
    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ 
        productId: quickViewProduct._id, 
        quantity: 1,
        selectedSize: quickViewProduct.sizes?.length > 0 ? quickViewProduct.sizes[0] : undefined
      })).unwrap();
      success('Added to Cart', `${quickViewProduct.title} has been added to your cart.`);
      setQuickViewProduct(null);
    } catch (err) {
      toastError('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-medium text-sm mb-4">
            <Camera className="w-4 h-4" />
            Social Commerce
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Shop The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Look</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get inspired by our community. Hover over images to discover tagged products and shop the style instantly.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {postsWithProducts.map((post) => (
            <div 
              key={post.id}  
              className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 relative"
              onMouseEnter={() => setActivePost(post.id)}
              onMouseLeave={() => setActivePost(null)}
            >
              {/* Image Container with Hotspots */}
              <div className="relative overflow-hidden cursor-crosshair">
                <img 
                  src={post.imageUrl} 
                  alt={post.caption}
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                
                {/* Hotspots / Tags overlay */}
                <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${activePost === post.id ? 'opacity-100' : 'opacity-0'}`}>
                  {post.tags.map((tag) => (
                    <div 
                      key={tag.id}
                      className="absolute group/tag"
                      style={{ top: `${tag.y}%`, left: `${tag.x}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {/* Pulsing dot */}
                      <button className="relative flex items-center justify-center w-8 h-8 focus:outline-none">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-white shadow-lg items-center justify-center">
                          <div className="h-1.5 w-1.5 bg-gray-900 rounded-full"></div>
                        </span>
                      </button>
                      
                      {/* Tooltip */}
                      <div 
                        onClick={() => tag.product && setQuickViewProduct(tag.product)}
                        className="absolute top-1/2 left-full ml-3 -translate-y-1/2 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200 z-10 flex items-center gap-3 pointer-events-auto cursor-pointer hover:bg-gray-50"
                      >
                        {tag.product ? (
                          <>
                            <img src={tag.product.images?.[0] || '/placeholder.jpg'} alt={tag.product.title} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="pr-2">
                              <p className="text-xs font-semibold text-gray-900 truncate w-32">{tag.product.title}</p>
                              <p className="text-xs font-bold text-pink-600">{formatPrice(tag.product.discountedPrice || tag.product.price)}</p>
                            </div>
                          </>
                        ) : (
                          <div className="px-2 flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-gray-900" />
                            <span className="text-sm font-semibold text-gray-900">View Product</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post Details */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.influencer.avatar} 
                      alt={post.influencer.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{post.influencer.name}</p>
                      <p className="text-xs text-gray-500">{post.influencer.handle}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {post.caption}
                </p>
                
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 50) + 10}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 bg-white/50 backdrop-blur-md text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Product Image */}
            <div className="md:w-1/2 bg-gray-50">
              <img 
                src={quickViewProduct.images?.[0] || '/placeholder.jpg'} 
                alt={quickViewProduct.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-pink-600 font-semibold text-sm mb-2">{quickViewProduct.brand?.name || 'ShopPilot Premium'}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{quickViewProduct.title}</h2>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(quickViewProduct.discountedPrice || quickViewProduct.price)}
                </span>
                {quickViewProduct.discountedPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-8 line-clamp-3">
                {quickViewProduct.description}
              </p>
              
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Adding...</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopTheLookPage;
