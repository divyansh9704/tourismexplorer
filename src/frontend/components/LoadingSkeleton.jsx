import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </>
  );
};

export default LoadingSkeleton;
