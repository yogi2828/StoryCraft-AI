'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/components/auth-provider';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      const username = values.email.split('@')[0];
      login(username, values.email);
      router.push('/app/dashboard');
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background relative overflow-hidden animate-in fade-in duration-1000">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <Card className="w-full max-w-md shadow-3xl border-white/5 glass rounded-[2.5rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary w-full animate-drift" />
        <CardHeader className="text-center space-y-4 p-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto shadow-xl shadow-primary/10 mb-2">
            <Logo className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-white/90 uppercase tracking-tight">Welcome Back 👋</CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg italic">
            Sign in to continue to StoryCraft AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.4em] font-black text-accent/70 ml-1">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} className="bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-2xl h-12 transition-all px-4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.4em] font-black text-accent/70 ml-1">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-2xl h-12 transition-all px-4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-14 font-black text-lg amber-glow transition-all active:scale-95 shadow-2xl" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-muted-foreground">Don&apos;t have an account?</span>{' '}
            <Link href="/register" className="underline text-accent font-black hover:text-accent/80 transition-colors ml-1">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}