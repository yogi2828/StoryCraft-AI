'use client';

import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="h-20 w-20 rounded-full" />
              ) : (
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                  <AvatarFallback className="text-3xl">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1">
                 {isLoading ? (
                    <>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-48" />
                    </>
                 ) : (
                    <>
                        <h2 className="text-2xl font-semibold">{user?.username}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </>
                 )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              {isLoading ? <Skeleton className="h-16 w-full" /> : <p>{user?.bio || 'No bio set.'}</p>}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
              {isLoading ? <Skeleton className="h-5 w-40" /> : <p>{user ? new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) : '...'}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
