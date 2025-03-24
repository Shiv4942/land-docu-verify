
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className }) => {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-radial from-blue-50/40 to-transparent opacity-70" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/30 animate-float blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-indigo-100/20 animate-float animation-delay-1000 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-sky-100/30 animate-pulse-slow blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #9ca3af 1px, transparent 1px), linear-gradient(to bottom, #9ca3af 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
