'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotMessageSquare, PlusCircle, BookOpen, Clock, ChevronRight, Zap, ScrollText, Newspaper, TrendingUp, Sparkles } from 'lucide-react';
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
    <div className="p-4 md:p-8 animate-in fade-in duration-700 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col gap-1">
        <div className="text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Workspace Control
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
          {isAuthLoading ? <Skeleton className="h-10 w-64" /> : `G'day, ${user?.username}`}
        </h1>
        <p className="text-muted-foreground text-sm italic font-medium opacity-80 max-w-2xl">"The professional's workspace for turning sparks into cinema."</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-primary border-none overflow-hidden relative group rounded-2xl shadow-lg">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-105 transition-transform duration-700">
             <ScrollText className="w-24 h-24" />
           </div>
           <CardHeader className="relative z-10 p-6 pb-2">
              <CardTitle className="text-2xl md:text-3xl font-black text-white leading-tight">Manifest Your Vision</CardTitle>
              <CardDescription className="text-white/70 text-base max-w-xl font-medium">
                Launch the AI-Engine to generate scenes and character arcs in seconds.
              </CardDescription>
           </CardHeader>
           <CardContent className="relative z-10 p-6 pt-4">
              <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-6 h-10 text-sm font-bold shadow-md active:scale-95 transition-all">
                <Link href="/app/generate">
                  <PlusCircle className="mr-2 w-4 h-4" /> New Project
                </Link>
              </Button>
           </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card/40 glass border-foreground/5 rounded-2xl p-6 flex flex-col justify-center h-full">
            <CardHeader className="p-0 mb-4">
               <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                 <Zap className="w-3 h-3" /> Creative Pulse
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
               <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-0.5">
                    <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold group-hover:text-primary transition-colors">Total Scripts</div>
                    <div className="text-2xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-7 w-10" /> : scripts.length}
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary/30" />
               </div>
               <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-0.5">
                    <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold group-hover:text-primary transition-colors">Scene Count</div>
                    <div className="text-2xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-7 w-10" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                    </div>
                  </div>
                  <BotMessageSquare className="w-5 h-5 text-primary/30" />
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <h2 className="text-2xl font-black tracking-tight">Recent Masterpieces</h2>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 font-bold text-sm p-0 h-auto">
              <Link href="/app/library" className="flex items-center gap-1">
                View Library <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                  <Card className="bg-card/40 glass border-foreground/5 hover:border-primary/40 transition-all duration-500 hover:scale-[1.01] rounded-xl overflow-hidden h-full">
                    <CardHeader className="p-6 space-y-2">
                      <div className="flex justify-between items-center">
                         <Badge variant="outline" className="text-[7px] uppercase tracking-widest font-bold border-primary/30 text-primary px-1.5 py-0">{script.genre}</Badge>
                         <Clock className="w-2.5 h-2.5 text-muted-foreground/40" />
                      </div>
                      <CardTitle className="text-lg font-black truncate group-hover:text-primary transition-colors">{script.title}</CardTitle>
                      <CardDescription className="text-xs font-medium">{script.scenes.length} scenes</CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-2 border-t border-foreground/5 flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Updated {mounted ? new Date(script.updatedAt).toLocaleDateString() : '...'}</span>
                      <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-foreground/10 rounded-2xl bg-foreground/[0.01]">
               <div className="bg-primary/5 p-4 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-primary/30" />
               </div>
               <h3 className="text-xl font-black mb-1">The Archive is Silent</h3>
               <p className="text-muted-foreground text-sm mb-6 max-w-sm font-medium">Your future masterpieces are waiting. Let AI help you take the first step.</p>
               <Button asChild className="rounded-full px-8 h-10 text-sm font-bold bg-primary text-primary-foreground shadow-md">
                  <Link href="/app/generate">Create New Script</Link>
               </Button>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <h2 className="text-lg font-black tracking-tight border-b border-foreground/5 pb-4 flex items-center gap-2">
             <Newspaper className="w-3.5 h-3.5 text-primary" /> Industry Wire
          </h2>
          <div className="space-y-4">
             {[
               "The impact of AI on 2025 blockbusters.",
               "Why character continuity is the secret.",
               "Professional script formatting rules."
             ].map((news, i) => (
               <div key={i} className="space-y-0.5 group cursor-pointer">
                  <div className="text-[7px] font-bold text-primary uppercase tracking-widest">Trending</div>
                  <h4 className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">{news}</h4>
                  <div className="text-[9px] text-muted-foreground font-medium">4 min read</div>
               </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
