import { Domain, EnergyLevel } from "../types";
import { TASK_LIBRARY } from "../constants";

interface ActionOption {
  title: string;
  description: string;
  durationText: string;
}

export interface PackContext {
  packName: string;
  dayNumber: number;
  contextPrompt: string;
}

export const getDailyActionOptions = (
  domain: Domain,
  energyLevel: EnergyLevel,
  recentActionTitles: string[],
  packId?: string | null
): ActionOption[] => {
  // 1. Filter by Domain or Pack
  let pool = packId 
    ? TASK_LIBRARY.filter(t => t.packId === packId)
    : TASK_LIBRARY.filter(t => t.domain === domain && !t.packId);

  // 2. Filter by Energy Level (allow lower energy tasks even if high energy, but not vice-versa)
  const energyMap = {
    [EnergyLevel.DEPLETED]: 1,
    [EnergyLevel.LOW]: 2,
    [EnergyLevel.NORMAL]: 3,
    [EnergyLevel.HIGH]: 4,
  };
  
  const userEnergyValue = energyMap[energyLevel];
  
  let energyAppropriatePool = pool.filter(t => {
    const taskEnergyValue = energyMap[t.energyLevel || EnergyLevel.NORMAL];
    return taskEnergyValue <= userEnergyValue;
  });

  // Fallback if pool is empty
  if (energyAppropriatePool.length === 0) {
    energyAppropriatePool = pool.length > 0 ? pool : TASK_LIBRARY.filter(t => t.domain === Domain.MENTAL_CLARITY);
  }

  // 3. Remove recently seen actions
  let freshPool = energyAppropriatePool.filter(t => !recentActionTitles.includes(t.title));
  if (freshPool.length < 2) freshPool = energyAppropriatePool;

  // 4. Shuffle and take 2
  const shuffled = [...freshPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2).map(t => ({
    title: t.title,
    description: t.description,
    durationText: t.durationText
  }));
};
