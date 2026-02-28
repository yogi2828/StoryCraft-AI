import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AIGenerateIcon, SceneEditIcon, PDFExportIcon } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Play, ScrollText } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-cinematic');
  
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
        <section className="relative w-full pt-32 pb-20 md:pt-56 md:pb-40 flex flex-col items-center text-center px-4 overflow-hidden">
          <div className="container relative z-10 space-y-10 max-w-6xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-accent/20 text-accent text-sm font-bold animate-fade-in-up uppercase tracking-[0.2em] shadow-xl shadow-accent/5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Premium Screenwriting Suite</span>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl animate-fade-in-up [animation-delay:200ms] leading-[0.9]">
              Your Vision. <br/>
              <span className="text-accent italic bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Our Intelligence.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-2xl leading-relaxed animate-fade-in-up [animation-delay:400ms] font-medium opacity-80">
              StoryCraft AI is the premium workbench for creators. Draft, refine, and export professional screenplays with AI that understands the soul of your story.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10 animate-fade-in-up [animation-delay:600ms]">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-12 h-16 text-xl font-black shadow-2xl shadow-accent/30 amber-glow transition-all active:scale-95">
                <Link href="/register">
                  Start Writing <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-10 h-16 text-xl text-foreground hover:bg-white/5 transition-all font-bold">
                <Play className="mr-3 w-6 h-6 fill-current" /> Watch Showreel
              </Button>
            </div>
          </div>
          
          {/* Hero Decorative Visual */}
          {heroImage && (
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[120%] -z-10 opacity-[0.08] blur-[120px] scale-125 pointer-events-none transition-opacity duration-1000">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
            </div>
          )}

          {/* Decorative Scroll Hint */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
             <ScrollText className="w-8 h-8" />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-32 bg-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.05),transparent_50%)]" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 mb-32">
                <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-foreground">A Writer's Arsenal</h2>
                <p className="max-w-[800px] text-muted-foreground text-xl font-medium opacity-70">
                  Powerful tools designed to vanish into your workflow, leaving only your creativity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <Card key={feature.id} className="bg-card/40 border-white/5 hover:border-accent/40 transition-all duration-700 group overflow-hidden rounded-[3rem] shadow-2xl hover:shadow-accent/5">
                  <CardContent className="p-10 space-y-8">
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-700 shadow-xl shadow-primary/10">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white/90 group-hover:text-accent transition-colors duration-500">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                        {feature.description}
                      </p>
                    </div>
                    {feature.image && (
                       <div className="pt-8 relative overflow-hidden rounded-[2.5rem] aspect-video grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 border border-white/5">
                         <Image
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          data-ai-hint={feature.image.imageHint}
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
        <section className="w-full py-40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-primary to-background p-16 md:p-32 text-center border border-white/10 shadow-3xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.1)_0%,transparent_70%)]" />
               <div className="relative z-10 space-y-10">
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">The blank page <br/> is history.</h2>
                  <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-medium opacity-80">
                    Join a new generation of creators and bring your scripts to life today.
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-16 h-20 text-2xl font-black shadow-2xl transition-all active:scale-95">
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