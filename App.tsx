import React, { useState, useEffect, useRef } from 'react';
import { AppView, UserState, INITIAL_STATE, Domain, TimePreference, DailyAction, DifficultyRating, Mood, SubscriptionTier, User, EnergyLevel, PurchasedPack } from './types';
import { loadState, saveState } from './services/storageService';
import { getDailyActionOptions } from './services/taskService';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Onboarding } from './components/Onboarding';
import { DailyActionCard } from './components/DailyActionCard';
import { ProgressChart } from './components/ProgressChart';
import { HistoryList } from './components/HistoryList';
import { Store } from './components/Store';
import { Auth } from './components/Auth';
import { Logo } from './components/Logo';
import { EnergyCheckin } from './components/EnergyCheckin';
import { InstallPrompt } from './components/InstallPrompt';
import { Confetti } from './components/Confetti';
import { CONTENT_PACKS, PREMIUM_DOMAINS } from './constants';

// --- Type-safe Color Helpers ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 74, g: 93, b: 78 };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number) => {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const generatePalette = (hex: string) => {
  const base = hexToRgb(hex);
  const hsl = rgbToHsl(base.r, base.g, base.b);
  const primaryLightRgb = hslToRgb(hsl.h, hsl.s, Math.min(1, hsl.l + 0.15));
  const secH = (hsl.h + (30/360)) % 1;
  const secRgb = hslToRgb(secH, Math.min(1, hsl.s + 0.1), Math.min(1, hsl.l + 0.1));
  const secLightRgb = hslToRgb(secH, Math.min(1, hsl.s + 0.1), Math.min(1, hsl.l + 0.3));
  return {
    primary: `${base.r} ${base.g} ${base.b}`,
    primaryLight: `${primaryLightRgb.r} ${primaryLightRgb.g} ${primaryLightRgb.b}`,
    secondary: `${secRgb.r} ${secRgb.g} ${secRgb.b}`,
    secondaryLight: `${secLightRgb.r} ${secLightRgb.g} ${secLightRgb.b}`,
  };
};

const MIGRATION_MAP: Record<string, string> = { 
  default: '#4A5D4E', ocean: '#1E40AF', sunset: '#C2410C', 
  lavender: '#7E22CE', rose: '#BE123C', midnight: '#0F172A' 
};

