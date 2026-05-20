import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';
import Skeleton from './Skeleton';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'player' | 'team';
  skeletonVariant?: 'circle' | 'card';
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackType = 'team',
  skeletonVariant = 'circle',
  ...props 
}: ImageWithFallbackProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 ${className}`}>
        {fallbackType === 'player' ? <User className="w-1/2 h-1/2" /> : <Shield className="w-1/2 h-1/2" />}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && <Skeleton variant={skeletonVariant} className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
