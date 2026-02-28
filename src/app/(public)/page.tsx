import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AIGenerateIcon, SceneEditIcon, PDFExportIcon } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Play, ScrollText, CheckCircle2, Globe, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-cinematic');
  
  const steps = [
    { title: "Spark", desc: "Input your plot idea and characters." },
    { title: "Weave", desc: "AI generates professional scenes instantly." },
    { title: "Refine", desc: "Edit any scene; story adjusts automatically." },
    { title: "Export", desc: "Download professional PDF scripts." }
  ];

  const features = [
    {
      id: 'generate',
      icon: AIGenerateIcon,
      title: 'AI Script Weaver',
      description: 'Craft complex narratives from a single spark. Our AI understands dramatic beats to generate scenes that feel alive.',
      image: PlaceHolderImages.find(img => img.id === 'feature-weave'),
    },
    {
      id: 'edit',
      icon: SceneEditIcon,
      title: 'Continuity Engine',
      description: 'Edit any scene and watch the story intelligently adjust. Maintain narrative flow across every act with one click.',
      image: PlaceHolderImages.find(img => img.id === 'feature-continuity'),
    },
    {
      id: 'export',
      icon: PDFExportIcon,
      title: 'Industry Ready',
      description: 'Format your masterpiece instantly. Export to PDF with professional screenplay standards ready for production.',
      image: PlaceHolderImages.find(img => img.id === 'feature-ready'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-12 md:pt-32 md:pb-20 flex flex-col items-center text-center px-4 overflow-hidden">
          <div className="container relative z-10 space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/20 text-primary text-[9px] font-bold animate-fade-in-up uppercase tracking-widest shadow-md">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Premium Screenwriting Suite</span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl lg:text-7xl animate-fade-in-up [animation-delay:200ms] leading-none text-foreground">
              Story. <br/>
              <span className="text-primary italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Evolved.</span>
            </h1>
            
            <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed animate-fade-in-up [animation-delay:400ms] font-medium opacity-90">
              StoryCraft AI is the refined workbench for modern creators. Draft, refine, and export professional screenplays with intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up [animation-delay:600ms]">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-bold shadow-lg primary-glow transition-all active:scale-95">
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-foreground/10 hover:bg-foreground/5 transition-all font-semibold">
                <Play className="mr-2 w-3.5 h-3.5 fill-current" /> Watch Showreel
              </Button>
            </div>
          </div>
          
          {heroImage && (
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[100%] -z-10 opacity-[0.05] dark:opacity-[0.08] blur-[120px] scale-125 pointer-events-none">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                />
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <ScrollText className="w-5 h-5" />
          </div>
        </section>

        {/* Stats Banner */}
        <section className="w-full py-6 bg-primary/5 border-y border-foreground/5">
          <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { icon: Users, label: "Creators", val: "50k+" },
               { icon: Zap, label: "Scenes", val: "2M+" },
               { icon: Globe, label: "Countries", val: "120+" },
               { icon: CheckCircle2, label: "Scripts", val: "15k+" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center text-center space-y-0.5">
                 <stat.icon className="w-3.5 h-3.5 text-primary mb-0.5 opacity-70" />
                 <div className="text-xl font-black text-foreground">{stat.val}</div>
                 <div className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">{stat.label}</div>
               </div>
             ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="w-full py-16 bg-background relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-2 mb-12">
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">The Workflow</h2>
                <p className="max-w-[500px] text-muted-foreground text-base font-medium">Spark to screenplay in four effortless steps.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {steps.map((step, i) => (
                 <div key={i} className="relative p-6 rounded-xl glass border-foreground/5 space-y-2 hover:border-primary/20 transition-all duration-500">
                    <div className="text-3xl font-black text-primary/10 absolute top-3 right-4">{i + 1}</div>
                    <h3 className="text-lg font-black text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-16 bg-secondary/10 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-2 mb-16">
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">A Writer's Arsenal</h2>
                <p className="max-w-[500px] text-muted-foreground text-base font-medium opacity-80">
                  Powerful tools designed to vanish into your workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.id} className="bg-card border-foreground/5 hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-2xl shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                    {feature.image && (
                       <div className="pt-4 relative overflow-hidden rounded-xl aspect-video grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border border-foreground/5">
                         <Image
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                       </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="w-full py-20 bg-background">
          <div className="container px-4 mx-auto">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 p-12 md:p-20 text-center border border-white/10 shadow-xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.15)_0%,transparent_70%)]" />
               <div className="relative z-10 space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white">The blank page <br/> is history.</h2>
                  <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto font-medium">
                    Join a new generation of creators and bring your scripts to life today.
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-lg font-black shadow-lg transition-all active:scale-95">
                    <Link href="/register">Join StoryCraft</Link>
                  </Button>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
