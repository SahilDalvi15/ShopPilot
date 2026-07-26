import Skeleton from '../Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton variant="image" className="h-48 w-full" />
      
      <div className="p-4 space-y-3">
        {/* Brand skeleton */}
        <Skeleton variant="text" className="h-3 w-1/4" />
        
        {/* Title skeleton */}
        <Skeleton variant="title" className="h-5 w-3/4" />
        
        {/* Rating skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton variant="text" className="h-3 w-12" />
          <Skeleton variant="text" className="h-3 w-16" />
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton variant="text" className="h-5 w-20" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton variant="button" className="h-10 w-full mt-2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
