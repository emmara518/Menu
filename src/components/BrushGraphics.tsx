import React from 'react';

export const YellowBrushUnderline: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#FFC400' }) => (
  <svg
    viewBox="0 0 260 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`w-full h-auto pointer-events-none ${className}`}
  >
    <path
      d="M8 19.5C58 9.2 148 4.8 252 10.5C214 14.8 118 18.2 26 24.5C15 25.1 5 22.8 8 19.5Z"
      fill={color}
    />
    <path
      d="M42 24.2C102 18.5 186 14.9 246 15.8C210 19.4 128 22.1 58 26.2L42 24.2Z"
      fill={color}
      opacity="0.85"
    />
  </svg>
);

export const YellowBrushSplash: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#FFC400' }) => (
  <svg
    viewBox="0 0 420 100"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M14 20C96 10 248 9 396 15C409 16 413 28 403 36C412 44 410 74 398 83C306 92 122 93 20 86C8 85 5 72 13 64C4 54 6 26 14 20Z"
      fill={color}
    />
    <path
      d="M2 38L20 33L14 48L2 45V38ZM402 22L418 17L414 33L399 29L402 22Z"
      fill={color}
      opacity="0.88"
    />
  </svg>
);

export const HeroYellowBrushSlash: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = '#FFC400' }) => (
  <svg
    viewBox="0 0 220 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M96 14C138 10 186 24 202 48C210 60 194 94 176 128C152 174 134 228 122 284C116 314 96 330 68 324C44 318 34 288 44 252C62 186 84 114 70 48C66 28 76 16 96 14Z"
      fill={color}
    />
    <path
      d="M30 224L52 214L44 246L22 242L30 224ZM186 38L212 30L204 56L180 50L186 38Z"
      fill={color}
      opacity="0.85"
    />
  </svg>
);

export const HeroCrimsonBrushSlash: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 240 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M12 106C54 68 122 34 206 16C222 13 232 28 220 44C178 88 112 126 38 144C14 150 0 120 12 106Z"
      fill="#D72626"
    />
    <path
      d="M196 12L232 6L222 28L192 22L196 12ZM4 128L28 118L22 142L2 138L4 128Z"
      fill="#D72626"
      opacity="0.85"
    />
  </svg>
);

export const CoffeeBeanGraphic: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <ellipse
      cx="24"
      cy="24"
      rx="15"
      ry="20"
      transform="rotate(-24 24 24)"
      fill="#4A2713"
      stroke="#8A522E"
      strokeWidth="1.5"
    />
    <path
      d="M18 9C25 17 21 27 29 38"
      stroke="#1A0D06"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <ellipse
      cx="18"
      cy="17"
      rx="4"
      ry="8"
      transform="rotate(-24 18 17)"
      fill="#7A4524"
      opacity="0.45"
    />
  </svg>
);

export const CornerBrushAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 280 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <path
      d="M0 96V58C44 48 112 34 184 18C222 10 256 4 280 0L256 22C212 38 158 56 110 74L168 62L144 82L96 96H0Z"
      fill="#0B0908"
    />
    <path
      d="M88 96C136 74 202 46 268 18L280 28C228 56 176 78 134 96H88Z"
      fill="#FFC400"
    />
    <path
      d="M150 96C188 79 232 58 272 38L280 46C244 65 206 83 176 96H150Z"
      fill="#D72626"
      opacity="0.88"
    />
  </svg>
);

export const PaperTearDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 480 48"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`w-full block pointer-events-none ${className}`}
  >
    {/* Subtle torn fiber edge shadow */}
    <path
      d="M0 48V24C16 20 27 25 43 23C62 20 71 14 91 17C109 19 124 27 146 21C166 15 182 10 206 15C228 19 241 25 266 18C289 12 303 9 327 16C348 22 365 26 388 19C410 12 426 15 446 20C461 23 471 19 480 17V48H0Z"
      fill="#DFC9AF"
      opacity="0.55"
    />
    {/* Primary irregular organic torn paper edge */}
    <path
      d="M0 48V28C14 23 29 29 46 25C64 21 75 17 94 21C112 24 127 30 149 24C171 18 185 13 209 19C231 24 244 27 269 21C291 15 306 13 329 20C351 26 367 28 391 22C412 16 428 19 448 23C463 26 472 22 480 20V48H0Z"
      fill="#F7E8D6"
    />
  </svg>
);

export const CoffeeCupIcon: React.FC<{
  className?: string;
  sizeScale?: 'small' | 'medium' | 'large';
}> = ({ className = 'w-6 h-6', sizeScale = 'medium' }) => {
  const scaleClass =
    sizeScale === 'small'
      ? 'scale-75'
      : sizeScale === 'large'
      ? 'scale-110'
      : 'scale-95';

  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${className} ${scaleClass} transition-transform`}
    >
      <path
        d="M5 10H20V16.5C20 20.09 17.09 23 13.5 23H11.5C7.91 23 5 20.09 5 16.5V10Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11.5H21.5C23.16 11.5 24.5 12.84 24.5 14.5C24.5 16.16 23.16 17.5 21.5 17.5H20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14C10.5 15 14.5 15 16.5 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
};

export const HeaderCoffeeSteamIcon: React.FC<{ className?: string }> = ({
  className = 'w-9 h-9 text-[#FFC400]',
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M13 8.5C13 6.8 14.2 6 14.2 4.5M18 8C18 6.3 19.2 5.5 19.2 4M23 8.5C23 6.8 24.2 6 24.2 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 14H25V21C25 24.87 21.87 28 18 28H15C11.13 28 8 24.87 8 21V14Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M25 15.5H27C28.66 15.5 30 16.84 30 18.5C30 20.16 28.66 21.5 27 21.5H25"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.5 30.5H26.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12 2.25C6.62 2.25 2.25 6.62 2.25 12C2.25 13.85 2.77 15.65 3.74 17.21L2.35 21.65L6.92 20.3C8.44 21.18 10.19 21.75 12 21.75C17.38 21.75 21.75 17.38 21.75 12C21.75 6.62 17.38 2.25 12 2.25Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9.4 8.6C9.15 8.1 8.88 8.08 8.65 8.07H8.02C7.79 8.07 7.42 8.16 7.11 8.5C6.8 8.84 5.93 9.65 5.93 11.31C5.93 12.97 7.14 14.57 7.31 14.79C7.48 15.02 9.65 18.54 13.09 19.9C15.95 21.03 16.53 20.8 17.15 20.74C17.77 20.69 19.16 19.92 19.44 19.12C19.72 18.33 19.72 17.65 19.64 17.5C19.55 17.36 19.33 17.28 18.99 17.11C18.65 16.94 16.98 16.12 16.67 16C16.36 15.89 16.14 15.83 15.91 16.17C15.68 16.51 15.03 17.28 14.83 17.5C14.63 17.73 14.43 17.76 14.09 17.59C13.75 17.42 12.66 17.06 11.36 15.9C10.35 15 9.67 13.89 9.47 13.55C9.27 13.21 9.45 13.03 9.62 12.86C9.77 12.71 9.96 12.46 10.13 12.26C10.3 12.06 10.35 11.92 10.47 11.69C10.58 11.46 10.52 11.27 10.44 11.1C10.35 10.93 9.7 9.24 9.4 8.6Z"
      fill="currentColor"
    />
  </svg>
);
