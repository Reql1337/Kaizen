import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  
  // Animated Icons
  const HomeIcon = ({ active }: { active: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill={active ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
  
  const ChartIcon = ({ active }: { active: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-all duration-300 ${active ? 'scale-110 stroke-primary' : 'scale-100'}`}
    >
      <line x1="18" y1="20" x2="18" y2={active ? "8" : "10"} className="transition-all duration-500" />
      <line x1="12" y1="20" x2="12" y2={active ? "2" : "4"} className="transition-all duration-500 delay-75" />
      <line x1="6" y1="20" x2="6" y2={active ? "12" : "14"} className="transition-all duration-500 delay-150" />
    </svg>
  );

  const BookIcon = ({ active }: { active: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill={active ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );

  const ShopIcon = ({ active }: { active: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill={active ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-all duration-300 ${active ? 'scale-110 text-primary' : 'scale-100'}`}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );

  const SettingsIcon = ({ active }: { active: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-transform duration-500 ${active ? 'rotate-90 text-primary' : 'rotate-0'}`}
    >
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );

  return (
    <div className="h-[100dvh] w-full bg-background dark:bg-backgroundDark text-text dark:text-textDark flex flex-col font-sans max-w-md mx-auto relative shadow-2xl transition-colors duration-300 overflow-hidden">
      <main className="flex-1 p-6 pb-24 overflow-y-auto scrollbar-hide overscroll-none">
        {children}
      </main>

      {/* Bottom Navigation */}
      {currentView !== AppView.ONBOARDING && currentView !== AppView.AUTH && (
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-xl border-t border-gray-100 dark:border-stone-800 p-4 flex justify-around items-center z-50 transition-colors duration-300 pb-safe-area-bottom">
          <button 
            onClick={() => onChangeView(AppView.HOME)}
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${currentView === AppView.HOME ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
          >
            <HomeIcon active={currentView === AppView.HOME} />
          </button>
          <button 
            onClick={() => onChangeView(AppView.PROGRESS)}
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${currentView === AppView.PROGRESS ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
          >
            <ChartIcon active={currentView === AppView.PROGRESS} />
          </button>
          <button 
            onClick={() => onChangeView(AppView.HISTORY)}
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${currentView === AppView.HISTORY ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
          >
            <BookIcon active={currentView === AppView.HISTORY} />
          </button>
          <button 
            onClick={() => onChangeView(AppView.STORE)}
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${currentView === AppView.STORE ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
          >
            <ShopIcon active={currentView === AppView.STORE} />
          </button>
          <button 
            onClick={() => onChangeView(AppView.SETTINGS)}
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-95 ${currentView === AppView.SETTINGS ? 'text-primary bg-primary/10 dark:bg-primary/20' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}
          >
            <SettingsIcon active={currentView === AppView.SETTINGS} />
          </button>
        </nav>
      )}
    </div>
  );
};