'use client';

import { Camera, Film, Clapperboard, Video, Sparkles, Square, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-background">
      {/* Cinematic Layered Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_120%)]" />

      {/* Floating Glowing Bubbles */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-bubble" />
      <div className="absolute top-[60%] left-[70%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-bubble [animation-delay:4s]" />
      <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-bubble [animation-delay:8s]" />

      {/* Kinetic Geometric Shards */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-[0.02] scale-150">
        <Square className="w-64 h-64 text-accent rotate-12" />
      </div>
      <div className="absolute top-[75%] left-[85%] animate-float-slow opacity-[0.01] scale-125">
        <Square className="w-96 h-96 text-primary -rotate-45" />
      </div>

      {/* Cinematic Icons with Smooth Motion */}
      <div className="absolute top-[20%] left-[15%] animate-float opacity-[0.05]">
        <Camera className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute top-[65%] right-[15%] animate-float-slow opacity-[0.04]">
        <Film className="w-24 h-24 text-accent" />
      </div>
      <div className="absolute bottom-[20%] left-[25%] animate-float opacity-[0.03]">
        <Clapperboard className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-[45%] left-[50%] animate-pulse opacity-[0.05]">
        <Sparkles className="w-10 h-10 text-accent" />
      </div>
      <div className="absolute bottom-[15%] right-[25%] animate-float-slow opacity-[0.04]">
        <Video className="w-20 h-20 text-primary" />
      </div>

      {/* Drifting Light Shards */}
      <div className="absolute -inset-[10%] opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:300%_300%] animate-drift" />
      </div>

      {/* Grain Texture for Film Look */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}