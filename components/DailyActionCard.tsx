import React, { useState, useEffect } from 'react';
import { DailyAction, DifficultyRating, Mood } from '../types';
import { Button } from './Button';
import { MOTIVATIONAL_QUOTES, CONTENT_PACKS } from '../constants';

interface DailyActionCardProps {
  action: DailyAction;
  onComplete: (reflection: string, difficulty: DifficultyRating, mood: Mood) => void;
  onSkip: () => void;
  onRest: () => void;
  isMinimalist: boolean;
}

const CelebrationParticles = () => {
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      backgroundColor: ['#4A5D4E', '#C48F7B', '#FCD34D'][Math.floor(Math.random() * 3)],
    };
    return (
      <div
        key={i}
        className="absolute bottom-0 w-2 h-2 rounded-full opacity-0 animate-[floatUp_1.5s_ease-out_forwards]"
        style={style}
      />
    );
  });
  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">{particles}</div>;
};

export const DailyActionCard: React.FC<DailyActionCardProps> = ({ action, onComplete, onSkip, onRest, isMinimalist }) => {
  const [viewState, setViewState] = useState<'initial' | 'reflecting' | 'done'>('initial');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyRating | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [reflection, setReflection] = useState('');
  const [randomQuote, setRandomQuote] = useState('');

  const pack = action.packId ? CONTENT_PACKS.find(p => p.id === action.packId) : null;

  useEffect(() => {
    if (viewState === 'done') {
      setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [viewState]);

  const containerClasses = isMinimalist
    ? "bg-white dark:bg-surfaceDark rounded-xl p-6 border-2 border-stone-100 dark:border-stone-800 flex flex-col items-center text-center transition-colors duration-300"
    : "bg-white dark:bg-surfaceDark rounded-[2rem] p-8 shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 flex flex-col items-center text-center transition-colors duration-300 relative overflow-hidden";

  // State: SKIPPED
  if (action.skipped) {
    return (
      <div className="flex flex-col h-full justify-center animate-fade-in">
        <div className={containerClasses}>
          <h2 className="text-3xl font-serif text-text dark:text-textDark mb-6">That's okay.</h2>
          <p className="text-lg text-textLight dark:text-textLightDark max-w-xs mb-8 leading-relaxed">
             Progress pauses — it doesn’t disappear. <br/>
             Be kind to yourself today.
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-600">
             See you tomorrow.
          </p>
        </div>
      </div>
    );
  }

  // State: REST DAY (Explicit "Not a Growth Day")
  if (action.isRestDay) {
    return (
      <div className="flex flex-col h-full justify-center animate-fade-in">
        <div className={`${containerClasses} border-blue-100 dark:border-blue-900/30`}>
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-3xl mb-6 text-blue-400">
            💤
          </div>
          <h2 className="text-3xl font-serif text-text dark:text-textDark mb-4">Rest Logged.</h2>
          <p className="text-lg text-textLight dark:text-textLightDark max-w-xs mb-6 leading-relaxed">
             "Rest is also a form of progress."
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-600">
             Your streak is safe. Recharge well.
          </p>
        </div>
      </div>
    );
  }

  // State: COMPLETED
  if (action.completed || viewState === 'done') {
      return (
        <div className="flex flex-col h-full justify-center items-center text-center animate-fade-in relative">
             {!isMinimalist && viewState === 'done' && <CelebrationParticles />}

             <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-4xl mb-6 relative z-10">
                ✓
            </div>
            <h2 className="text-3xl font-serif mb-2 text-text dark:text-textDark relative z-10">Well done.</h2>
            <p className="text-textLight dark:text-textLightDark relative z-10">See you tomorrow.</p>
            
            {randomQuote && viewState === 'done' && (
              <div className="mt-12 max-w-xs p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl relative z-10 animate-slide-up">
                <p className="text-sm italic text-stone-500 dark:text-stone-400 font-serif leading-relaxed">
                  "{randomQuote}"
                </p>
              </div>
            )}
        </div>
      )
  }

  // State: INITIAL VIEW
  if (viewState === 'initial') {
    return (
      <div className="flex flex-col h-full justify-center animate-fade-in">
        <div className={containerClasses}>
          
          {pack ? (
             <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {pack.name}
             </div>
          ) : (
             <div className="text-xs uppercase tracking-widest text-primary dark:text-primaryLight font-bold mb-4">Today's 1% Step</div>
          )}
          
          <h2 className="text-2xl font-serif text-text dark:text-textDark mb-4 leading-tight">
            {action.title}
          </h2>
          
          <p className="text-lg text-textLight dark:text-textLightDark mb-8 leading-relaxed">
            {action.description}
          </p>

          <div className="bg-stone-50 dark:bg-stone-800 px-4 py-2 rounded-full text-sm text-stone-500 dark:text-stone-400 mb-8 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {action.durationText}
          </div>

          <div className="w-full space-y-3 relative z-10">
            <Button onClick={() => setViewState('reflecting')} fullWidth variant="primary">
              I did it
            </Button>
            
            <button 
              onClick={onRest}
              className="w-full py-3 px-6 rounded-2xl font-sans font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              Today is not a growth day
            </button>
            
            <button 
              onClick={onSkip}
              className="w-full py-2 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
              Skip (no guilt)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: REFLECTING
  if (viewState === 'reflecting') {
    const moods = [
      { mood: Mood.CALM, emoji: '😌', label: 'Calm' },
      { mood: Mood.HAPPY, emoji: '🙂', label: 'Good' },
      { mood: Mood.NEUTRAL, emoji: '😐', label: 'Okay' },
      { mood: Mood.TIRED, emoji: '😴', label: 'Tired' },
      { mood: Mood.STRESSED, emoji: '😤', label: 'Stressed' },
    ];

    return (
      <div className="flex flex-col h-full animate-slide-up pb-8">
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xl font-serif text-center mb-6 mt-4 text-text dark:text-textDark">How difficult was it?</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-8">
            {[
              { label: 'Easy', value: DifficultyRating.TOO_EASY },
              { label: 'Good', value: DifficultyRating.JUST_RIGHT },
              { label: 'Hard', value: DifficultyRating.BIT_HARD },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDifficulty(opt.value)}
                className={`p-3 rounded-2xl border text-sm transition-all ${
                  selectedDifficulty === opt.value
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white dark:bg-surfaceDark text-text dark:text-textDark border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-serif text-center mb-4 text-text dark:text-textDark">How do you feel?</h3>
          <div className="flex justify-between mb-8 px-2">
            {moods.map((m) => (
              <button
                key={m.mood}
                onClick={() => setSelectedMood(m.mood)}
                className={`flex flex-col items-center transition-all ${selectedMood === m.mood ? 'scale-125' : 'opacity-70 hover:opacity-100'}`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[10px] uppercase tracking-wide text-textLight dark:text-textLightDark">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-8">
              <label className="block text-sm text-textLight dark:text-textLightDark mb-2 ml-1">Reflection (Optional)</label>
              <textarea 
                  placeholder="It felt easier than I expected..." 
                  className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-primary bg-white dark:bg-surfaceDark text-text dark:text-textDark h-24 resize-none placeholder-stone-400 dark:placeholder-stone-600"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
              />
          </div>
        </div>

        <Button 
          disabled={!selectedDifficulty || !selectedMood}
          onClick={() => {
            if (selectedDifficulty && selectedMood) {
                onComplete(reflection, selectedDifficulty, selectedMood);
                setViewState('done');
            }
          }} 
          fullWidth
        >
          Complete
        </Button>
      </div>
    );
  }

  return null;
};