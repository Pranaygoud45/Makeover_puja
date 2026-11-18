import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function LazyImage({
  src,
  alt,
  className,
  aspectRatio,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  const wrapperStyle = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div
      className={cn('overflow-hidden bg-champagne/40', aspectRatio && 'relative')}
      style={wrapperStyle}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-600',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
}
