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
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none bg-background">
      {/* Dynamic Cinematic Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.2)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_100%)]" />

      {/* Floating Geometric Particles (Squares) */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-[0.03] scale-150">
        <Square className="w-64 h-64 text-accent rotate-12" />
      </div>
      <div className="absolute top-[70%] left-[80%] animate-float-slow opacity-[0.02] scale-125">
        <Square className="w-96 h-96 text-primary -rotate-45" />
      </div>
      <div className="absolute bottom-[5%] left-[40%] animate-float opacity-[0.04]">
        <Square className="w-32 h-32 text-accent rotate-45" />
      </div>

      {/* Cinematic Icons */}
      <div className="absolute top-[25%] left-[15%] animate-float opacity-[0.08]">
        <Camera className="w-20 h-20 text-primary" />
      </div>
      <div className="absolute top-[65%] right-[10%] animate-float-slow opacity-[0.08]">
        <Film className="w-28 h-28 text-accent" />
      </div>
      <div className="absolute bottom-[25%] left-[25%] animate-float opacity-[0.06]">
        <Clapperboard className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute top-[45%] left-[48%] animate-pulse opacity-[0.1]">
        <Sparkles className="w-12 h-12 text-accent" />
      </div>
      <div className="absolute bottom-[15%] right-[25%] animate-float-slow opacity-[0.08]">
        <Video className="w-24 h-24 text-primary" />
      </div>

      {/* Drifting Light Rays / Shards */}
      <div className="absolute -inset-[10%] opacity-[0.05] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:400%_400%] animate-drift" />
      </div>

      {/* Fine Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}