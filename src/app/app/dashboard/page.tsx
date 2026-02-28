'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotMessageSquare, PlusCircle, BookOpen, Clock, ChevronRight, Zap, ScrollText } from 'lucide-react';
import { getScripts } from '@/lib/storage';
import type { Script } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthLoading) {
      setScripts(getScripts());
      setIsLoading(false);
    }
  }, [isAuthLoading]);

  const recentScripts = scripts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-1000 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col gap-2">
        <div className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-2">Workspace</div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {isAuthLoading ? <Skeleton className="h-12 w-64" /> : `Welcome, ${user?.username}`}
        </h1>
        <p className="text-muted-foreground text-lg italic">"Every great script starts with a single line of code... and imagination."</p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Primary Action Card */}
        <Card className="md:col-span-2 bg-primary border-white/10 overflow-hidden relative group hover:shadow-[0_0_50px_-12px_hsl(var(--primary))] transition-all duration-500">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <ScrollText className="w-48 h-48" />
           </div>
           <CardHeader className="relative z-10 pt-10 px-10">
              <CardTitle className="text-3xl md:text-4xl">Draft Your Masterpiece</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-lg max-w-md">
                Launch the AI engine to generate complex scenes and character arcs instantly.
              </CardDescription>
           </CardHeader>
           <CardContent className="relative z-10 pb-10 px-10">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-bold h-14">
                <Link href="/app/generate">
                  <PlusCircle className="mr-2 h-5 w-5" /> New Script Project
                </Link>
              </Button>
           </CardContent>
        </Card>

        {/* Stats Column */}
        <Card className="bg-card/50 border-white/5 backdrop-blur-sm flex flex-col justify-center">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-xl font-bold">
               <Zap className="w-5 h-5 text-accent" /> Creative Pulse
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Scripts</div>
                <div className="text-3xl font-bold text-accent">
                   {isLoading ? <Skeleton className="h-8 w-10" /> : scripts.length}
                </div>
             </div>
             <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Total Scenes</div>
                <div className="text-3xl font-bold text-accent">
                   {isLoading ? <Skeleton className="h-8 w-10" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                </div>
             </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold tracking-tight">Recent Projects</h2>
          <Button variant="link" asChild className="text-accent hover:text-accent/80 font-bold p-0">
            <Link href="/app/library" className="flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : recentScripts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {recentScripts.map((script) => (
              <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                <Card className="bg-card/40 border-white/5 hover:border-accent/30 transition-all duration-500 hover:bg-card/60">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                       <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-accent/20 text-accent">{script.genre}</Badge>
                       <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="truncate group-hover:text-accent transition-colors text-2xl font-bold">{script.title}</CardTitle>
                    <CardDescription>{script.scenes.length} professional scenes</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                    <span>Updated {mounted ? new Date(script.updatedAt).toLocaleDateString() : '...'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
             <div className="bg-secondary/50 p-6 rounded-full mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground/40" />
             </div>
             <h3 className="text-2xl font-bold mb-2">The Archive is Empty</h3>
             <p className="text-muted-foreground mb-8 max-w-md">Your future masterpieces are waiting to be written. Let AI help you take the first step.</p>
             <Button asChild size="lg" className="rounded-full px-10 font-bold bg-accent text-accent-foreground">
                <Link href="/app/generate">Create New Script</Link>
             </Button>
          </div>
        )}
      </section>
    </div>
  );
}
