'use client';

import { Camera, Film, Clapperboard, Video, Sparkles, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-background transition-colors duration-1000">
      {/* Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_120%)]" />

      {/* Floating Bubbles */}
      <div className="absolute top-[15%] left-[10%] w-[20rem] h-[20rem] bg-primary/5 rounded-full blur-[100px] animate-bubble" />
      <div className="absolute top-[60%] left-[80%] w-[25rem] h-[25rem] bg-accent/5 rounded-full blur-[120px] animate-bubble [animation-delay:4s]" />
      <div className="absolute bottom-[10%] left-[30%] w-[20rem] h-[20rem] bg-primary/3 rounded-full blur-[100px] animate-bubble [animation-delay:8s]" />

      {/* Geometric Shards */}
      <div className="absolute top-[20%] left-[5%] animate-float opacity-[0.02] scale-[1.5]">
        <Square className="w-48 h-48 text-accent rotate-12" />
      </div>
      <div className="absolute top-[75%] left-[85%] animate-float opacity-[0.015] scale-[2]">
        <Square className="w-64 h-64 text-primary -rotate-45" />
      </div>

      {/* Icons */}
      <div className="absolute top-[30%] left-[15%] animate-float opacity-[0.05] dark:opacity-[0.04]">
        <Camera className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute top-[65%] right-[15%] animate-float opacity-[0.04] dark:opacity-[0.03] [animation-delay:2s]">
        <Film className="w-10 h-10 text-accent" />
      </div>
      <div className="absolute bottom-[30%] left-[25%] animate-float opacity-[0.03] dark:opacity-[0.02] [animation-delay:4s]">
        <Clapperboard className="w-6 h-6 text-primary" />
      </div>
      <div className="absolute top-[45%] left-[50%] animate-pulse opacity-[0.05] dark:opacity-[0.04]">
        <Sparkles className="w-5 h-5 text-accent" />
      </div>
      <div className="absolute bottom-[25%] right-[25%] animate-float opacity-[0.04] dark:opacity-[0.03] [animation-delay:6s]">
        <Video className="w-9 h-9 text-primary" />
      </div>

      {/* Light Drift */}
      <div className="absolute -inset-[10%] opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-drift" />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.01] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}