import { Star, User, Calendar, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review, onHelpful }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with user info and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.name || 'Anonymous User'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
      )}

      {/* Review Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Verified Purchase Badge */}
      {review.verifiedPurchase && (
        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full mb-4">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verified Purchase
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onHelpful && onHelpful(review._id)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({review.helpfulCount || 0})</span>
        </button>
        
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2">
            {review.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
