import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface MenuImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
  priority?: boolean;
  transparentBg?: boolean;
}

export const MenuImage: React.FC<MenuImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackLabel,
  priority = false,
  transparentBg = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const hasExplicitPosition = /\b(absolute|fixed|sticky)\b/.test(className);
  const positionClass = hasExplicitPosition ? '' : 'relative';
  const bgClass = transparentBg ? 'bg-transparent' : 'bg-[#141210]';

  if (failed) {
    return (
      <div
        className={`${positionClass} flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1610] via-[#12100E] to-[#0B0B0B] text-[#FFC400]/75 border border-white/10 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-7 h-7 mb-1.5" strokeWidth={1.75} />
        {fallbackLabel && (
          <span className="text-[11px] font-medium text-[#F7E8D6]/70 px-2 text-center line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`${positionClass} overflow-hidden ${bgClass} ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#1B1815] to-[#0B0B0B] animate-pulse"
        />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
