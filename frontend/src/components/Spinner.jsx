import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-gray-200`}
        style={{ borderStyle: 'solid' }}
      />
      <div 
        className={`${sizeClasses[size]} rounded-full border-purple-600 absolute animate-spin`}
        style={{ borderStyle: 'solid', borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
      />
    </div>
  );
};

export default Spinner;
