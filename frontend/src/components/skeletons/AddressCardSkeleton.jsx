import Skeleton from '../Skeleton';

const AddressCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Skeleton variant="avatar" className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
        <Skeleton variant="button" className="h-8 w-8 rounded-full" />
      </div>
      
      {/* Address lines skeleton */}
      <div className="space-y-2 mb-3">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
      
      {/* Actions skeleton */}
      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
        <Skeleton variant="button" className="h-8 w-20" />
        <Skeleton variant="button" className="h-8 w-20" />
      </div>
    </div>
  );
};

export default AddressCardSkeleton;
