import { Star, Calendar, ThumbsUp, X } from 'lucide-react';
import { useState } from 'react';

const ReviewCard = ({ review, onHelpful }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        } transition-transform duration-300 ${isHovered && i < rating ? 'scale-110' : ''}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getGradient = (name) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-indigo-500 to-cyan-500',
      'from-blue-500 to-emerald-500',
      'from-rose-400 to-orange-400',
      'from-amber-400 to-rose-500'
    ];
    // Simple hash to consistently assign a gradient
    const hash = name ? name.charCodeAt(0) % gradients.length : 0;
    return gradients[hash];
  };

  const handleHelpfulClick = () => {
    if (onHelpful && !helpfulClicked) {
      setHelpfulClicked(true);
      onHelpful(review.id);
      setTimeout(() => setHelpfulClicked(false), 300);
    }
  };

  const userName = review.user?.firstName 
    ? `${review.user.firstName} ${review.user.lastName || ''}` 
    : 'Anonymous User';

  return (
    <div 
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient blur in background */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-100/50 rounded-full blur-3xl group-hover:bg-purple-200/50 transition-colors duration-500 -z-10"></div>
      
      {/* Header with user info and rating */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${getGradient(review.user?.firstName)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ring-4 ring-white`}>
            {review.user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 tracking-tight">
              {userName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-0.5 bg-gray-50/80 px-2.5 py-1.5 rounded-full border border-gray-100 backdrop-blur-sm">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-bold text-gray-900 mb-3 text-lg">{review.title}</h5>
      )}

      {/* Review Comment */}
      <p className="text-gray-600 mb-5 leading-relaxed relative z-10">{review.comment}</p>

      {/* Verified Purchase Badge */}
      {review.isVerifiedPurchase && (
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-emerald-100/50 shadow-sm animate-in fade-in slide-in-from-left-2 duration-500">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verified Purchase
        </div>
      )}

      {/* Helpful Button & Images */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100 relative z-10">
        <button
          onClick={handleHelpfulClick}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors group/btn"
        >
          <div className={`p-2 rounded-full bg-gray-50 group-hover/btn:bg-purple-50 transition-colors ${helpfulClicked ? 'animate-bounce text-purple-600' : ''}`}>
            <ThumbsUp className="w-4 h-4" />
          </div>
          <span>Helpful ({review.helpfulCount || 0})</span>
        </button>
        
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2">
            {review.images.slice(0, 3).map((image, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-xl border border-gray-200 group/img cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-14 h-14 object-cover group-hover/img:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 sm:-right-12 sm:-top-12 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="Review full size" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
