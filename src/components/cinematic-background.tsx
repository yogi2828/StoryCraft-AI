'use client';

import { Camera, Film, Square, Clapperboard, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
      {/* Moving Squares */}
      <Square className="absolute top-[10%] left-[5%] w-12 h-12 text-primary animate-float opacity-20" />
      <Square className="absolute bottom-[20%] right-[10%] w-24 h-24 text-accent animate-float-reverse opacity-10" />
      <Square className="absolute top-[60%] left-[15%] w-8 h-8 text-primary animate-float opacity-30" />
      
      {/* Movie Icons */}
      <Camera className="absolute top-[25%] right-[20%] w-16 h-16 text-accent animate-float-reverse opacity-20" />
      <Film className="absolute bottom-[15%] left-[25%] w-20 h-20 text-primary animate-float opacity-15" />
      <Clapperboard className="absolute top-[70%] right-[30%] w-14 h-14 text-accent animate-float opacity-25" />
      <Video className="absolute bottom-[40%] right-[5%] w-10 h-10 text-primary animate-float-reverse opacity-20" />
      
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-pulse-slow" />
    </div>
  );
}