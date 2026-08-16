import { useSelector, useDispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRightLeft, Trash2 } from 'lucide-react';
import { selectCompareItems, removeFromCompare, clearCompare } from '../store/slices/compareSlice';

const CompareWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareItems = useSelector(selectCompareItems);

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/90 backdrop-blur-md shadow-2xl rounded-2xl border border-purple-100 p-4 pointer-events-auto transform transition-all duration-500 translate-y-0 opacity-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Selected Items */}
        <div className="flex items-center gap-4 flex-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-gray-200 dark:border-slate-700">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-gray-900 dark:text-slate-100 hidden sm:block">Compare</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
              {compareItems.length}/3
            </span>
          </div>

          <div className="flex gap-3">
            {compareItems.map((item) => (
              <div key={item.id} className="relative group shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <img 
                    src={item.images?.[0] || 'https://via.placeholder.com/150'} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => dispatch(removeFromCompare(item.id))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {/* Empty Slots */}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0"
              >
                <span className="text-gray-400 text-lg">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => dispatch(clearCompare())}
            className="flex items-center justify-center p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            title="Clear All"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/compare')}
            disabled={compareItems.length < 2}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Compare Now
            <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareWidget;
