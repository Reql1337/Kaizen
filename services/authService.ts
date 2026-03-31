import { User } from '../types';

// Simulating a backend authentication delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginWithPasskey = async (): Promise<User> => {
  await delay(1500); // Simulate biometric scan time
  return {
    id: 'user_passkey_001',
    name: 'Passkey User',
    email: 'user@device.local',
    avatar: '🌱'
  };
};

export const loginWithGoogle = async (): Promise<User> => {
  await delay(1000); // Simulate popup redirect
  return {
    id: 'user_google_002',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    avatar: 'G'
  };
};

export const loginWithApple = async (): Promise<User> => {
  await delay(1000); // Simulate FaceID
  return {
    id: 'user_apple_003',
    name: 'Sarah Jones',
    email: 's.jones@icloud.com',
    avatar: ''
  };
};

export const loginWithEmail = async (email: string): Promise<User> => {
  await delay(800);
  return {
    id: `user_email_${btoa(email).substring(0, 8)}`,
    name: email.split('@')[0],
    email: email,
    avatar: email[0].toUpperCase()
  };
};

export const logout = async () => {
  await delay(500);
  // In a real app, this would clear tokens
};