interface ActionOption { title: string; description: string; durationText: string; }

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [loadingAction, setLoadingAction] = useState(false);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [greeting, setGreeting] = useState("Hello");
  const [needsEnergyCheck, setNeedsEnergyCheck] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(standalone);
    const handleBeforeInstallPrompt = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const triggerInstall = () => { if (installPrompt) { installPrompt.prompt(); installPrompt.userChoice.then((r: any) => { if (r.outcome === 'accepted') setInstallPrompt(null); }); } };

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('kaizen_current_user');
      if (stored) { 
        const user = JSON.parse(stored); 
        setCurrentUser(user); 
        await loadUserData(user.id); 
      } else {
        setCurrentView(AppView.AUTH);
      }
      setAuthChecked(true); isMounted.current = true;
    };
    init();
  }, []);

  const loadUserData = async (userId: string) => {
    setIsSyncing(true); const loaded = await loadState(userId);
    if (loaded.themeColor && !loaded.themeColor.startsWith('#')) loaded.themeColor = MIGRATION_MAP[loaded.themeColor] || '#4A5D4E';
    if (!loaded.themeColor) loaded.themeColor = '#4A5D4E';
    const now = new Date();
    if (loaded.lastActiveDate) { 
      const diff = (now.getTime() - new Date(loaded.lastActiveDate).getTime()) / (1000 * 3600 * 24); 
      if (diff > 3) setIsReturningUser(true); 
    }
    loaded.lastActiveDate = now.toISOString(); setUserState(loaded);
    setTimeout(() => { setIsSyncing(false); if (!loaded.hasOnboarded) setCurrentView(AppView.ONBOARDING); else setCurrentView(AppView.HOME); }, 400);
  };

  const handleLogin = async (user: User) => { localStorage.setItem('kaizen_current_user', JSON.stringify(user)); setCurrentUser(user); await loadUserData(user.id); };
  const handleLogout = () => { localStorage.removeItem('kaizen_current_user'); setCurrentUser(null); setUserState(INITIAL_STATE); setCurrentView(AppView.AUTH); };

  useEffect(() => { if (userState.theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [userState.theme]);
  
  useEffect(() => { 
    const pal = generatePalette(userState.themeColor || '#4A5D4E'); 
    const root = document.documentElement; 
    root.style.setProperty('--color-primary', pal.primary); 
    root.style.setProperty('--color-primary-light', pal.primaryLight); 
    root.style.setProperty('--color-secondary', pal.secondary); 
    root.style.setProperty('--color-secondary-light', pal.secondaryLight); 
  }, [userState.themeColor]);

  useEffect(() => { if (isMounted.current && currentUser && !isSyncing) saveState(currentUser.id, userState); }, [userState, currentUser, isSyncing]);

  useEffect(() => {
    if (isReturningUser) setGreeting("Welcome home."); else {
      const hour = new Date().getHours(); if (hour < 12) setGreeting("Good morning."); else if (hour < 18) setGreeting("Good afternoon."); else setGreeting("Good evening.");
    }
  }, [isReturningUser]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!userState.hasOnboarded || !userState.selectedDomain || isSyncing) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const existing = userState.actions.find(a => a.date === todayStr);
      if (existing) { setTodayAction(existing); setNeedsEnergyCheck(false); } else { setTodayAction(null); setNeedsEnergyCheck(true); }
    };
    if (currentView === AppView.HOME && userState.hasOnboarded && currentUser) checkStatus();
  }, [userState.hasOnboarded, userState.selectedDomain, currentView, currentUser, userState.actions, isSyncing]);

  const handleEnergySelect = async (level: EnergyLevel) => {
    setSelectedEnergy(level); setNeedsEnergyCheck(false); setLoadingAction(true);
    const recentTitles = userState.actions.slice(-10).map(a => a.title);
    
    setTimeout(() => {
      if (userState.selectedDomain) {
        const options = getDailyActionOptions(userState.selectedDomain, level, recentTitles, userState.activePackId);
        setActionOptions(options);
      }
      setLoadingAction(false);
    }, 800);
  };

  const handleOptionSelect = (option: ActionOption) => {
    if (!userState.selectedDomain) return; const todayStr = new Date().toISOString().split('T')[0];
    const newA: DailyAction = { id: crypto.randomUUID(), date: todayStr, title: option.title, description: option.description, durationText: option.durationText, completed: false, skipped: false, domain: userState.selectedDomain, packId: userState.activePackId || undefined, energyLevelAtGeneration: selectedEnergy || EnergyLevel.NORMAL };
    setUserState(prev => ({ ...prev, actions: [...prev.actions, newA] })); setTodayAction(newA); setActionOptions([]);
  };

  const handleOnboardingComplete = (domain: Domain, timePref: TimePreference, timeStr: string) => { setUserState(prev => ({ ...prev, hasOnboarded: true, selectedDomain: domain, timePreference: timePref, reminderTime: timeStr })); setCurrentView(AppView.HOME); };
  
  const handleActionComplete = (ref: string, diff: DifficultyRating, mood: Mood) => {
    if (!todayAction) return; let scoreChange = diff === DifficultyRating.TOO_EASY ? 5 : diff === DifficultyRating.BIT_HARD ? -5 : 0;
    const updated = { ...todayAction, completed: true, reflection: ref, difficultyRating: diff, mood };
    setUserState(prev => ({ ...prev, internalDifficultyScore: Math.max(0, Math.min(100, prev.internalDifficultyScore + scoreChange)), actions: [...prev.actions.filter(a => a.id !== todayAction.id), updated] })); setTodayAction(updated);
  };

  const handleActionSkip = () => { if (!todayAction) return; const updated = { ...todayAction, skipped: true }; setUserState(prev => ({ ...prev, actions: [...prev.actions.filter(a => a.id !== todayAction.id), updated] })); setTodayAction(updated); };
  
  const handleRestDay = () => { if (!todayAction) return; const updated: DailyAction = { ...todayAction, completed: true, isRestDay: true, title: "Rest Day", description: "Taking a conscious pause to recharge.", mood: Mood.CALM }; setUserState(prev => ({ ...prev, actions: [...prev.actions.filter(a => a.id !== todayAction.id), updated] })); setTodayAction(updated); };

  const handlePurchaseSubscription = (tier: SubscriptionTier) => {
    setUserState(prev => ({ ...prev, subscriptionTier: tier }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handlePurchasePack = (packId: string, name: string) => {
    const newPack: PurchasedPack = { id: packId, name, purchasedDate: new Date().toISOString() };
    setUserState(prev => ({ ...prev, purchasedPacks: [...prev.purchasedPacks, newPack] }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleActivatePack = (packId: string) => { setUserState(prev => ({ ...prev, activePackId: packId })); };
  const handleDeactivatePack = () => { setUserState(prev => ({ ...prev, activePackId: null })); };
  
  const handleTip = () => { 
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    alert("Thank you so much for your support! It means the world. 🌱"); 
  };

  const toggleTheme = () => setUserState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  
  const changeThemeColor = (color: string) => { 
    if (userState.subscriptionTier === SubscriptionTier.FREE) { 
      alert("Custom themes are a Premium feature."); 
      setCurrentView(AppView.STORE); 
      return; 
    } 
    setUserState(prev => ({ ...prev, themeColor: color })); 
  };

  const toggleMinimalist = () => setUserState(prev => ({ ...prev, isMinimalist: !prev.isMinimalist }));

  const handleDomainChange = (domain: Domain) => { 
    if (PREMIUM_DOMAINS.includes(domain) && userState.subscriptionTier === SubscriptionTier.FREE) { 
      alert("This focus area is for Premium members."); 
      setCurrentView(AppView.STORE); 
      return; 
    } 
    setUserState(prev => ({ ...prev, selectedDomain: domain }));
  };

  const handleTimeChange = (newTime: string) => { if (newTime) setUserState(prev => ({ ...prev, reminderTime: newTime })); };

  const formatTime12H = (time24: string | null) => {
    if (!time24) return "Not set";
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  if (!authChecked) return null;
  if (isSyncing) return (<Layout currentView={AppView.AUTH} onChangeView={() => {}}><div className="h-full flex flex-col justify-center items-center text-center p-8 animate-fade-in"><Logo size="lg" /><h2 className="text-2xl font-serif text-primary mt-8 mb-2">Syncing...</h2></div></Layout>);
  if (currentView === AppView.AUTH) return (<Layout currentView={AppView.AUTH} onChangeView={setCurrentView}><Auth onLogin={handleLogin} />{!isStandalone && <InstallPrompt onInstall={triggerInstall} isVisible={true} />}</Layout>);
  if (currentView === AppView.ONBOARDING) return <Layout currentView={AppView.ONBOARDING} onChangeView={setCurrentView}><Onboarding onComplete={handleOnboardingComplete} /></Layout>;

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      <Confetti active={showConfetti} />
      {currentView === AppView.HOME && (
        <div className="h-full flex flex-col pt-safe-top">
          {!isStandalone && needsEnergyCheck && !userState.isMinimalist && <InstallPrompt onInstall={triggerInstall} isVisible={true} />}
          {!needsEnergyCheck && actionOptions.length === 0 && (
             <div className="mb-4 mt-2 flex justify-between items-start">
               <div><h1 className="text-3xl font-serif text-primary dark:text-primaryLight animate-fade-in">{greeting}</h1><p className="text-textLight dark:text-textLightDark animate-fade-in">{userState.activePackId ? <span className="text-secondary font-bold">Active Journey</span> : (currentUser?.name ? `Hello, ${currentUser.name.split(' ')[0]}.` : "One small step.")}</p></div>
               {!userState.isMinimalist && <Logo size="sm" />}
             </div>
          )}
          {needsEnergyCheck && !loadingAction && <EnergyCheckin onSelect={handleEnergySelect} />}
          {loadingAction && (<div className="flex-1 flex flex-col justify-center items-center animate-pulse"><Logo size="lg" /><div className="text-primary dark:text-primaryLight text-xl font-serif mt-6">Looking within...</div></div>)}
          {!loadingAction && actionOptions.length > 0 && (
            <div className="flex-1 flex flex-col animate-slide-up"><h2 className="text-2xl font-serif text-text dark:text-textDark mb-4">Choose your path</h2><div className="space-y-4">{actionOptions.map((opt, i) => (<button key={i} onClick={() => handleOptionSelect(opt)} className="w-full bg-white dark:bg-surfaceDark p-6 rounded-3xl border border-stone-200 dark:border-stone-800 text-left hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm"><div className="text-[10px] uppercase font-bold text-stone-400 mb-2">Option {i+1}</div><h3 className="text-xl font-bold text-text dark:text-textDark mb-2">{opt.title}</h3><p className="text-textLight dark:text-textLightDark mb-3 leading-relaxed">{opt.description}</p><span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px] px-2 py-1 rounded-lg font-bold">{opt.durationText}</span></button>))}</div></div>
          )}
          {!loadingAction && todayAction && actionOptions.length === 0 && <DailyActionCard action={todayAction} onComplete={handleActionComplete} onSkip={handleActionSkip} onRest={handleRestDay} isMinimalist={userState.isMinimalist} />}
        </div>
      )}
      {currentView === AppView.PROGRESS && <div className="pt-safe-top h-full"><ProgressChart actions={userState.actions} isMinimalist={userState.isMinimalist} /></div>}
      {currentView === AppView.HISTORY && <div className="pt-safe-top"><HistoryList actions={userState.actions} subscriptionTier={userState.subscriptionTier} onUpgrade={() => setCurrentView(AppView.STORE)} /></div>}
      {currentView === AppView.STORE && <div className="pt-safe-top"><Store currentTier={userState.subscriptionTier} purchasedPacks={userState.purchasedPacks} activePackId={userState.activePackId} onPurchaseSubscription={handlePurchaseSubscription} onPurchasePack={handlePurchasePack} onActivatePack={handleActivatePack} onDeactivatePack={handleDeactivatePack} onTip={handleTip} /></div>}
      {currentView === AppView.SETTINGS && (
        <div className="animate-fade-in space-y-6 pt-safe-top pb-24">
            <h2 className="text-3xl font-serif text-text dark:text-textDark">Settings</h2>
            {!userState.isMinimalist && (<div onClick={() => setCurrentView(AppView.STORE)} className={`p-6 rounded-[2rem] border shadow-sm transition-colors cursor-pointer ${userState.subscriptionTier !== SubscriptionTier.FREE ? 'bg-secondary/10 border-secondary' : 'bg-primary/5 border-primary/10'}`}><div className="flex justify-between items-center mb-1"><h3 className="font-serif text-xl">{userState.subscriptionTier.replace('_', ' ')}</h3>{userState.subscriptionTier === SubscriptionTier.FREE && <span className="text-primary text-xs font-bold uppercase tracking-widest">Upgrade</span>}</div><p className="text-xs text-textLight">Access full history and content packs.</p></div>)}
            
            <div className="bg-white dark:bg-surfaceDark p-5 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
                <div className="border-b border-stone-50 dark:border-stone-800 pb-5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-3 tracking-widest">Focus Area</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Domain).map(d => {
                      const isLocked = PREMIUM_DOMAINS.includes(d) && userState.subscriptionTier === SubscriptionTier.FREE;
                      return (
                        <button 
                          key={d} 
                          onClick={() => handleDomainChange(d)} 
                          className={`text-[9px] p-2 rounded-xl border font-bold transition-all flex items-center justify-center gap-1 ${userState.selectedDomain === d ? 'bg-primary text-white border-primary shadow-sm' : 'bg-stone-50 dark:bg-stone-800 text-stone-400 border-transparent'}`}
                        >
                          {d} {isLocked && '🔒'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800 pb-5">
                  <span className="text-textLight dark:text-textLightDark text-sm">Reminders</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary">{formatTime12H(userState.reminderTime)}</span>
                    <input 
                      type="time" 
                      value={userState.reminderTime || "08:30"} 
                      onChange={(e) => handleTimeChange(e.target.value)} 
                      className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-xl cursor-pointer p-1" 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800 pb-5">
                  <span className="text-textLight dark:text-textLightDark text-sm">Theme</span>
                  <button onClick={toggleTheme} className={`w-11 h-6 rounded-full p-1 transition-colors ${userState.theme === 'dark' ? 'bg-primary' : 'bg-stone-200'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform ${userState.theme === 'dark' ? 'translate-x-5' : ''}`}></div>
                  </button>
                </div>

                <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800 pb-5">
                  <span className="text-textLight dark:text-textLightDark text-sm">Minimalist</span>
                  <button onClick={toggleMinimalist} className={`w-11 h-6 rounded-full p-1 transition-colors ${userState.isMinimalist ? 'bg-secondary' : 'bg-stone-200'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full transition-transform ${userState.isMinimalist ? 'translate-x-5' : ''}`}></div>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-textLight dark:text-textLightDark text-sm">App Color</span>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow-inner" style={{ backgroundColor: userState.themeColor || '#4A5D4E' }}></div>
                    <input type="color" value={userState.themeColor || '#4A5D4E'} onChange={(e) => changeThemeColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
            </div>

            {!isStandalone && !userState.isMinimalist && (
              <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-[2rem] border border-primary/10 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-stone-700 rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0">🌱</div>
                  <div>
                    <h3 className="font-serif text-sm">Install Kaizen</h3>
                    <p className="text-[10px] text-textLight">Get the full experience on your home screen.</p>
                  </div>
                </div>
                <Button onClick={triggerInstall} fullWidth variant="primary" className="py-2 text-sm">Add to Home Screen</Button>
              </div>
            )}

            <div className="pt-2"><Button variant="ghost" fullWidth onClick={handleLogout} className="text-stone-400 text-sm">Sign Out</Button></div>
        </div>
      )}
    </Layout>
  );
};
export default App;