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
      {/* Cinematic Layered Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_130%)]" />

      {/* Floating Glowing Aura Bubbles */}
      <div className="absolute top-[10%] left-[15%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[120px] animate-bubble" />
      <div className="absolute top-[50%] left-[75%] w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-[150px] animate-bubble [animation-delay:6s]" />
      <div className="absolute bottom-[5%] left-[25%] w-[35rem] h-[35rem] bg-primary/5 rounded-full blur-[120px] animate-bubble [animation-delay:12s]" />

      {/* Drifting Geometric Shards */}
      <div className="absolute top-[15%] left-[8%] animate-float opacity-[0.03] scale-[2]">
        <Square className="w-64 h-64 text-accent rotate-12" />
      </div>
      <div className="absolute top-[70%] left-[80%] animate-float-slow opacity-[0.02] scale-[2.5]">
        <Square className="w-96 h-96 text-primary -rotate-45" />
      </div>

      {/* Cinematic Icons with Refined Motion */}
      <div className="absolute top-[25%] left-[12%] animate-float opacity-[0.08] dark:opacity-[0.06]">
        <Camera className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-[60%] right-[10%] animate-float-slow opacity-[0.07] dark:opacity-[0.05]">
        <Film className="w-16 h-16 text-accent" />
      </div>
      <div className="absolute bottom-[25%] left-[20%] animate-float opacity-[0.06] dark:opacity-[0.04]">
        <Clapperboard className="w-10 h-10 text-primary" />
      </div>
      <div className="absolute top-[40%] left-[45%] animate-pulse opacity-[0.08] dark:opacity-[0.06]">
        <Sparkles className="w-8 h-8 text-accent" />
      </div>
      <div className="absolute bottom-[20%] right-[20%] animate-float-slow opacity-[0.07] dark:opacity-[0.05]">
        <Video className="w-14 h-14 text-primary" />
      </div>

      {/* Light Shards Layer */}
      <div className="absolute -inset-[20%] opacity-[0.05] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:300%_300%] animate-drift" />
      </div>

      {/* Film Grain Texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}