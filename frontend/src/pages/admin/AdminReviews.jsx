import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, 
  Trash2, 
  Search, 
  Filter,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import adminReviewService from '../../../services/adminReviewService';
import { useToast } from '../../../contexts/ToastContext';
import { Link } from 'react-router-dom';

const AdminReviews = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reviews', page, debouncedSearch, ratingFilter],
    queryFn: () => adminReviewService.getAllReviews({ 
      page, 
      limit: 10, 
      search: debouncedSearch,
      rating: ratingFilter
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminReviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      success('Review deleted successfully');
    },
    onError: (err) => {
      toastError(err?.response?.data?.message || 'Failed to delete review');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

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

  const reviews = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage customer product reviews.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by user or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading reviews...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>Failed to load reviews.</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6">
                
                {/* Product Info */}
                <div className="md:w-1/4 shrink-0 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                  {review.productImage ? (
                    <img src={review.productImage} alt={review.productTitle} className="w-20 h-20 object-cover rounded-lg border border-gray-200 mb-3" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 mb-3 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <Link to={`/products/${review.productId}`} className="font-semibold text-gray-900 hover:text-purple-600 hover:underline line-clamp-2 text-sm flex items-center gap-1">
                    {review.productTitle || 'Product'}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="font-bold text-gray-900">{review.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{review.user?.firstName} {review.user?.lastName}</span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.isVerifiedPurchase && (
                          <>
                            <span>•</span>
                            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="md:w-auto shrink-0 flex items-start justify-end">
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deleteMutation.isLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip"
                    title="Delete Review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-700">
              Showing page <span className="font-semibold">{pagination.page}</span> of{' '}
              <span className="font-semibold">{pagination.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
