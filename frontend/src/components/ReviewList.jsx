import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, loading, onHelpful, onFilterChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  const filteredReviews = reviews?.filter((review) => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  }) || [];

  const displayReviews = showAll ? filteredReviews : filteredReviews.slice(0, 3);

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    if (!reviews || reviews.length === 0) return [0, 0, 0, 0, 0];
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const averageRating = calculateAverageRating();
  const totalReviews = reviews?.length || 0;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
              <div className="flex flex-col">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{totalReviews} reviews</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[54321].reverse().map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{
                      width: `${totalReviews > 0 ? (distribution[rating - 1] / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">
                  {distribution[rating - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reviews ({filteredReviews.length})</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              onFilterChange && onFilterChange(e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onHelpful={onHelpful}
              />
            ))}
          </div>

          {/* Show More/Less Button */}
          {filteredReviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-purple-600 font-medium hover:bg-purple-50 transition flex items-center justify-center gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show More ({filteredReviews.length - 3} more)
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
