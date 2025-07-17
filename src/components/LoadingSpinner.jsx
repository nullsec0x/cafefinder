import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="loading-spinner"></div>
      <p className="text-muted-foreground font-merriweather text-center">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;

