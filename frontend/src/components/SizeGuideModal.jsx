import React, { useState } from 'react';
import { X, Ruler, UserCircle } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose, onSelectSize }) => {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' or 'calculator'
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fit, setFit] = useState('regular'); // slim, regular, loose
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = () => {
    if (!height || !weight) return;
    const h = parseInt(height);
    const w = parseInt(weight);

    let size = 'M';
    
    // Simple mock algorithm
    if (h < 165) {
      size = w < 60 ? 'S' : w < 75 ? 'M' : 'L';
    } else if (h < 178) {
      size = w < 65 ? 'S' : w < 80 ? 'M' : w < 95 ? 'L' : 'XL';
    } else if (h < 185) {
      size = w < 70 ? 'M' : w < 85 ? 'L' : w < 100 ? 'XL' : 'XXL';
    } else {
      size = w < 80 ? 'L' : w < 95 ? 'XL' : 'XXL';
    }

    // Adjust based on fit preference
    if (fit === 'slim') {
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const idx = sizes.indexOf(size);
      if (idx > 0 && Math.random() > 0.5) { 
        // Just mock some logic to step down
      }
    } else if (fit === 'loose') {
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const idx = sizes.indexOf(size);
      if (idx < sizes.length - 1) {
        size = sizes[idx + 1];
      }
    }

    setRecommendedSize(size);
  };

  React.useEffect(() => {
    calculateSize();
  }, [height, weight, fit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Size Guide</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 transition p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => setActiveTab('chart')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'chart' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Size Chart
              </div>
              {activeTab === 'chart' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'calculator' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Find My Size
              </div>
              {activeTab === 'calculator' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          </div>

          {activeTab === 'chart' ? (
            <div>
              <p className="text-gray-600 dark:text-slate-400 mb-6 text-sm">Use this chart to find your correct size. Measurements are in inches.</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300">
                    <tr>
                      <th className="px-6 py-4 font-bold border-b border-gray-200 dark:border-slate-700">Size</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-200 dark:border-slate-700">Chest</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-200 dark:border-slate-700">Waist</th>
                      <th className="px-6 py-4 font-bold border-b border-gray-200 dark:border-slate-700">Hips</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 dark:bg-slate-900 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">S (Small)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">34 - 36</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">28 - 30</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">35 - 37</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-slate-900 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">M (Medium)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">38 - 40</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">32 - 34</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">39 - 41</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-slate-900 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">L (Large)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">42 - 44</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">36 - 38</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">43 - 45</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-slate-900 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">XL (X-Large)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">46 - 48</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">40 - 42</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">47 - 49</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-slate-900 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">XXL (2X-Large)</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">50 - 52</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">44 - 46</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">51 - 53</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Enter your details below and we'll calculate the best fitting size for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  How do you prefer your clothes to fit?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['slim', 'regular', 'loose'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFit(f)}
                      className={`py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                        fit === f
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {recommendedSize && (
                <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-2 uppercase tracking-wider">Your Recommended Size</p>
                  <div className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">{recommendedSize}</div>
                  <button 
                    onClick={() => {
                      if(onSelectSize) onSelectSize(recommendedSize);
                      onClose();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl transition shadow-md"
                  >
                    Apply Size {recommendedSize}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
