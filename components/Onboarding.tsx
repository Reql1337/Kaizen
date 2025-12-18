import React, { useState } from 'react';
import { Domain, TimePreference } from '../types';
import { Button } from './Button';
import { Logo } from './Logo';
import { DOMAIN_DESCRIPTIONS, PREMIUM_DOMAINS } from '../constants';

interface OnboardingProps {
  onComplete: (domain: Domain, timePref: TimePreference, timeStr: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('30');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  if (step === 1) {
    return (
      <div className="flex flex-col h-full justify-center items-center text-center animate-fade-in space-y-8">
        <Logo size="lg" />
        <h1 className="text-4xl font-serif text-primary dark:text-primaryLight">Kaizen</h1>
        <p className="text-xl text-textLight dark:text-textLightDark max-w-xs leading-relaxed">
          Welcome. You don’t need to change your life today. <br/>
          You just need one small step.
        </p>
        <div className="mt-8 w-full">
          <Button onClick={() => setStep(2)} fullWidth>Begin</Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col h-full justify-center text-left animate-slide-up space-y-6">
        <h2 className="text-3xl font-serif text-text dark:text-textDark mb-4">The Philosophy</h2>
        <div className="bg-white dark:bg-surfaceDark p-6 rounded-3xl shadow-sm border border-stone-50 dark:border-stone-800">
          <p className="text-lg text-textLight dark:text-textLightDark leading-relaxed">
            <span className="font-bold text-primary dark:text-primaryLight">Kaizen</span> (Japanese: 改善) means "improvement". <br/><br/>
            Positive results come from many small, continuous changes. <br/><br/>
            1% better every day adds up.
          </p>
        </div>
        <div className="mt-auto">
          <Button onClick={() => setStep(3)} fullWidth variant="secondary">That feels doable</Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col h-full pt-8 animate-slide-up">
        <h2 className="text-2xl font-serif text-text dark:text-textDark mb-2">Where would you like to grow?</h2>
        <p className="text-sm text-textLight dark:text-textLightDark mb-6">Choose one area. You can change this later.</p>
        <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
          {Object.values(Domain).map((domain) => {
            const isPremium = PREMIUM_DOMAINS.includes(domain);
            return (
              <button
                key={domain}
                onClick={() => !isPremium && setSelectedDomain(domain)}
                className={`w-full p-4 rounded-2xl text-left transition-all border relative ${
                  selectedDomain === domain 
                    ? 'bg-primary text-white border-primary shadow-lg scale-[1.02]' 
                    : isPremium 
                        ? 'bg-stone-50 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border-transparent cursor-not-allowed opacity-70' 
                        : 'bg-white dark:bg-surfaceDark text-text dark:text-textDark border-transparent hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {isPremium && <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider">🔒 Premium</div>}
                <div className="font-bold text-lg">{domain}</div>
                <div className={`text-sm mt-1 ${selectedDomain === domain ? 'text-white/90' : 'text-textLight dark:text-textLightDark'}`}>{DOMAIN_DESCRIPTIONS[domain]}</div>
              </button>
            )
          })}
        </div>
        <div className="pt-4"><Button onClick={() => setStep(4)} fullWidth disabled={!selectedDomain}>Continue</Button></div>
      </div>
    );
  }

  if (step === 4) {
    const formatTimeForState = () => {
      let h = parseInt(hour);
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return `${h.toString().padStart(2, '0')}:${minute}`;
    };

    return (
      <div className="flex flex-col h-full justify-center animate-slide-up text-center">
        <h2 className="text-3xl font-serif text-text dark:text-textDark mb-4">Set your pace.</h2>
        <p className="text-textLight dark:text-textLightDark mb-12">When should we nudge your next step?</p>
        
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
               <input 
                  type="number" value={hour} onChange={(e) => setHour(e.target.value.padStart(2, '0'))} min="1" max="12"
                  className="w-20 h-24 bg-white dark:bg-surfaceDark rounded-3xl border-2 border-stone-100 dark:border-stone-800 text-4xl font-serif text-center focus:border-primary focus:outline-none"
               />
               <span className="mt-2 text-[10px] font-bold uppercase text-stone-400">Hour</span>
            </div>
            <span className="text-4xl font-serif text-stone-300">:</span>
            <div className="flex flex-col items-center">
               <input 
                  type="number" value={minute} onChange={(e) => setMinute(e.target.value.padStart(2, '0'))} min="0" max="59"
                  className="w-20 h-24 bg-white dark:bg-surfaceDark rounded-3xl border-2 border-stone-100 dark:border-stone-800 text-4xl font-serif text-center focus:border-primary focus:outline-none"
               />
               <span className="mt-2 text-[10px] font-bold uppercase text-stone-400">Min</span>
            </div>
          </div>

          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
            <button 
              onClick={() => setPeriod('AM')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${period === 'AM' ? 'bg-white dark:bg-surfaceDark text-primary shadow-sm' : 'text-stone-400'}`}
            >
              AM
            </button>
            <button 
              onClick={() => setPeriod('PM')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${period === 'PM' ? 'bg-white dark:bg-surfaceDark text-primary shadow-sm' : 'text-stone-400'}`}
            >
              PM
            </button>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-2xl mb-12">
           <p className="text-sm text-primary dark:text-primaryLight font-medium italic">"A specific time builds a solid habit."</p>
        </div>

        <Button onClick={() => onComplete(selectedDomain!, TimePreference.CUSTOM, formatTimeForState())} fullWidth>Finish Setup</Button>
      </div>
    );
  }

  return null;
};