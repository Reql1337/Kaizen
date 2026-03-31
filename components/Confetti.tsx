import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  useEffect(() => {
    if (active) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      // Use a recursive function with requestAnimationFrame for smoother performance
      let animationFrameId: number;

      const frame = () => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return;
        }

        const particleCount = 2; // Low count per frame is better than high count per interval

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });

        animationFrameId = requestAnimationFrame(frame);
      };

      frame();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        // This stops all current animations and removes the canvas
        confetti.reset();
      };
    }
  }, [active]);

  return null;
};