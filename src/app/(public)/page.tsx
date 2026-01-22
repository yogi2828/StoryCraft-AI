import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare, Edit, FileDown } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const features = [
    {
      icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Generation',
      description: 'Instantly generate complete screenplay scenes from a simple plot idea. Let AI handle the heavy lifting.',
      image: PlaceHolderImages.find(img => img.id === 'feature-generate'),
    },
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: 'Deep Scene Editing',
      description: 'Take full control. Edit every detail of your scene, from dialogue to description, or let AI regenerate it for you.',
      image: PlaceHolderImages.find(img => img.id === 'feature-edit'),
    },
    {
      icon: <FileDown className="h-8 w-8 text-primary" />,
      title: 'Professional Export',
      description: 'Download your scripts and scenes as professionally formatted PDFs, ready for sharing and submission.',
      image: PlaceHolderImages.find(img => img.id === 'feature-export'),
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
                priority
              />
           )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="container relative px-4 md:px-6 text-center space-y-6">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
              From Idea to Screenplay — Instantly.
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-gray-300 md:text-xl drop-shadow-md">
              StorySynth is an AI-powered platform that helps you create, manage, and export movie scripts with ease.
              Unleash your creativity without getting bogged down by formatting.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/register">Start Writing for Free</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Ultimate Writing Copilot</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StorySynth provides all the tools you need to streamline your screenwriting process, from initial concept to final draft.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 md:gap-12 lg:max-w-none lg:grid-cols-3 lg:gap-16 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-4">
                  {feature.icon}
                  <div className="grid gap-1">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Crafted for Writers, by Writers.
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We believe that technology should empower creativity, not hinder it. StorySynth was built with a minimalist, writer-focused design to keep you in the flow state. Your stories are yours alone, processed locally for privacy and speed.
              </p>
            </div>
            <div className="flex justify-center">
              {features[1].image && (
                 <Image
                    src={features[1].image.imageUrl}
                    width="600"
                    height="400"
                    alt={features[1].image.description}
                    data-ai-hint={features[1].image.imageHint}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  />
              )}
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-card border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Write Your Masterpiece?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of writers and bring your stories to life.
                Start for free, no credit card required.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button size="lg" asChild className="w-full">
                <Link href="/register">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
