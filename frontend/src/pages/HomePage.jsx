import { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Zap,
  TrendingUp,
  Sparkles,
  Package,
} from 'lucide-react';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import RecentlyViewed from '../components/RecentlyViewed';
import StoriesFeed from '../components/StoriesFeed';
import { useCurrency } from '../contexts/CurrencyContext';

// Category icon/image mapping
const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-bd45ba9fe922?w=400&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
};

const heroBanners = [
  {
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'Discover incredible deals on electronics, fashion, and more. Limited time offer!',
    cta: 'Shop Now',
    link: '/products',
    gradient: 'from-purple-700 via-purple-600 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
    description: 'Be the first to get your hands on the latest products. Explore what\'s new this season.',
    cta: 'Explore',
    link: '/new-arrivals',
    gradient: 'from-emerald-700 via-teal-600 to-cyan-700',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  },
  {
    title: 'Tech Deals',
    subtitle: 'Best Gadgets',
    description: 'Premium electronics at unbeatable prices. Upgrade your tech game today.',
    cta: 'View Deals',
    link: '/deals',
    gradient: 'from-orange-600 via-red-600 to-pink-700',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const { formatPrice, currencySymbol } = useCurrency();

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured products
  const { data: featuredResponse } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getProducts({ limit: 8, sortBy: 'rating', sortOrder: 'desc' }),
  });

  // Fetch newest products
  const { data: newArrivalsResponse } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productService.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const featuredProducts = featuredResponse?.data || [];
  const newArrivals = newArrivalsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);

  // Combine featured and new arrivals for the stories feed, ensuring unique items and max 10
  const combinedStories = [...new Map([...featuredProducts, ...newArrivals].map(item => [item.id, item])).values()].slice(0, 10);

  return (
    <div className="homepage">
      {/* Instagram-style Stories Feed */}
      <StoriesFeed stories={combinedStories} title="Trending Now" />

      {/* Hero Banner Carousel */}
      <section className="hero-carousel">
        <div className="hero-carousel__track">
          {heroBanners.map((banner, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentBanner ? 'hero-slide--active' : ''}`}
            >
              <div className={`hero-slide__bg bg-gradient-to-br ${banner.gradient}`}>
                <div className="hero-slide__overlay" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="hero-slide__image"
                />
              </div>
              <div className="container mx-auto px-4 hero-slide__content">
                <div className="hero-slide__text">
                  <span className="hero-slide__badge">
                    <Sparkles className="w-4 h-4" />
                    {banner.subtitle}
                  </span>
                  <h1 className="hero-slide__title">{banner.title}</h1>
                  <p className="hero-slide__description">{banner.description}</p>
                  <Link to={banner.link} className="hero-slide__cta">
                    {banner.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button onClick={prevBanner} className="hero-carousel__btn hero-carousel__btn--prev">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextBanner} className="hero-carousel__btn hero-carousel__btn--next">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="hero-carousel__dots">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`hero-carousel__dot ${index === currentBanner ? 'hero-carousel__dot--active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges">
        <div className="container mx-auto px-4">
          <div className="trust-badges__grid">
            <div className="trust-badge">
              <div className="trust-badge__icon trust-badge__icon--purple">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="trust-badge__title">Free Shipping</h4>
                <p className="trust-badge__text">On orders over {formatPrice(999)}</p>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon trust-badge__icon--blue">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="trust-badge__title">Secure Payment</h4>
                <p className="trust-badge__text">100% secure checkout</p>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon trust-badge__icon--green">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="trust-badge__title">Easy Returns</h4>
                <p className="trust-badge__text">30-day return policy</p>
              </div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge__icon trust-badge__icon--orange">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="trust-badge__title">24/7 Support</h4>
                <p className="trust-badge__text">Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="section-categories">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="section-header__title">Shop by Category</h2>
                <p className="section-header__subtitle">Browse our curated collections</p>
              </div>
              <Link to="/categories" className="section-header__link">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-card__image-wrapper">
                    <img
                      src={categoryImages[category.slug] || categoryImages.electronics}
                      alt={category.name}
                      className="category-card__image"
                    />
                    <div className="category-card__overlay" />
                  </div>
                  <div className="category-card__content">
                    <h3 className="category-card__name">{category.name}</h3>
                    <span className="category-card__cta">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section-featured">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div>
              <h2 className="section-header__title">
                <TrendingUp className="w-6 h-6 inline-block mr-2 text-purple-600" />
                Top Rated Products
              </h2>
              <p className="section-header__subtitle">Highest rated by our customers</p>
            </div>
            <Link to="/products" className="section-header__link">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container mx-auto px-4">
          <div className="promo-banner__inner">
            <div className="promo-banner__content">
              <span className="promo-banner__badge">
                <Zap className="w-4 h-4" /> Limited Time
              </span>
              <h2 className="promo-banner__title">Flash Sale — Extra 20% Off!</h2>
              <p className="promo-banner__text">
                Use code <strong>FLASH20</strong> at checkout. Hurry, offer ends soon!
              </p>
              <Link to="/deals" className="promo-banner__cta">
                Shop the Sale <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="promo-banner__decoration">
              <div className="promo-banner__circle promo-banner__circle--1" />
              <div className="promo-banner__circle promo-banner__circle--2" />
              <div className="promo-banner__circle promo-banner__circle--3" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-new-arrivals">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="section-header__title">
                  <Package className="w-6 h-6 inline-block mr-2 text-emerald-600" />
                  New Arrivals
                </h2>
                <p className="section-header__subtitle">Just landed — fresh from the shelves</p>
              </div>
              <Link to="/new-arrivals" className="section-header__link">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="new-arrivals-grid">
              {newArrivals.map((product) => (
                <NewArrivalCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container mx-auto px-4">
          <div className="newsletter__inner">
            <h2 className="newsletter__title">Stay in the Loop</h2>
            <p className="newsletter__text">
              Subscribe to our newsletter for exclusive deals, new arrivals, and more.
            </p>
            <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter__input"
              />
              <button type="submit" className="newsletter__btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, navigate }) => {
  const { formatPrice } = useCurrency();
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="product-card__image-wrapper">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className="product-card__image"
        />
        {product.discount > 0 && (
          <span className="product-card__badge">-{product.discount}%</span>
        )}
        <div className="product-card__actions">
          <button 
            className="product-card__action" 
            title="Add to Wishlist"
            onClick={(e) => {
              e.stopPropagation();
              // To be implemented via props if needed, or redirect to product page for now
              navigate(`/products/${product.slug}`);
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button 
            className="product-card__action" 
            title="Add to Cart"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.slug}`);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category?.name || product.category}</p>
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__rating">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="product-card__reviews">({product.reviewCount || 0})</span>
        </div>
        <div className="product-card__pricing">
          <span className="product-card__price">{formatPrice(Math.round(discountedPrice))}</span>
          {product.discount > 0 && (
            <span className="product-card__original-price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// New Arrival Card Component (horizontal layout)
const NewArrivalCard = ({ product, navigate }) => {
  const { formatPrice } = useCurrency();
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="new-arrival-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="new-arrival-card__image-wrapper">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className="new-arrival-card__image"
        />
        <span className="new-arrival-card__badge">NEW</span>
      </div>
      <div className="new-arrival-card__info">
        <p className="new-arrival-card__category">{product.category?.name || product.category}</p>
        <h3 className="new-arrival-card__title">{product.title}</h3>
        <div className="new-arrival-card__rating">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
        </div>
        <div className="new-arrival-card__pricing">
          <span className="new-arrival-card__price">{formatPrice(Math.round(discountedPrice))}</span>
          {product.discount > 0 && (
            <span className="new-arrival-card__original-price">{formatPrice(product.price)}</span>
          )}
        </div>
        <button className="new-arrival-card__cta">
          <ShoppingCart className="w-4 h-4" /> View Product
        </button>
      </div>
    </div>
  );
};

export default HomePage;
