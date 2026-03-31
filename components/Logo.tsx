import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isSm = size === 'sm';
  return (
    <div className={`relative flex items-center justify-center ${isSm ? 'w-10 h-10' : 'w-24 h-24'}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 400 400"
        className={`relative z-10 drop-shadow-xl transition-transform hover:scale-105 active:scale-95 ${isSm ? 'w-10 h-10' : 'w-24 h-24'}`}
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3f5a"/>
            <stop offset="100%" stopColor="#000000"/>
          </linearGradient>
          <linearGradient id="borderGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0"/>
            <stop offset="100%" stopColor="#d4af37"/>
          </linearGradient>
          <linearGradient id="percentSplit" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="47%" stopColor="#ffffff"/>
            <stop offset="47.1%" stopColor="#f5b82e"/>
            <stop offset="100%" stopColor="#f5b82e"/>
          </linearGradient>
          <clipPath id="glossClip">
            <rect x="24" y="24" width="352" height="352" rx="72"/>
          </clipPath>
        </defs>

        {/* Outline Border */}
        <rect x="20" y="20" width="360" height="360" rx="76" fill="url(#borderGrad)"/>
        
        {/* Main Background Inner */}
        <rect x="24" y="24" width="352" height="352" rx="72" fill="url(#bgGrad)"/>
        
        {/* Gloss highlight overlay */}
        <path d="M 0 0 L 400 0 L 400 180 Q 200 130 0 240 Z" fill="#ffffff" opacity="0.1" clipPath="url(#glossClip)"/>
        <path d="M 0 0 L 400 0 L 400 180 Q 200 130 0 240 Z" fill="#ffffff" opacity="0.05" clipPath="url(#glossClip)"/>

        {/* Text 1% */}
        <g transform="translate(45, 290)">
          <text x="0" y="0" fontFamily="'Inter', -apple-system, sans-serif" fontSize="240" fontWeight="900" fill="#ffffff" letterSpacing="-15">1</text>
          <text x="140" y="0" fontFamily="'Inter', -apple-system, sans-serif" fontSize="240" fontWeight="900" fill="url(#percentSplit)" letterSpacing="-10">%</text>
        </g>
      </svg>
    </div>
  );
};