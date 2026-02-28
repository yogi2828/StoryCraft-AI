import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AIGenerateIcon, SceneEditIcon, PDFExportIcon } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      id: 'generate',
      icon: AIGenerateIcon,
      title: 'AI-Powered Generation',
      description: 'Instantly generate complete screenplay scenes from a simple plot idea. Let our advanced AI handle the heavy lifting, from dialogue to descriptions, so you can focus on the story.',
      image: PlaceHolderImages.find(img => img.id === 'feature-generate'),
    },
    {
      id: 'edit',
      icon: SceneEditIcon,
      title: 'Deep Scene Editing',
      description: 'Take full control. Edit every detail of your scene, from dialogue to description, or let our AI regenerate it for you with a single click. Refine your vision effortlessly.',
      image: PlaceHolderImages.find(img => img.id === 'feature-edit'),
    },
    {
      id: 'export',
      icon: PDFExportIcon,
      title: 'Professional Export',
      description: 'Download your scripts and scenes as professionally formatted PDFs, ready for sharing with your team, submitting to festivals, or printing for table reads.',
      image: PlaceHolderImages.find(img => img.id === 'feature-export'),
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 flex items-center justify-center text-center overflow-hidden">
          <div className="container relative px-4 md:px-6 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Screenwriting is Here</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent drop-shadow-sm">
              From Idea to Screenplay.
              <br/>
              <span className="bg-gradient-to-r from-amber-500 via-accent to-fuchsia-500 bg-clip-text text-transparent">Instantly.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl drop-shadow-lg leading-relaxed">
              StorySynth is the world's most advanced AI-powered platform for creators to draft, manage, and export professional movie scripts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-fuchsia-500 text-white hover:shadow-2xl hover:shadow-amber-500/40 transition-all rounded-full px-8 h-14 text-lg">
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-foreground/10 hover:bg-foreground/5">
                <Play className="mr-2 w-4 h-4 fill-current" /> Watch Demo
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
                <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary">Core Modules</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Script Doctor's Toolkit</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to go from a blank page to a finished draft in record time.
                </p>
            </div>

            <div className="space-y-32">
              {features.map((feature, index) => (
                <div key={feature.id} className="group mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-10 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  <div className={`lg:pr-8 lg:pt-4 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                      <div className="lg:max-w-lg">
                          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                              <feature.icon className="h-5 w-5 mr-2 text-amber-500" />
                              {feature.title}
                          </div>
                          <h3 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">{feature.title}</h3>
                          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                          <Button variant="link" className="mt-6 p-0 h-auto text-primary text-lg">
                            Learn more <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  {feature.image && (
                    <div className="relative group">
                       <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        data-ai-hint={feature.image.imageHint}
                        className="relative w-full h-auto rounded-2xl shadow-2xl ring-1 ring-foreground/10 transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
                        width={feature.image.width}
                        height={feature.image.height}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="contact" className="w-full py-20 md:py-32">
         <div className="container px-4 md:px-6">
            <Card className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-primary-foreground overflow-hidden border-primary/20 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              <CardContent className="p-10 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Ready to Write Your Masterpiece?</h2>
                  <p className="mx-auto max-w-[600px] opacity-70 md:text-xl/relaxed">
                    Join thousands of writers and bring your stories to life today.
                  </p>
                </div>
                <div className="flex-shrink-0">
                   <Button size="lg" asChild className="bg-amber-500 text-black hover:bg-amber-400 w-full sm:w-auto h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-amber-500/20">
                    <Link href="/register">Sign Up Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}