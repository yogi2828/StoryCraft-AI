'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotMessageSquare, PlusCircle, BookOpen, Clock, ChevronRight, Zap } from 'lucide-react';
import { getScripts } from '@/lib/storage';
import type { Script } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading) {
      setScripts(getScripts());
      setIsLoading(false);
    }
  }, [isAuthLoading]);

  const recentScripts = scripts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col gap-3">
          {isAuthLoading ? (
            <>
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-80" />
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
                Good evening, {user?.username}
              </h1>
              <p className="text-muted-foreground text-lg">Your cinematic studio is ready for the next draft.</p>
            </>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden group border-primary/20 bg-gradient-to-br from-primary/10 to-transparent hover:border-primary/40 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
              <BotMessageSquare className="w-32 h-32 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <PlusCircle className="w-6 h-6 text-primary" />
                <span>Start New Script</span>
              </CardTitle>
              <CardDescription className="text-base">
                Ignite your next story with AI co-writing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 rounded-full font-bold">
                <Link href="/app/generate">
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  Generate Script
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-5 h-5 text-accent" />
                <span>Creative Pulse</span>
              </CardTitle>
              <CardDescription>
                Live platform activity and metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 text-center">
                <div className="text-4xl font-black text-primary">
                  {isLoading ? <Skeleton className="h-10 w-12 mx-auto" /> : scripts.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold">Total Scripts</div>
              </div>
              <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 text-center">
                <div className="text-4xl font-black text-accent">
                  {isLoading ? <Skeleton className="h-10 w-12 mx-auto" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold">Total Scenes</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Projects</h2>
            {scripts.length > 0 && (
              <Button variant="ghost" asChild size="sm" className="hover:bg-primary/5">
                <Link href="/app/library" className="flex items-center gap-1">
                  View All Projects <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-44 rounded-3xl" />
                <Skeleton className="h-44 rounded-3xl" />
                <Skeleton className="h-44 rounded-3xl" />
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                  <Card className="hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 h-full relative overflow-hidden bg-card/40 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-primary/10 transition-colors" />
                    <CardHeader>
                      <CardTitle className="truncate group-hover:text-primary transition-colors text-xl">{script.title}</CardTitle>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold bg-muted/50">{script.genre}</Badge>
                        <span className="text-xs text-muted-foreground">{script.scenes.length} Scenes</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-[11px] text-muted-foreground gap-1.5 pt-4 border-t border-border/30">
                        <Clock className="w-3 h-3" />
                        Last active {new Date(script.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-muted/5 py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center mb-6">
                  <BotMessageSquare className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your library is waiting...</h3>
                <p className="text-muted-foreground max-w-sm mb-8">Every masterpiece starts with a single scene. Let's create yours.</p>
                <Button asChild size="lg" className="rounded-full px-10 font-bold">
                  <Link href="/app/generate">Start Your First Script</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}