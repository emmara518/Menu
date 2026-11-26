import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { TapRippleButton } from './MotionPrimitives';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: { ar: 'text-xl', en: 'text-[10px]' },
    md: { ar: 'text-2xl sm:text-3xl', en: 'text-[11px]' },
    lg: { ar: 'text-3xl sm:text-4xl', en: 'text-xs' },
  }[size];

  const content =
    siteConfig.brand.logoUrl && !imgError ? (
      <img
        src={siteConfig.brand.logoUrl}
        alt={`${siteConfig.brand.nameAr} - ${siteConfig.brand.fullNameEn}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="h-11 sm:h-12 w-auto object-contain relative z-10"
      />
    ) : (
      <span className="relative z-10 inline-flex flex-col items-center leading-none select-none">
        <span
          className={`${sizeClasses.ar} font-black tracking-tight text-[#F7E8D6] whitespace-nowrap`}
        >
          {siteConfig.brand.nameAr}
        </span>
        <span
          className={`${sizeClasses.en} font-latin font-bold tracking-wider text-[#F7E8D6]/90 mt-1 whitespace-nowrap`}
          dir="ltr"
        >
          {siteConfig.brand.nameEn}
        </span>
      </span>
    );

  if (onClick) {
    return (
      <TapRippleButton
        type="button"
        onClick={onClick}
        rippleTone="yellow"
        tapScale={0.94}
        className={`inline-flex items-center justify-center min-h-[44px] px-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC400] hover:bg-white/5 transition-colors cursor-pointer ${className}`}
        aria-label={`${siteConfig.brand.nameAr} — الصفحة الرئيسية`}
      >
        {content}
      </TapRippleButton>
    );
  }

  return <div className={`inline-flex items-center justify-center ${className}`}>{content}</div>;
};
