import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface InstallPromptProps {
  onInstall: () => void;
  isVisible: boolean;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onInstall, isVisible }) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[60] animate-slide-up">
      <div className="bg-white/95 dark:bg-surfaceDark/95 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-primary/20 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl">
          🌱
        </div>
        
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text dark:text-textDark">Install Kaizen</h3>
          <p className="text-[11px] text-textLight dark:text-textLightDark leading-tight">
            {isIOS ? 'Tap ⎋ then "Add to Home Screen"' : 'Get faster access & offline growth.'}
          </p>
        </div>

        {!isIOS && (
          <button 
            onClick={onInstall} 
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            Add
          </button>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const target = e.currentTarget.parentElement?.parentElement;
            if (target) target.style.display = 'none';
          }}
          className="p-1 text-stone-300 hover:text-stone-500"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};