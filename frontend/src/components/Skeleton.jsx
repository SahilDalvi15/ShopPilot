const Skeleton = ({ className, variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded',
    image: 'h-48 w-full',
    card: 'h-64 w-full',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} />
  );
};

export default Skeleton;
