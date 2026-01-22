'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BotMessageSquare, PlusCircle, BookOpen } from 'lucide-react';
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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          {isAuthLoading ? (
            <>
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-6 w-80 mt-2" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username}!</h1>
              <p className="text-muted-foreground">Here's what's new in your studio.</p>
            </>
          )}
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BotMessageSquare className="w-6 h-6 text-primary" />
                <span>New Script</span>
              </CardTitle>
              <CardDescription>
                Start a new screenplay with the help of AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/app/generate">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Script
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Statistics</span>
              </CardTitle>
              <CardDescription>
                Your creative progress at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : scripts.length}</p>
                <p className="text-sm text-muted-foreground">Total Scripts</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : scripts.reduce((acc, s) => acc + s.scenes.length, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Scenes</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Recent Scripts</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentScripts.map((script) => (
                <Link key={script.id} href={`/app/scripts/${script.id}`}>
                  <Card className="hover:border-primary/80 transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="truncate">{script.title}</CardTitle>
                      <CardDescription>{script.scenes.length} scene{script.scenes.length !== 1 && 's'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Last updated {new Date(script.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven't created any scripts yet.</p>
                <Button variant="link" asChild><Link href="/app/generate">Generate one now!</Link></Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
