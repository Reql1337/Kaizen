
import { Domain, EnergyLevel } from './types';

export const PREMIUM_DOMAINS = [Domain.CAREER, Domain.ORGANIZATION];

// Added DOMAIN_DESCRIPTIONS to fix the error in Onboarding.tsx
export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  [Domain.HEALTH]: 'Physical vitality and body awareness.',
  [Domain.LEARNING]: 'Expanding knowledge and curiosity.',
  [Domain.MENTAL_CLARITY]: 'Focus, mindfulness, and peace.',
  [Domain.RELATIONSHIPS]: 'Connecting with others with intention.',
  [Domain.CAREER]: 'Professional growth and skill building.',
  [Domain.ORGANIZATION]: 'Structure and tidiness in your space.',
};

export const CONTENT_PACKS = [
  { 
    id: 'pack_mindfulness', 
    name: 'Mindfulness Sprint', 
    description: 'A 7-day sensory reset for clarity.',
    longDescription: 'Deepen your presence with curated sensory actions. A guided journey to reconnect with your senses.',
    price: '$4.99',
    icon: '🧘',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  },
  { 
    id: 'pack_creativity', 
    name: 'Creative Spark', 
    description: 'Unblock your inner artist flow.',
    longDescription: 'Tiny prompts to unblock your artistic flow using micro-creation techniques.',
    price: '$4.99',
    icon: '🎨',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
  { 
    id: 'pack_sleep', 
    name: 'Better Sleep', 
    description: 'Cozy rituals for a restful night.', 
    longDescription: 'Micro-rituals to signal your body that it is time to rest.',
    price: '$3.99',
    icon: '🌙',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
];

export const TASK_LIBRARY = [
  // Health - Normal
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.NORMAL, title: "Glass of Water", description: "Drink a full glass of water right now. Notice the temperature.", durationText: "1 min" },
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.NORMAL, title: "Shoulder Rolls", description: "Do 10 slow shoulder rolls forward and 10 backward.", durationText: "2 mins" },
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.NORMAL, title: "Sunlight Catch", description: "Stand by a window or step outside for 2 minutes of light.", durationText: "2 mins" },
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.NORMAL, title: "Post Check", description: "Notice if you are slouching and gently align your spine.", durationText: "30s" },
  
  // Health - High
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.HIGH, title: "Plank Hold", description: "Hold a plank for 30 seconds. Feel your core engage.", durationText: "1 min" },
  { domain: Domain.HEALTH, energyLevel: EnergyLevel.HIGH, title: "Stair Climb", description: "Walk up and down a flight of stairs twice.", durationText: "3 mins" },
  
  // Mental Clarity - Low/Depleted
  { domain: Domain.MENTAL_CLARITY, energyLevel: EnergyLevel.DEPLETED, title: "One Breath", description: "Take just one deep breath. Inhale for 4, exhale for 6.", durationText: "30s" },
  { domain: Domain.MENTAL_CLARITY, energyLevel: EnergyLevel.LOW, title: "Sky Gaze", description: "Look out a window and find one interesting cloud or bird.", durationText: "1 min" },
  { domain: Domain.MENTAL_CLARITY, energyLevel: EnergyLevel.NORMAL, title: "Digital De-clutter", description: "Delete 5 unnecessary photos from your camera roll.", durationText: "2 mins" },
  { domain: Domain.MENTAL_CLARITY, energyLevel: EnergyLevel.NORMAL, title: "Box Breathing", description: "Do 4 rounds of 4-4-4-4 breathing.", durationText: "2 mins" },

  // Relationships
  { domain: Domain.RELATIONSHIPS, energyLevel: EnergyLevel.NORMAL, title: "Quick Text", description: "Send a 'Thinking of you' text to one person.", durationText: "1 min" },
  { domain: Domain.RELATIONSHIPS, energyLevel: EnergyLevel.NORMAL, title: "Gratitude Note", description: "Tell someone one small thing you appreciate about them.", durationText: "2 mins" },

  // Career
  { domain: Domain.CAREER, energyLevel: EnergyLevel.NORMAL, title: "Clean Desktop", description: "Move 3 random files into their proper folders.", durationText: "3 mins" },
  { domain: Domain.CAREER, energyLevel: EnergyLevel.NORMAL, title: "Unsubscribe", description: "Find one promotional email and unsubscribe from it.", durationText: "1 min" },

  // Organization
  { domain: Domain.ORGANIZATION, energyLevel: EnergyLevel.NORMAL, title: "One Surface", description: "Clear everything off one small surface, like a nightstand.", durationText: "3 mins" },
  { domain: Domain.ORGANIZATION, energyLevel: EnergyLevel.LOW, title: "Trash Hunt", description: "Find 3 pieces of trash and throw them away.", durationText: "2 mins" },

  // Pack Specifics (Mock Journeys)
  { packId: 'pack_mindfulness', title: "Scent Check", description: "Find something with a scent. Describe it in one word.", durationText: "2 mins" },
  { packId: 'pack_mindfulness', title: "Texture Walk", description: "Touch 3 different surfaces in your room.", durationText: "2 mins" },
  { packId: 'pack_creativity', title: "Blind Contour", description: "Draw your hand without looking at the paper.", durationText: "3 mins" },
];

export const MOTIVATIONAL_QUOTES = [
  "Small steps don’t feel powerful day to day. But they add up quietly.",
  "You don't have to be perfect. You just have to show up.",
  "Rest is also a form of progress.",
  "One percent better is enough.",
];
