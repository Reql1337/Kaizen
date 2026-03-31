import React, { useState } from 'react';
import { DailyAction, Mood, SubscriptionTier, EnergyLevel, DifficultyRating } from '../types';
import { Button } from './Button';

interface HistoryListProps {
  actions: DailyAction[];
  subscriptionTier: SubscriptionTier;
  onUpgrade: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ actions, subscriptionTier, onUpgrade }) => {
  const [selectedAction, setSelectedAction] = useState<DailyAction | null>(null);
  const isPremium = subscriptionTier !== SubscriptionTier.FREE;
  
  const completedActions = actions
    .filter(a => a.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visibleActions = isPremium ? completedActions : completedActions.slice(0, 5);
  const hiddenCount = Math.max(0, completedActions.length - 5);

  const getMoodEmoji = (mood?: Mood) => {
    switch (mood) {
      case Mood.CALM: return '😌';
      case Mood.HAPPY: return '🙂';
      case Mood.NEUTRAL: return '😐';
      case Mood.TIRED: return '😴';
      case Mood.STRESSED: return '😤';
      default: return '✨';
    }
  };

  const getEnergyIcon = (energy?: EnergyLevel) => {
    switch (energy) {
      case EnergyLevel.HIGH: return '⚡️';
      case EnergyLevel.NORMAL: return '🌱';
      case EnergyLevel.LOW: return '☁️';
      case EnergyLevel.DEPLETED: return '❤️‍🩹';
      default: return '🔋';
    }
  };

  return (
    <div className="animate-fade-in relative">
      <h2 className="text-3xl font-serif text-text dark:text-textDark mb-6">Journal</h2>
      
      {completedActions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-50 grayscale">📖</div>
          <p className="text-textLight dark:text-textLightDark">No completed steps yet.<br/>Your story begins with one step.</p>
        </div>
      ) : (
        <div className="space-y-4 relative">
          {visibleActions.map((action) => (
            <div 
              key={action.id} 
              onClick={() => setSelectedAction(action)}
              className="bg-white dark:bg-surfaceDark p-5 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                    {new Date(action.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="font-serif text-lg text-text dark:text-textDark leading-tight">{action.title}</h3>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner">
                  {getMoodEmoji(action.mood)}
                </div>
              </div>
              
              {action.reflection && (
                <div className="text-textLight dark:text-textLightDark text-sm italic line-clamp-1 opacity-70">
                  "{action.reflection}"
                </div>
              )}
            </div>
          ))}

          {!isPremium && hiddenCount > 0 && (
            <div className="relative pt-4 pb-8 text-center">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-transparent to-background dark:to-backgroundDark pointer-events-none"></div>
              <div className="relative z-10 bg-white dark:bg-surfaceDark p-6 rounded-3xl shadow-lg border border-primary/20 mx-4">
                 <p className="text-text dark:text-textDark font-serif mb-2">{hiddenCount} older entries hidden</p>
                 <Button onClick={onUpgrade} variant="secondary" fullWidth>Unlock History</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Detail Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-background/80 dark:bg-backgroundDark/80 backdrop-blur-md z-[100] p-6 flex flex-col items-center justify-center animate-fade-in" onClick={() => setSelectedAction(null)}>
          <div 
            className="w-full max-w-sm bg-white dark:bg-surfaceDark rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{selectedAction.domain}</span>
                <button onClick={() => setSelectedAction(null)} className="text-stone-400 hover:text-text dark:hover:text-textDark">✕</button>
              </div>

              <h3 className="text-3xl font-serif text-text dark:text-textDark mb-4 leading-tight">{selectedAction.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">Instruction</span>
                  <p className="text-textLight dark:text-textLightDark leading-relaxed">{selectedAction.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">Mood</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xl">{getMoodEmoji(selectedAction.mood)}</span>
                       <span className="text-sm font-medium">{selectedAction.mood || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 block">Energy at Start</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xl">{getEnergyIcon(selectedAction.energyLevelAtGeneration)}</span>
                       <span className="text-sm font-medium">{selectedAction.energyLevelAtGeneration?.toLowerCase() || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {selectedAction.reflection && (
                  <div className="p-5 bg-secondary/10 dark:bg-secondary/20 rounded-2xl border border-secondary/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2 block">Your Reflection</span>
                    <p className="text-text dark:text-textDark italic">"{selectedAction.reflection}"</p>
                  </div>
                )}

                <div className="flex justify-between text-xs text-stone-400 font-medium border-t border-stone-100 dark:border-stone-800 pt-4">
                  <span>Duration: {selectedAction.durationText}</span>
                  <span>{new Date(selectedAction.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-800 px-8 py-4 text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Growth Logged Successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};