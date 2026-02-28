'use client';

import { Camera, Film, Clapperboard, Video, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Dynamic Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.1)_0%,transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-[15%] left-[10%] animate-float opacity-10">
        <Camera className="w-24 h-24 text-primary" />
      </div>
      <div className="absolute top-[60%] right-[15%] animate-float-reverse opacity-10">
        <Film className="w-32 h-32 text-accent" />
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float opacity-10">
        <Clapperboard className="w-20 h-20 text-primary" />
      </div>
      <div className="absolute top-[40%] left-[45%] animate-pulse-slow opacity-10">
        <Sparkles className="w-16 h-16 text-accent" />
      </div>
      <div className="absolute bottom-[10%] right-[30%] animate-float-reverse opacity-10">
        <Video className="w-28 h-28 text-primary" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}

// Global Animations for floating
const style = typeof document !== 'undefined' ? document.createElement('style') : null;
if (style) {
  style.innerHTML = `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes float-reverse {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(20px) rotate(-5deg); }
    }
    .animate-float { animation: float 10s ease-in-out infinite; }
    .animate-float-reverse { animation: float-reverse 12s ease-in-out infinite; }
    .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  `;
  document.head.appendChild(style);
}
