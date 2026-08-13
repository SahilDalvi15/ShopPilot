import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Filter, ArrowUpDown } from 'lucide-react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, loading, onHelpful, onFilterChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [sortBy, setSortBy] = useState('newest'); // newest, helpful, highest, lowest

  // First filter the reviews
  const filteredReviews = reviews?.filter((review) => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  }) || [];

  // Then sort them
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const displayReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

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
    <div className="space-y-8">
      {/* Rating Summary Card with Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-yellow-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-bl-full -z-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Average Rating Left Side */}
          <div className="flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-10">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">Overall Rating</h3>
            <div className="flex items-center gap-4">
              <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">
                {averageRating}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.3)]'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md inline-block w-max">
                  Based on {totalReviews} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Rating Distribution Right Side */}
          <div className="space-y-3 justify-center flex flex-col">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = totalReviews > 0 ? (distribution[rating - 1] / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-4 group">
                  <span className="text-sm font-bold text-gray-700 w-12 flex items-center gap-1">
                    {rating} <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                        rating >= 4 ? 'bg-green-400' : rating === 3 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400 w-10 text-right group-hover:text-gray-900 transition-colors">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">
          Showing <span className="text-purple-600">{sortedReviews.length}</span> Reviews
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-purple-500" />
            </div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                onFilterChange && onFilterChange(e.target.value);
              }}
              className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer transition-all shadow-sm"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ArrowUpDown className="w-4 h-4 text-purple-500" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer transition-all shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/50 rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts on this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {displayReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={onHelpful}
              />
            ))}
          </div>

          {/* Show More/Less Button */}
          {sortedReviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 px-6 bg-purple-50/50 hover:bg-purple-100/50 border border-purple-100 rounded-xl text-purple-700 font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  Read {sortedReviews.length - 3} More Reviews
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
