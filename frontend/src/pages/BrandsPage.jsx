import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { brandService } from '../services/brand.service';

const brandImages = {
  nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
  apple: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80',
  sony: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
  adidas: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
  boat: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80',
  oneplus: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
  puma: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80',
  techbrand: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
};

const BrandsPage = () => {
  const { data: brandsResponse, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getBrands(),
  });

  const brands = brandsResponse?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Star className="w-10 h-10 text-indigo-600" />
            Top Brands
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products from the world's leading brands. Quality you can trust.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center max-w-2xl mx-auto">
            Failed to load brands. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id || brand._id}
                to={`/products?brand=${brand.id || brand._id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
              >
                <div className="h-48 rounded-xl overflow-hidden mb-6 relative">
                  <img
                    src={brandImages[brand.slug] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-600 flex-grow">{brand.description}</p>
                
                <div className="mt-6 flex items-center gap-2 text-indigo-600 font-medium">
                  Shop {brand.name} Products
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
