import { useState } from 'react';
import { Star, Send, Sparkles } from 'lucide-react';

const ReviewForm = ({ productId, onSubmit, loading }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    onSubmit({
      productId,
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
    <form onSubmit={handleSubmit} className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${isFocused ? 'border-purple-300 ring-4 ring-purple-50' : 'border-gray-100'} p-8 transition-all duration-300 relative overflow-hidden`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full opacity-50 -z-10"></div>

      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Write a Review</h3>
      </div>
      
      {/* Star Rating */}
      <div className="mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Overall Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1.5 transition-all duration-300 hover:scale-125 hover:-rotate-12 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors duration-300 ${
                  star <= (hover || rating)
                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Title */}
      <div className="mb-5">
        <label htmlFor="reviewTitle" className="block text-sm font-bold text-gray-700 mb-2">
          Review Title
        </label>
        <input
          type="text"
          id="reviewTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Sum up your experience in one sentence"
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm placeholder:text-gray-400 font-medium"
          maxLength={100}
        />
      </div>

      {/* Review Comment */}
      <div className="mb-8">
        <label htmlFor="reviewComment" className="block text-sm font-bold text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="reviewComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What did you like or dislike? What should other shoppers know?"
          rows={4}
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm placeholder:text-gray-400 resize-none font-medium"
          required
          minLength={20}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs font-medium text-gray-500">
            Minimum 20 characters
          </p>
          <p className={`text-xs font-bold ${comment.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
            {comment.length}/500
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || rating === 0 || comment.trim().length < 20}
        className="relative w-full group disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-transform duration-300 group-hover:scale-105"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] transition-opacity duration-300"></div>
        <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
          <Send className={`w-5 h-5 ${!loading && 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300'}`} />
          {loading ? 'Submitting Review...' : 'Submit Review'}
        </div>
      </button>
    </form>
  );
};

export default ReviewForm;
