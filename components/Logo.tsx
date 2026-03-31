import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isSm = size === 'sm';
  return (
    <div className={`relative flex items-center justify-center ${isSm ? 'w-10 h-10' : 'w-24 h-24'}`}>
      <img
        src="/logo.png"
        alt="Kaizen Logo"
        className={`relative z-10 drop-shadow-xl transition-transform hover:scale-105 active:scale-95 ${isSm ? 'w-10 h-10' : 'w-24 h-24'}`}
      />
    </div>
  );
};