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
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { Logo } from '@/components/icons';

const formSchema = z
  .object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      login(values.username, values.email);
      router.push('/app/dashboard');
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background relative overflow-hidden animate-in fade-in duration-1000">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <Card className="w-full max-w-2xl shadow-3xl border-foreground/5 glass rounded-[4rem] overflow-hidden">
        <div className="h-2.5 bg-gradient-to-r from-accent via-primary to-accent w-full animate-drift" />
        <CardHeader className="text-center space-y-6 p-14 pb-10">
          <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mx-auto shadow-2xl shadow-primary/5 mb-2">
            <Logo className="w-14 h-14 text-primary" />
          </div>
          <CardTitle className="text-5xl font-black text-foreground uppercase tracking-tight leading-none text-center">Create Account ✨</CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-xl italic text-center">
            Start your screenwriting journey today.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-14 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-2 flex items-center gap-2">
                       <User className="w-3 h-3" /> Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} className="bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[2rem] h-16 transition-all px-8 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-2 flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} className="bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[2rem] h-16 transition-all px-8 text-lg" />
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
                    <FormLabel className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-2 flex items-center gap-2">
                       <Lock className="w-3 h-3" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[2rem] h-16 transition-all px-8 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-2 flex items-center gap-2">
                       <Lock className="w-3 h-3" /> Confirm
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[2rem] h-16 transition-all px-8 text-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="md:col-span-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-20 font-black text-2xl shadow-3xl transition-all active:scale-95 mt-4" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </Form>
          <div className="mt-12 text-center text-lg font-medium">
            <span className="text-muted-foreground">Already have an account?</span>{' '}
            <Link href="/login" className="underline text-primary font-black hover:text-primary/80 transition-colors ml-2">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}