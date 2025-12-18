import React from 'react';
import { EnergyLevel } from '../types';
import { Button } from './Button';

interface EnergyCheckinProps {
  onSelect: (level: EnergyLevel) => void;
}

export const EnergyCheckin: React.FC<EnergyCheckinProps> = ({ onSelect }) => {
  const levels = [
    { 
      id: EnergyLevel.HIGH, 
      label: "Full Tank", 
      desc: "I'm ready for a challenge.", 
      icon: "⚡️",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-900"
    },
    { 
      id: EnergyLevel.NORMAL, 
      label: "Steady", 
      desc: "I can handle a normal step.", 
      icon: "🌱",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-900"
    },
    { 
      id: EnergyLevel.LOW, 
      label: "Low Energy", 
      desc: "I need something easy.", 
      icon: "☁️",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-900"
    },
    { 
      id: EnergyLevel.DEPLETED, 
      label: "Depleted", 
      desc: "I'm struggling today.", 
      icon: "❤️‍🩹",
      color: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700"
    },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in pt-safe-top">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-text dark:text-textDark mb-2">How is your energy?</h2>
        <p className="text-textLight dark:text-textLightDark text-lg">
          We'll adapt today's step to fit your capacity. <br/> No guilt, just honesty.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {levels.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 active:scale-95 group ${level.color} hover:brightness-95 dark:hover:brightness-110`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif text-xl font-bold">{level.label}</span>
              <span className="text-2xl group-hover:scale-110 transition-transform">{level.icon}</span>
            </div>
            <p className="opacity-80 text-sm">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};