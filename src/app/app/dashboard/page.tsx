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
    <div className="p-6 md:p-12 animate-in fade-in duration-700 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col gap-2">
        <div className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Workspace Control
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
          {isAuthLoading ? <Skeleton className="h-12 w-64" /> : `G'day, ${user?.username}`}
        </h1>
        <p className="text-muted-foreground text-lg italic font-medium opacity-80 max-w-2xl">"The professional's workspace for turning sparks into cinema."</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Primary Action Card */}
        <Card className="lg:col-span-2 bg-primary border-none overflow-hidden relative group rounded-3xl shadow-xl hover:scale-[1.005] transition-all duration-500">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-105 transition-transform duration-700">
             <ScrollText className="w-32 h-32" />
           </div>
           <CardHeader className="relative z-10 p-10 pb-6">
              <CardTitle className="text-3xl md:text-4xl font-black text-white leading-tight">Manifest Your Vision</CardTitle>
              <CardDescription className="text-white/70 text-lg max-w-xl font-medium mt-2">
                Launch the AI-Engine to generate scenes and character arcs in seconds.
              </CardDescription>
           </CardHeader>
           <CardContent className="relative z-10 p-10 pt-0">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-14 text-lg font-bold shadow-xl active:scale-95 transition-all">
                <Link href="/app/generate">
                  <PlusCircle className="mr-2 w-4 h-4" /> New Project
                </Link>
              </Button>
           </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-6">
          <Card className="bg-card/40 glass border-foreground/5 rounded-3xl p-8 flex flex-col justify-center">
            <CardHeader className="p-0 mb-6">
               <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-primary">
                 <Zap className="w-4 h-4" /> Creative Pulse
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
               <div className="flex items-center justify-between p-6 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-1">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold group-hover:text-primary transition-colors">Total Scripts</div>
                    <div className="text-3xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-8 w-12" /> : scripts.length}
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary/30" />
               </div>
               <div className="flex items-center justify-between p-6 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all group">
                  <div className="space-y-1">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold group-hover:text-primary transition-colors">Scene Count</div>
                    <div className="text-3xl font-black text-foreground">
                       {isLoading ? <Skeleton className="h-8 w-12" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                    </div>
                  </div>
                  <BotMessageSquare className="w-6 h-6 text-primary/30" />
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-4">
        <section className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
            <h2 className="text-3xl font-black tracking-tight">Recent Masterpieces</h2>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 font-bold text-lg p-0 h-auto">
              <Link href="/app/library" className="flex items-center gap-1">
                View Library <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                  <Card className="bg-card/40 glass border-foreground/5 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden h-full">
                    <CardHeader className="p-8 space-y-3">
                      <div className="flex justify-between items-center">
                         <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold border-primary/30 text-primary px-2 py-0.5">{script.genre}</Badge>
                         <Clock className="w-3 h-3 text-muted-foreground/40" />
                      </div>
                      <CardTitle className="text-xl font-black truncate group-hover:text-primary transition-colors">{script.title}</CardTitle>
                      <CardDescription className="text-sm font-medium">{script.scenes.length} scenes</CardDescription>
                    </CardHeader>
                    <div className="p-8 pt-2 border-t border-foreground/5 flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Updated {mounted ? new Date(script.updatedAt).toLocaleDateString() : '...'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-foreground/10 rounded-3xl bg-foreground/[0.01]">
               <div className="bg-primary/5 p-8 rounded-full mb-8">
                  <BookOpen className="w-12 h-12 text-primary/30" />
               </div>
               <h3 className="text-2xl font-black mb-2">The Archive is Silent</h3>
               <p className="text-muted-foreground text-base mb-8 max-w-md font-medium">Your future masterpieces are waiting. Let AI help you take the first step.</p>
               <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-primary text-primary-foreground shadow-xl">
                  <Link href="/app/generate">Create New Script</Link>
               </Button>
            </div>
          )}
        </section>

        <aside className="space-y-8">
          <h2 className="text-xl font-black tracking-tight border-b border-foreground/5 pb-6 flex items-center gap-2">
             <Newspaper className="w-4 h-4 text-primary" /> Industry Wire
          </h2>
          <div className="space-y-6">
             {[
               "The impact of AI on 2025 blockbusters.",
               "Why character continuity is the secret to success.",
               "Professional screenplay formatting rules."
             ].map((news, i) => (
               <div key={i} className="space-y-1 group cursor-pointer">
                  <div className="text-[8px] font-bold text-primary uppercase tracking-widest">Trending</div>
                  <h4 className="text-base font-bold group-hover:text-primary transition-colors leading-tight">{news}</h4>
                  <div className="text-[10px] text-muted-foreground font-medium">4 min read</div>
               </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}