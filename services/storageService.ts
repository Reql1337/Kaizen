import { UserState, INITIAL_STATE } from '../types';

// In a real app, this would be an API call to a database (Postgres, Firebase, etc.)
// Here we use LocalStorage keyed by User ID to simulate a Cloud DB with async/await.

const getStorageKey = (userId: string) => `kaizen_db_${userId}`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const saveState = async (userId: string, state: UserState): Promise<void> => {
  try {
    // Simulate network latency for cloud saving
    await delay(300);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to Cloud DB", e);
  }
};

export const loadState = async (userId: string): Promise<UserState> => {
  try {
    // Simulate network latency for cloud retrieval
    await delay(800);
    const stored = localStorage.getItem(getStorageKey(userId));
    if (!stored) return { ...INITIAL_STATE };
    
    const parsed = JSON.parse(stored);
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.error("Failed to load state from Cloud DB", e);
    return { ...INITIAL_STATE };
  }
};