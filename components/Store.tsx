import React, { useState } from 'react';
import { SubscriptionTier, PurchasedPack } from '../types';
import { Button } from './Button';
import { CONTENT_PACKS } from '../constants';

interface StoreProps {
  currentTier: SubscriptionTier;
  purchasedPacks: PurchasedPack[];
  activePackId: string | null;
  onPurchaseSubscription: (tier: SubscriptionTier) => void;
  onPurchasePack: (packId: string, name: string) => void;
  onActivatePack: (packId: string) => void;
  onDeactivatePack: () => void;
  onTip: () => void;
}

export const Store: React.FC<StoreProps> = ({ 
  currentTier, purchasedPacks, activePackId,
  onPurchaseSubscription, onPurchasePack, onActivatePack, onDeactivatePack, onTip 
}) => {
  const [viewingPackId, setViewingPackId] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState<SubscriptionTier | null>(null);
  const [showManageHub, setShowManageHub] = useState(false);
  const [showRetentionOffer, setShowRetentionOffer] = useState(false);

  const isPremium = currentTier !== SubscriptionTier.FREE;
  const isLifetime = currentTier === SubscriptionTier.LIFETIME;
  const ownedPackIds = new Set(purchasedPacks.map(p => p.id));
  
  const myPacks = CONTENT_PACKS.filter(p => ownedPackIds.has(p.id) || isLifetime);
  const availablePacks = CONTENT_PACKS.filter(p => !ownedPackIds.has(p.id) && !isLifetime);

  const handleCancelIntent = () => {
    setShowRetentionOffer(true);
  };

  const TierFeatureList = ({ tier }: { tier: SubscriptionTier }) => {
    const features = {
      [SubscriptionTier.WEEKLY_SPROUT]: [
        "Full AI Step Generation",
        "Journal History Unlocked",
        "6 Life Domains Access",
        "Ad-free Experience"
      ],
      [SubscriptionTier.PREMIUM_MONTHLY]: [
        "All Guided Journeys included ($15+ Value)",
        "Premium Visual Themes",
        "Priority AI Support",
        "Cloud Growth Backup"
      ],
      [SubscriptionTier.LIFETIME]: [
        "One payment, Forever Growth",
        "Every future Pack included",
        "Private Founder's Badge",
        "VIP Discord Community"
      ]
    };

    return (
      <ul className="space-y-2 mt-4 animate-fade-in px-1">
        {(features[tier as keyof typeof features] || []).map((f, i) => (
          <li key={i} className="text-[10px] flex items-center gap-2 text-stone-500 font-medium">
            <span className="text-secondary font-bold">✦</span> {f}
          </li>
        ))}
      </ul>
    );
  };

  // --- VIP Retention Modal ---
  if (showRetentionOffer) {
    return (
      <div className="absolute inset-0 bg-background dark:bg-backgroundDark z-[110] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-4xl mb-6">🎁</div>
        <h2 className="text-3xl font-serif text-text dark:text-textDark mb-4">Wait, we have a gift!</h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          We noticed you're thinking of leaving. As a valued VIP, we want to support your journey.
          <br/><br/>
          <span className="font-bold text-secondary">Keep your Premium benefits for 60% OFF</span> for the next 3 months!
        </p>
        <div className="w-full space-y-3">
          <Button onClick={() => setShowRetentionOffer(false)} fullWidth variant="secondary">Claim My 60% Discount</Button>
          <button 
            onClick={() => { alert("Membership ended. We hope to see you back soon."); window.location.reload(); }} 
            className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-4"
          >
            I still want to end my membership
          </button>
        </div>
      </div>
    );
  }

  // --- VIP Management Hub ---
  if (showManageHub) {
    return (
      <div className="animate-fade-in space-y-8 pb-24">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setShowManageHub(false)} className="p-2 text-stone-400">←</button>
          <h2 className="text-2xl font-serif">VIP Management</h2>
        </div>

        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 p-6 rounded-[2.5rem] border border-secondary/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-secondary mb-1">Current Status</p>
              <h3 className="text-xl font-bold">{currentTier.replace('_', ' ')}</h3>
            </div>
            <div className="w-10 h-10 bg-white dark:bg-surfaceDark rounded-xl flex items-center justify-center shadow-sm">👑</div>
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Next billing: {new Date(Date.now() + 2592000000).toLocaleDateString()}</span>
            <span className="font-bold text-secondary">Auto-renew ON</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-stone-400 px-4">Subscription Actions</p>
          <div className="bg-white dark:bg-surfaceDark rounded-[2rem] border border-stone-100 dark:border-stone-800 overflow-hidden divide-y divide-stone-50 dark:divide-stone-800">
             <button className="w-full p-5 text-left flex justify-between items-center group active:bg-stone-50 transition-colors">
               <span className="text-sm font-bold">Switch Plan</span>
               <span className="text-stone-300 group-hover:translate-x-1 transition-transform">→</span>
             </button>
             <button className="w-full p-5 text-left flex justify-between items-center group active:bg-stone-50 transition-colors">
               <span className="text-sm font-bold">Update Payment Method</span>
               <span className="text-stone-300">→</span>
             </button>
             <button 
               onClick={handleCancelIntent}
               className="w-full p-5 text-left flex justify-between items-center text-red-400 active:bg-red-50 transition-colors"
             >
               <span className="text-sm font-bold">Manage Renewal Settings</span>
               <span className="text-red-200">!</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Content Pack Details ---
  if (viewingPackId) {
    const pack = CONTENT_PACKS.find(p => p.id === viewingPackId);
    if (!pack) return null;
    const isOwned = ownedPackIds.has(pack.id) || isLifetime;
    const isActive = activePackId === pack.id;

    return (
      <div className="absolute inset-0 bg-background dark:bg-backgroundDark z-[100] flex flex-col h-full animate-slide-up">
        <div className={`h-64 w-full ${pack.color} flex items-center justify-center relative shrink-0 shadow-xl overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <button 
            onClick={() => setViewingPackId(null)} 
            className="absolute top-8 left-8 w-12 h-12 bg-white/40 backdrop-blur-3xl rounded-full flex items-center justify-center text-text shadow-2xl z-20 active:scale-90 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="text-9xl animate-bounce-subtle drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] z-10">{pack.icon}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 scrollbar-hide">
            <h2 className="text-4xl font-serif text-text dark:text-textDark leading-tight mb-4">{pack.name}</h2>
            {isActive ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white text-[10px] font-black rounded-full mb-8 uppercase tracking-widest shadow-lg shadow-secondary/20">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Currently Active
              </div>
            ) : isOwned ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full mb-8 uppercase tracking-widest">
                Journey Unlocked
              </div>
            ) : null}
            
            <p className="text-xl text-stone-600 dark:text-stone-400 font-serif italic mb-8 leading-relaxed">"{pack.description}"</p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-stone-500 dark:text-stone-500 leading-relaxed text-sm">{pack.longDescription}</p>
            </div>
        </div>

        <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-white/95 dark:bg-surfaceDark/95 backdrop-blur-2xl pb-12">
          {isOwned ? (
            isActive ? (
              <Button onClick={onDeactivatePack} fullWidth variant="outline" className="py-4 font-bold">Pause This Journey</Button>
            ) : (
              <Button onClick={() => { onActivatePack(pack.id); setViewingPackId(null); }} fullWidth variant="primary" className="py-4 font-bold text-lg">Restart Journey</Button>
            )
          ) : (
            <div className="flex flex-col gap-4">
              <Button onClick={() => onPurchasePack(pack.id, pack.name)} fullWidth variant="primary" className="py-4 text-xl shadow-2xl">Unlock Journey for {pack.price}</Button>
              <p className="text-center text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em]">Unlock for free with any VIP Membership</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- MAIN STORE VIEW ---
  return (
    <div className="animate-fade-in space-y-12 pb-32">
      <header className="flex justify-between items-center pt-4">
        <div>
          <h2 className="text-4xl font-serif text-text dark:text-textDark tracking-tight">VIP Club</h2>
          <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest mt-1">Exclusives & Benefits</p>
        </div>
        {isPremium && (
          <button 
            onClick={() => setShowManageHub(true)}
            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-primary transition-colors"
          >
            Manage Status
          </button>
        )}
      </header>

      {/* Active VIP Status Card */}
      {isPremium ? (
        <div className="relative p-8 rounded-[3rem] bg-gradient-to-br from-primary to-primaryLight text-white shadow-2xl shadow-primary/20 overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">VIP Membership</span>
                <h3 className="text-3xl font-serif mt-1">{currentTier.replace('_', ' ')}</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-2xl">👑</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                All 6 Life Domains Unlocked
              </div>
              <div className="flex items-center gap-2 text-xs font-medium opacity-90">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                Every Content Pack Free
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Membership Tiers for Free Users */
        <section className="space-y-6">
          <div className="grid gap-4">
            <MembershipCard tier={SubscriptionTier.WEEKLY_SPROUT} title="The Weekly Sprout" price="$1.99" sub="/ wk" expandedTier={expandedTier} setExpandedTier={setExpandedTier} onPurchase={onPurchaseSubscription} currentTier={currentTier} />
            <MembershipCard tier={SubscriptionTier.PREMIUM_MONTHLY} title="Premium Monthly" price="$4.99" sub="/ mo" color="primary" bestValue={true} expandedTier={expandedTier} setExpandedTier={setExpandedTier} onPurchase={onPurchaseSubscription} currentTier={currentTier} />
            <MembershipCard tier={SubscriptionTier.LIFETIME} title="Lifetime VIP" price="$59.99" sub="once" expandedTier={expandedTier} setExpandedTier={setExpandedTier} onPurchase={onPurchaseSubscription} currentTier={currentTier} />
          </div>
        </section>
      )}

      {/* Guided Journeys Library */}
      <section className="space-y-8">
        <div className="flex justify-between items-end px-2">
          <div>
            <h3 className="text-2xl font-serif text-text dark:text-textDark">Guided Journeys</h3>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Multi-day structured growth</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {CONTENT_PACKS.map(pack => {
            const isOwned = ownedPackIds.has(pack.id) || isLifetime;
            const isActive = activePackId === pack.id;
            return (
              <div 
                key={pack.id} 
                onClick={() => setViewingPackId(pack.id)}
                className={`group relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 active:scale-95 cursor-pointer overflow-hidden ${
                  isActive 
                    ? 'border-secondary bg-secondary/5' 
                    : 'border-stone-100 dark:border-stone-800 bg-white dark:bg-surfaceDark hover:border-primary/20 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-4xl shadow-xl transition-transform duration-500 group-hover:rotate-6 ${pack.color}`}>
                    {pack.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xl font-serif text-text dark:text-textDark leading-tight">{pack.name}</h4>
                      {isActive && <span className="text-[8px] font-black bg-secondary text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Active</span>}
                    </div>
                    <p className="text-xs text-stone-400 font-medium line-clamp-1">{pack.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isOwned ? 'text-primary' : 'text-secondary'}`}>
                        {isOwned ? 'Owned' : pack.price}
                      </span>
                      {!isOwned && <span className="text-[9px] text-stone-300">•</span>}
                      {!isOwned && <span className="text-[9px] text-stone-300 font-bold uppercase">Unlock Journey</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VIP Community / Support */}
      <section className="bg-stone-50 dark:bg-stone-900/50 p-10 rounded-[3.5rem] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
        <h3 className="text-2xl font-serif text-text dark:text-textDark">Support Our Vision</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs mx-auto">
          We believe growth should be calm, ad-free, and private. Tips help us keep Kaizen pure.
        </p>
        <div className="flex gap-4 justify-center pt-2">
            {[1, 5, 10].map(amount => (
              <button 
                key={amount}
                onClick={onTip} 
                className="group w-16 h-16 bg-white dark:bg-surfaceDark border-2 border-stone-100 dark:border-stone-800 rounded-3xl flex flex-col items-center justify-center hover:border-secondary hover:text-secondary hover:shadow-lg transition-all active:scale-90"
              >
                <span className="text-xs font-black">${amount}</span>
                <span className="text-[8px] font-bold text-stone-300 group-hover:text-secondary/50 uppercase mt-1">Tip</span>
              </button>
            ))}
        </div>
      </section>
    </div>
  );
};

// --- Helper Components ---

const MembershipCard = ({ tier, title, price, sub, bestValue, expandedTier, setExpandedTier, onPurchase, currentTier }: any) => {
  const isExpanded = expandedTier === tier;
  const isCurrent = currentTier === tier;

  return (
    <div 
      className={`relative overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer ${
        isCurrent
          ? 'border-secondary bg-secondary/5 shadow-inner'
          : isExpanded 
            ? 'border-primary shadow-2xl scale-[1.03] bg-white dark:bg-surfaceDark' 
            : 'border-stone-100 dark:border-stone-800 bg-white dark:bg-surfaceDark'
      }`}
      onClick={() => setExpandedTier(isExpanded ? null : tier)}
    >
      {bestValue && <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.2em]">Recommended</div>}
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`font-serif text-xl ${isCurrent ? 'text-secondary' : 'text-text dark:text-textDark'}`}>{title}</h4>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{sub}</span>
          </div>
        </div>
        {isCurrent && <div className="bg-secondary text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Active</div>}
      </div>

      {isExpanded && !isCurrent && (
        <div className="mt-6 pt-6 border-t border-stone-50 dark:border-stone-800 animate-slide-up">
          <p className="text-[9px] text-stone-400 font-black uppercase tracking-[0.2em] mb-4">Membership Benefits</p>
          <ul className="space-y-3 mb-8">
             <li className="flex items-center gap-3 text-xs font-medium text-stone-600">
               <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px]">✓</span>
               Full Journal History
             </li>
             <li className="flex items-center gap-3 text-xs font-medium text-stone-600">
               <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px]">✓</span>
               All Focus Domains
             </li>
             {tier !== SubscriptionTier.WEEKLY_SPROUT && (
               <li className="flex items-center gap-3 text-xs font-medium text-stone-600">
                 <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px]">✓</span>
                 All 3 Guided Journey Packs Included
               </li>
             )}
          </ul>
          <Button 
            onClick={(e) => { e.stopPropagation(); onPurchase(tier); }} 
            variant={bestValue ? 'primary' : 'outline'} 
            fullWidth 
            className="py-4 font-bold text-sm shadow-xl"
          >
            Upgrade to {title}
          </Button>
        </div>
      )}
    </div>
  );
};