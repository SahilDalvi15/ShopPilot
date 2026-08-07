import { useState } from 'react';
import { Star, Send } from 'lucide-react';

const ReviewForm = ({ productId, onSubmit, loading }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    onSubmit({
      product: productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    // Reset form
    setRating(0);
    setHover(0);
    setTitle('');
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hover || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Title */}
      <div className="mb-4">
        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title
        </label>
        <input
          type="text"
          id="reviewTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          maxLength={100}
        />
      </div>

      {/* Review Comment */}
      <div className="mb-4">
        <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="reviewComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
          required
          minLength={20}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || rating === 0 || !comment.trim()}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
