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
    <div className="p-8 md:p-16 animate-in fade-in duration-1000 max-w-[100rem] mx-auto space-y-20">
      <header className="flex flex-col gap-4">
        <div className="text-primary text-xs font-black tracking-[0.5em] uppercase mb-2 flex items-center gap-3">
          <Sparkles className="w-3.5 h-3.5" /> Workspace Control
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
          {isAuthLoading ? <Skeleton className="h-20 w-96" /> : `G'day, ${user?.username}`}
        </h1>
        <p className="text-muted-foreground text-2xl italic font-medium opacity-80 max-w-3xl">"The professional's workspace for turning sparks into cinema. Your next masterpiece awaits."</p>
      </header>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Primary Action Card */}
        <Card className="lg:col-span-2 bg-primary border-none overflow-hidden relative group rounded-[4rem] shadow-3xl hover:scale-[1.01] transition-all duration-700">
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
             <ScrollText className="w-64 h-64" />
           </div>
           <CardHeader className="relative z-10 p-16 pb-10">
              <CardTitle className="text-5xl md:text-6xl font-black text-white leading-tight">Manifest Your Vision</CardTitle>
              <CardDescription className="text-white/70 text-2xl max-w-2xl font-medium mt-4">
                Launch the AI-Engine to generate complex scenes and professional character arcs in seconds.
              </CardDescription>
           </CardHeader>
           <CardContent className="relative z-10 p-16 pt-0">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-20 text-2xl font-black shadow-2xl active:scale-95 transition-all">
                <Link href="/app/generate">
                  <PlusCircle className="mr-3 w-5 h-5" /> New Project
                </Link>
              </Button>
           </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-10">
          <Card className="bg-card/40 glass border-foreground/5 rounded-[3.5rem] p-10 flex flex-col justify-center">
            <CardHeader className="p-0 mb-10">
               <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest text-primary">
                 <Zap className="w-5 h-5" /> Creative Pulse
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
               <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">Total Scripts</div>
                    <div className="text-5xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-12 w-16" /> : scripts.length}
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/30" />
               </div>
               <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">Scene Count</div>
                    <div className="text-5xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-12 w-16" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                    </div>
                  </div>
                  <BotMessageSquare className="w-8 h-8 text-primary/30" />
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Latest Feed & Projects */}
      <div className="grid gap-16 lg:grid-cols-4">
        <section className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-8">
            <h2 className="text-5xl font-black tracking-tight">Recent Masterpieces</h2>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 font-black text-xl p-0 h-auto">
              <Link href="/app/library" className="flex items-center gap-2">
                View Library <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-[3.5rem]" />)}
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                  <Card className="bg-card/40 glass border-foreground/5 hover:border-primary/40 transition-all duration-700 hover:scale-[1.02] rounded-[3.5rem] overflow-hidden">
                    <CardHeader className="p-10 space-y-4">
                      <div className="flex justify-between items-center">
                         <Badge variant="outline" className="text-[9px] uppercase tracking-[0.3em] font-black border-primary/30 text-primary px-3 py-1">{script.genre}</Badge>
                         <Clock className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                      <CardTitle className="text-3xl font-black truncate group-hover:text-primary transition-colors">{script.title}</CardTitle>
                      <CardDescription className="text-lg font-medium">{script.scenes.length} professional scenes</CardDescription>
                    </CardHeader>
                    <div className="p-10 pt-4 border-t border-foreground/5 flex justify-between items-center text-xs font-black text-muted-foreground uppercase tracking-widest">
                      <span>Updated {mounted ? new Date(script.updatedAt).toLocaleDateString() : '...'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-foreground/5 rounded-[4rem] bg-foreground/2">
               <div className="bg-primary/10 p-10 rounded-full mb-10">
                  <BookOpen className="w-16 h-16 text-primary/40" />
               </div>
               <h3 className="text-4xl font-black mb-4">The Archive is Silent</h3>
               <p className="text-muted-foreground text-xl mb-12 max-w-xl font-medium">Your future masterpieces are waiting to be manifested. Let AI help you take the first step into the silver screen.</p>
               <Button asChild size="lg" className="rounded-full px-16 h-20 text-2xl font-black bg-primary text-primary-foreground shadow-2xl">
                  <Link href="/app/generate">Create New Script</Link>
               </Button>
            </div>
          )}
        </section>

        {/* Industry Feed Placeholder */}
        <aside className="space-y-10">
          <h2 className="text-3xl font-black tracking-tight border-b border-foreground/5 pb-8 flex items-center gap-3">
             <Newspaper className="w-5 h-5 text-primary" /> Industry Wire
          </h2>
          <div className="space-y-8">
             {[
               "The impact of Generative AI on 2025's blockbusters.",
               "Why character continuity is the secret to TV success.",
               "New industry-standard PDF formatting rules released."
             ].map((news, i) => (
               <Card key={i} className="bg-transparent border-none p-0 space-y-2 group cursor-pointer">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Trending Now</div>
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{news}</h4>
                  <div className="text-xs text-muted-foreground font-medium">Read 4 min ago</div>
               </Card>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}