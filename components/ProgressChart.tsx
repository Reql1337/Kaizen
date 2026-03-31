import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DailyAction } from '../types';

interface ProgressChartProps {
  actions: DailyAction[];
  isMinimalist: boolean;
}

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const improvement = (value - 100).toFixed(1);
    return (
      <div className="bg-white dark:bg-surfaceDark p-3 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800">
        <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">{label !== 'Future' ? `Step ${label}` : 'Projected Growth'}</div>
        <div className="flex items-baseline gap-1"><span className="text-xl font-serif text-primary dark:text-primaryLight">{improvement}%</span><span className="text-xs text-textLight dark:text-textLightDark">Growth</span></div>
      </div>
    );
  }
  return null;
};

export const ProgressChart: React.FC<ProgressChartProps> = ({ actions, isMinimalist }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'calendar'>('chart');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode === 'calendar' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [viewMode]);

  const { streak, completionRate, totalDays, level } = useMemo(() => {
    const completedDates = new Set(actions.filter(a => a.completed).map(a => a.date));
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (completedDates.has(today)) {
      currentStreak = 1; let check = new Date(Date.now() - 86400000);
      while (completedDates.has(check.toISOString().split('T')[0])) { currentStreak++; check.setDate(check.getDate() - 1); }
    } else if (completedDates.has(yesterday)) {
      currentStreak = 1; let check = new Date(Date.now() - 172800000);
      while (completedDates.has(check.toISOString().split('T')[0])) { currentStreak++; check.setDate(check.getDate() - 1); }
    }
    const total = actions.length;
    const completed = actions.filter(a => a.completed).length;
    return { streak: currentStreak, completionRate: total > 0 ? Math.round((completed / total) * 100) : 0, totalDays: completed, level: Math.floor(completed / 10) + 1 };
  }, [actions]);

  const chartData = useMemo(() => {
    let currentValue = 100; const points = [{ day: 0, value: 100, label: '0' }];
    const sorted = [...actions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach((action, index) => { if (action.completed) currentValue = currentValue * 1.01; points.push({ day: index + 1, value: Number(currentValue.toFixed(2)), label: `${index + 1}` }); });
    if (points.length < 5) for(let i=1; i<=3; i++) points.push({ day: points.length, value: Number((currentValue * Math.pow(1.01, i)).toFixed(2)), label: 'Future' });
    return points;
  }, [actions]);

  const calendarDays = useMemo(() => {
    const days = []; const total = 84; 
    for (let i = total - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); const dateStr = d.toISOString().split('T')[0];
      const action = actions.find(a => a.date === dateStr);
      days.push({ date: dateStr, dayOfMonth: d.getDate(), monthLabel: d.toLocaleDateString('default', { month: 'short' }), status: action ? (action.completed ? 'completed' : action.skipped ? 'skipped' : 'missed') : 'future', isToday: dateStr === new Date().toISOString().split('T')[0] });
    }
    return days;
  }, [actions]);

  const currentImprovement = chartData.length > 0 ? (chartData[chartData.length - (chartData.length > 5 ? 1 : 4)].value - 100).toFixed(1) : "0";

  const StatCard = ({ label, value, sub, emoji }: { label: string, value: string | number, sub?: string, emoji?: string }) => (
    <div className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${isMinimalist ? 'bg-white dark:bg-surfaceDark border-stone-200 dark:border-stone-800' : 'bg-white dark:bg-surfaceDark border-stone-100 dark:border-stone-800 shadow-sm'}`}>
       <div className="flex items-center gap-1.5 mb-2">
          {emoji && <span className="text-base leading-none translate-y-[0.5px]">{emoji}</span>}
          <span className="text-[10px] font-bold uppercase tracking-wider text-textLight dark:text-textLightDark">{label}</span>
       </div>
       <div>
         <div className="text-2xl font-serif text-text dark:text-textDark">{value}</div>
         {sub && <div className="text-[10px] text-textLight dark:text-textLightDark mt-1 font-medium">{sub}</div>}
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fade-in pb-4">
      <div className="flex justify-between items-end mb-6">
        <div><h2 className="text-3xl font-serif text-text dark:text-textDark mb-1">Your Growth</h2><p className="text-sm text-textLight dark:text-textLightDark">Level {level} • <span className="text-primary dark:text-primaryLight font-bold">{currentImprovement}%</span> Improved</p></div>
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button onClick={() => setViewMode('chart')} className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-white dark:bg-surfaceDark shadow-sm text-primary' : 'text-stone-400'}`}><ChartIcon /></button>
          <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-surfaceDark shadow-sm text-primary' : 'text-stone-400'}`}><CalendarIcon /></button>
        </div>
      </div>
      <div className={`flex-1 min-h-[280px] max-h-[320px] mb-6 flex flex-col relative overflow-hidden transition-all duration-500 ${isMinimalist ? 'rounded-xl border-2 border-stone-100 dark:border-stone-800' : 'bg-white dark:bg-surfaceDark rounded-[2.5rem] shadow-sm border border-stone-100 dark:border-stone-800 p-6'}`}>
        {viewMode === 'chart' ? (
          <div className="w-full h-full animate-fade-in">
             <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A5D4E" stopOpacity={0.3}/><stop offset="95%" stopColor="#4A5D4E" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} tickMargin={10}/><YAxis hide domain={['auto', 'auto']} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="rgb(var(--color-primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col animate-fade-in">
             <div className="flex justify-between items-center mb-4 px-2"><span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Growth History</span></div>
             <div ref={scrollRef} className="flex-1 grid grid-cols-7 gap-2 overflow-y-auto pr-2 scrollbar-hide overscroll-contain">
               {['S','M','T','W','T','F','S'].map((d, i) => (<div key={i} className="text-center text-[10px] font-bold text-stone-300 dark:text-stone-600 mb-1 sticky top-0 bg-white dark:bg-surfaceDark z-10">{d}</div>))}
               {calendarDays.map((day) => (<div key={day.date} className={`aspect-square rounded-full flex flex-col items-center justify-center text-[10px] font-medium transition-all relative ${day.status === 'completed' ? 'bg-primary text-white' : day.status === 'skipped' ? 'bg-stone-100 dark:bg-stone-800 text-stone-300' : day.status === 'missed' ? 'bg-stone-100 dark:bg-stone-800 text-stone-300' : 'bg-transparent text-stone-300 dark:text-stone-700'} ${day.isToday ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-backgroundDark' : ''}`}>{day.dayOfMonth === 1 && <span className="absolute -top-4 left-0 text-[8px] uppercase font-bold text-primary">{day.monthLabel}</span>}{day.dayOfMonth}</div>))}
             </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Streak" value={streak} sub="Days consistently" emoji="🔥" />
        <StatCard label="Total Steps" value={totalDays} sub="Action count" />
        <StatCard label="Consistency" value={`${completionRate}%`} sub="Success rate" />
        <StatCard label="Next Goal" value={level * 10} sub="Step milestone" />
      </div>
    </div>
  );
};