import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Store, ShoppingBag } from 'lucide-react';
import vendorService from '../services/vendor.service';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const VendorStorePage = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await vendorService.getVendorStore(slug);
        setStoreData(data.data);
      } catch (error) {
        toast.error('Store not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading Store...</div>;
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white flex-col">
        <Store className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold">Store Not Found</h1>
        <p className="text-gray-500 mt-2">The store you are looking for does not exist or has been suspended.</p>
      </div>
    );
  }

  const { vendor, products } = storeData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16">
      
      {/* Banner */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        {vendor.banner && (
          <img src={vendor.banner} alt="Store Banner" className="w-full h-full object-cover opacity-80" />
        )}
      </div>

      {/* Store Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end md:space-x-6 text-center md:text-left mb-12 border border-gray-100 dark:border-slate-700">
          
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-white overflow-hidden shadow-sm flex-shrink-0 mb-4 md:mb-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.storeName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                <Store className="w-12 h-12 text-indigo-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{vendor.storeName}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">{vendor.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0 pb-2 flex flex-col items-center md:items-end">
            <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg font-medium">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {products.length} Products
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center md:text-right">
              Joined {new Date(vendor.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-slate-700">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products yet</h3>
            <p className="text-gray-500 mt-1">This store hasn't added any products to their catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorStorePage;
