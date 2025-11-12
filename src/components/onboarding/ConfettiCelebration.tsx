import React, { useEffect, useState } from 'react';

interface ConfettiCelebrationProps {
  show: boolean;
  onComplete?: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#FF6B9D'
];

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles: ConfettiParticle[] = [];
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          y: -10, // Start above viewport
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4, // Size between 4-12px
          duration: Math.random() * 2 + 2, // Duration between 2-4s
          delay: Math.random() * 0.5, // Random delay
        });
      }
      
      setParticles(newParticles);
      
      // Call onComplete after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      
      {/* Confetti particles */}
      {particles.map((particle) => {
        const randomX = (Math.random() - 0.5) * 2; // -1 to 1 for horizontal drift
        const initialRotation = Math.random() * 360;
        return (
          <div
            key={particle.id}
            className="absolute rounded-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              animation: `confettiFall ${particle.duration}s ${particle.delay}s ease-out forwards`,
              transform: `rotate(${initialRotation}deg)`,
              '--random-x': randomX,
            } as React.CSSProperties & { '--random-x': number }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiCelebration;

