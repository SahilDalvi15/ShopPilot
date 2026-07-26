import Skeleton from '../Skeleton';

const WishlistItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4">
      {/* Image skeleton */}
      <Skeleton variant="image" className="h-32 w-32 flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <Skeleton variant="title" className="h-5 w-3/4" />
        
        {/* Brand skeleton */}
        <Skeleton variant="text" className="h-3 w-1/4" />
        
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
        
        {/* Actions skeleton */}
        <div className="flex items-center space-x-2 pt-2">
          <Skeleton variant="button" className="h-9 w-28" />
          <Skeleton variant="button" className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};

export default WishlistItemSkeleton;
