import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isSm = size === 'sm';
  return (
    <div className={`relative flex items-center justify-center ${isSm ? 'w-10 h-10' : 'w-24 h-24'}`}>
      {/* Background Circle */}
      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-slow"></div>
      
      {/* Plant Icon SVG */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`text-primary relative z-10 ${isSm ? 'w-6 h-6' : 'w-12 h-12'}`}
      >
        <path d="M12 22v-8" className="origin-bottom animate-[grow_1s_ease-out]" />
        <path d="M12 14a6 6 0 0 1 6-6" className="origin-bottom-left animate-[grow_1.2s_ease-out]" />
        <path d="M12 14a6 6 0 0 0-6-6" className="origin-bottom-right animate-[grow_1.4s_ease-out]" />
        <path d="M12 14c0-3 2-5 2-8h-4c0 3 2 5 2 8Z" className="origin-bottom animate-[fadeIn_2s_ease-out]" />
      </svg>
    </div>
  );
};