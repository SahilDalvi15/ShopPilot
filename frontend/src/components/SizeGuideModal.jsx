import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
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
      </div>
    </div>
  );
};

export default SizeGuideModal;
