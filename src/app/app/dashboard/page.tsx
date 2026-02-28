'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotMessageSquare, PlusCircle, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getScripts } from '@/lib/storage';
import type { Script } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="p-4 sm:p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          {isAuthLoading ? (
            <>
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-80" />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome, {user?.username}!
              </h1>
              <p className="text-muted-foreground text-lg">Your cinematic studio is ready.</p>
            </>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden group border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-24 h-24 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BotMessageSquare className="w-6 h-6 text-primary" />
                <span>Create Masterpiece</span>
              </CardTitle>
              <CardDescription>
                Ignite your next story with AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full sm:w-auto shadow-lg shadow-primary/20">
                <Link href="/app/generate">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Script
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                <span>Creative Pulse</span>
              </CardTitle>
              <CardDescription>
                Your progress metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : scripts.length}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Scripts</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Scenes</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
            {scripts.length > 0 && (
              <Button variant="ghost" asChild size="sm">
                <Link href="/app/library" className="flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`} className="group">
                  <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full relative">
                    <CardHeader>
                      <CardTitle className="truncate group-hover:text-primary transition-colors">{script.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{script.genre}</Badge>
                        <span>{script.scenes.length} Scenes</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(script.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BotMessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">Your library is empty.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/app/generate">Start your first script today</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "outline", className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${variant === 'outline' ? 'border-border' : 'bg-primary/10 text-primary border-primary/20'} ${className}`}>
      {children}
    </span>
  );
}