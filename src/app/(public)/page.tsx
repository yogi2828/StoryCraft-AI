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
    { title: "Spark", desc: "Input your core plot idea and character archetypes." },
    { title: "Weave", desc: "Our AI generates industry-standard scenes instantly." },
    { title: "Refine", desc: "Edit any scene; watch the story adjust automatically." },
    { title: "Export", desc: "Download professional PDF scripts in seconds." }
  ];

  const features = [
    {
      id: 'generate',
      icon: AIGenerateIcon,
      title: 'AI Script Weaver',
      description: 'Craft complex narratives from a single spark. Our AI understands character arcs and dramatic beats to generate scenes that feel alive.',
      image: PlaceHolderImages.find(img => img.id === 'feature-weave'),
    },
    {
      id: 'edit',
      icon: SceneEditIcon,
      title: 'Fluid Continuity Engine',
      description: 'Edit any scene and watch as the story intelligently adjusts. Maintain perfect narrative flow across every act with one click.',
      image: PlaceHolderImages.find(img => img.id === 'feature-continuity'),
    },
    {
      id: 'export',
      icon: PDFExportIcon,
      title: 'Industry Ready Export',
      description: 'Format your masterpiece instantly. Export to PDF with professional screenplay standards ready for the production office.',
      image: PlaceHolderImages.find(img => img.id === 'feature-ready'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-40 pb-24 md:pt-64 md:pb-48 flex flex-col items-center text-center px-4 overflow-hidden">
          <div className="container relative z-10 space-y-12 max-w-7xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-primary/20 text-primary text-xs font-black animate-fade-in-up uppercase tracking-[0.3em] shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Premium Screenwriting Suite</span>
            </div>
            
            <h1 className="text-7xl font-black tracking-tighter sm:text-9xl lg:text-[11rem] animate-fade-in-up [animation-delay:200ms] leading-[0.85] text-foreground">
              Story. <br/>
              <span className="text-primary italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Evolved.</span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-3xl leading-relaxed animate-fade-in-up [animation-delay:400ms] font-medium opacity-80">
              StoryCraft AI is the premium workbench for modern creators. Draft, refine, and export professional screenplays with intelligence that understands the soul of your narrative.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-12 animate-fade-in-up [animation-delay:600ms]">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-16 h-20 text-2xl font-black shadow-3xl primary-glow transition-all active:scale-95">
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-12 h-20 text-2xl border-foreground/10 hover:bg-foreground/5 transition-all font-bold">
                <Play className="mr-4 w-5 h-5 fill-current" /> Watch Showreel
              </Button>
            </div>
          </div>
          
          {heroImage && (
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[150%] h-[130%] -z-10 opacity-[0.1] dark:opacity-[0.08] blur-[150px] scale-125 pointer-events-none">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                />
            </div>
          )}

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <ScrollText className="w-10 h-10" />
          </div>
        </section>

        {/* Global Impact Banner */}
        <section className="w-full py-16 bg-primary/5 border-y border-foreground/5">
          <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
             {[
               { icon: Users, label: "Creators Joined", val: "50k+" },
               { icon: Zap, label: "Scenes Manifested", val: "2M+" },
               { icon: Globe, label: "Countries Writing", val: "120+" },
               { icon: CheckCircle2, label: "Scripts Completed", val: "15k+" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center text-center space-y-2">
                 <stat.icon className="w-5 h-5 text-primary mb-2" />
                 <div className="text-4xl font-black text-foreground">{stat.val}</div>
                 <div className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">{stat.label}</div>
               </div>
             ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-32 bg-background relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 mb-24">
                <h2 className="text-5xl font-black tracking-tight sm:text-7xl text-foreground">The Workflow</h2>
                <p className="max-w-[800px] text-muted-foreground text-xl font-medium">From spark to screenplay in four effortless steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {steps.map((step, i) => (
                 <div key={i} className="relative p-10 rounded-[3rem] glass border-foreground/5 space-y-4 hover:border-primary/30 transition-all duration-700">
                    <div className="text-6xl font-black text-primary/10 absolute top-4 right-8">{i + 1}</div>
                    <h3 className="text-3xl font-black text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-32 bg-secondary/20 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 mb-32">
                <h2 className="text-5xl font-black tracking-tight sm:text-7xl text-foreground">A Writer's Arsenal</h2>
                <p className="max-w-[800px] text-muted-foreground text-xl font-medium opacity-70">
                  Powerful tools designed to vanish into your workflow, leaving only your creativity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature) => (
                <Card key={feature.id} className="bg-card border-foreground/5 hover:border-primary/40 transition-all duration-700 group overflow-hidden rounded-[4rem] shadow-2xl hover:shadow-primary/5">
                  <CardContent className="p-12 space-y-10">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-700 shadow-xl shadow-primary/5">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-4xl font-black text-foreground group-hover:text-primary transition-colors duration-500">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                        {feature.description}
                      </p>
                    </div>
                    {feature.image && (
                       <div className="pt-10 relative overflow-hidden rounded-[3rem] aspect-video grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 border border-foreground/5">
                         <Image
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                       </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Banner */}
        <section className="w-full py-48 bg-background">
          <div className="container px-4 mx-auto">
            <div className="relative overflow-hidden rounded-[5rem] bg-gradient-to-br from-primary via-primary/80 to-background p-24 md:p-40 text-center border border-white/10 shadow-3xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.15)_0%,transparent_70%)]" />
               <div className="relative z-10 space-y-12">
                  <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none text-white">The blank page <br/> is history.</h2>
                  <p className="text-2xl md:text-4xl text-white/80 max-w-4xl mx-auto font-medium">
                    Join a new generation of creators and bring your scripts to life today.
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-20 h-24 text-3xl font-black shadow-2xl transition-all active:scale-95">
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