import React, { useState } from 'react';
import { Button } from './Button';
import { Logo } from './Logo';
import { User } from '../types';
import { loginWithGoogle, loginWithApple, loginWithPasskey, loginWithEmail } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
}

// --- Icons ---

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const FingerprintIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" />
    <path d="M5 15.1a8 8 0 0 1 1.6-4.5L12 12l2-1.6c1.6.8 3.5 2.6 4.3 4.7" />
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M12 21.3V18" />
    <path d="M20 10c1.5 1.5 2 3.5 2 6" />
    <path d="M2 10c-1.5 1.5-2 3.5-2 6" />
  </svg>
);

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [view, setView] = useState<'options' | 'email'>('options');

  const handleLogin = async (method: 'google' | 'apple' | 'passkey' | 'email') => {
    setLoading(true);
    try {
      let user: User;
      switch (method) {
        case 'google':
          user = await loginWithGoogle();
          break;
        case 'apple':
          user = await loginWithApple();
          break;
        case 'passkey':
          user = await loginWithPasskey();
          break;
        case 'email':
          if (!email) throw new Error("Email required");
          user = await loginWithEmail(email);
          break;
        default:
          throw new Error("Unknown method");
      }
      onLogin(user);
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const SocialButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 p-4 bg-white dark:bg-surfaceDark border border-stone-200 dark:border-stone-700 rounded-2xl text-text dark:text-textDark font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full justify-center px-6 animate-fade-in">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
        <Logo size="lg" />
        <div>
          <h1 className="text-4xl font-serif text-primary dark:text-primaryLight mb-2">Kaizen</h1>
          <p className="text-textLight dark:text-textLightDark">One small step, every day.</p>
        </div>

        {view === 'options' ? (
          <div className="w-full space-y-3 max-w-sm animate-slide-up">
            {/* Passkey - Hero Option */}
            <button 
              onClick={() => handleLogin('passkey')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primaryLight transition-all active:scale-[0.98] disabled:opacity-50 mb-6"
            >
              <FingerprintIcon />
              <span>Sign in with Passkey</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background dark:bg-backgroundDark text-stone-400">or continue with</span>
              </div>
            </div>

            <SocialButton 
              icon={<GoogleIcon />} 
              label="Google" 
              onClick={() => handleLogin('google')} 
            />
            <SocialButton 
              icon={<AppleIcon />} 
              label="Apple" 
              onClick={() => handleLogin('apple')} 
            />
            <SocialButton 
              icon={<EmailIcon />} 
              label="Email" 
              onClick={() => setView('email')} 
            />
            
            <p className="text-xs text-stone-400 dark:text-stone-600 mt-6 leading-relaxed">
              By continuing, you agree to our Terms of Service <br/> and Privacy Policy.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-4 animate-slide-up">
            <div className="text-left">
              <label className="text-sm font-medium text-text dark:text-textDark ml-1 mb-1 block">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-surfaceDark text-text dark:text-textDark focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
            </div>
            <Button 
              fullWidth 
              onClick={() => handleLogin('email')}
              disabled={!email || loading}
            >
              {loading ? 'Sending Magic Link...' : 'Continue'}
            </Button>
            <button 
              onClick={() => setView('options')}
              className="text-sm text-stone-400 hover:text-text dark:hover:text-textDark transition-colors"
            >
              Back to options
            </button>
          </div>
        )}
      </div>
    </div>
  );
};