import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
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

export default ProductCard;
