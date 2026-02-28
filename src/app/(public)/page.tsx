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
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center px-4 overflow-hidden">
          <div className="container relative z-10 space-y-8 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-bold animate-fade-in-up uppercase tracking-widest shadow-lg">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Premium Screenwriting Suite</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl animate-fade-in-up [animation-delay:200ms] leading-none text-foreground">
              Story. <br/>
              <span className="text-primary italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Evolved.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-fade-in-up [animation-delay:400ms] font-medium opacity-90">
              StoryCraft AI is the refined workbench for modern creators. Draft, refine, and export professional screenplays with intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up [animation-delay:600ms]">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-14 text-lg font-bold shadow-xl primary-glow transition-all active:scale-95">
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-foreground/10 hover:bg-foreground/5 transition-all font-semibold">
                <Play className="mr-2 w-4 h-4 fill-current" /> Watch Showreel
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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <ScrollText className="w-6 h-6" />
          </div>
        </section>

        {/* Stats Banner */}
        <section className="w-full py-10 bg-primary/5 border-y border-foreground/5">
          <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { icon: Users, label: "Creators", val: "50k+" },
               { icon: Zap, label: "Scenes", val: "2M+" },
               { icon: Globe, label: "Countries", val: "120+" },
               { icon: CheckCircle2, label: "Scripts", val: "15k+" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center text-center space-y-1">
                 <stat.icon className="w-4 h-4 text-primary mb-1 opacity-70" />
                 <div className="text-2xl font-black text-foreground">{stat.val}</div>
                 <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">{stat.label}</div>
               </div>
             ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="w-full py-20 bg-background relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-foreground">The Workflow</h2>
                <p className="max-w-[600px] text-muted-foreground text-lg font-medium">Spark to screenplay in four effortless steps.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {steps.map((step, i) => (
                 <div key={i} className="relative p-8 rounded-2xl glass border-foreground/5 space-y-3 hover:border-primary/20 transition-all duration-500">
                    <div className="text-4xl font-black text-primary/10 absolute top-4 right-6">{i + 1}</div>
                    <h3 className="text-xl font-black text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-20 bg-secondary/10 relative overflow-hidden">
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-20">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-foreground">A Writer's Arsenal</h2>
                <p className="max-w-[600px] text-muted-foreground text-lg font-medium opacity-80">
                  Powerful tools designed to vanish into your workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.id} className="bg-card border-foreground/5 hover:border-primary/30 transition-all duration-500 group overflow-hidden rounded-3xl shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                    {feature.image && (
                       <div className="pt-6 relative overflow-hidden rounded-2xl aspect-video grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border border-foreground/5">
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
        <section className="w-full py-32 bg-background">
          <div className="container px-4 mx-auto">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary to-primary/80 p-16 md:p-24 text-center border border-white/10 shadow-2xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.15)_0%,transparent_70%)]" />
               <div className="relative z-10 space-y-8">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">The blank page <br/> is history.</h2>
                  <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium">
                    Join a new generation of creators and bring your scripts to life today.
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-16 text-xl font-black shadow-xl transition-all active:scale-95">
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