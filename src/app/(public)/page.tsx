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
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center px-4 overflow-hidden">
          <div className="container relative z-10 space-y-8 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-accent/20 text-accent text-sm font-medium animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              <span>The Future of Screenwriting</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl animate-fade-in-up [animation-delay:200ms]">
              Your Vision. <br/>
              <span className="text-accent italic">Our Intelligence.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-fade-in-up [animation-delay:400ms]">
              StoryCraft AI is the premium workbench for modern creators. Draft, refine, and export professional screenplays with AI that understands the soul of your story.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-fade-in-up [animation-delay:600ms]">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 h-14 text-lg font-bold shadow-2xl shadow-accent/20">
                <Link href="/register">
                  Start Writing Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-14 text-lg text-foreground hover:bg-white/5">
                <Play className="mr-2 w-5 h-5 fill-current" /> Watch Showreel
              </Button>
            </div>
          </div>
          
          {/* Hero Decorative Image */}
          {heroImage && (
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-full -z-10 opacity-20 blur-3xl scale-110 pointer-events-none">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
            </div>
          )}

          {/* Decorative Scroll Icon */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
             <ScrollText className="w-6 h-6" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 bg-secondary/20 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-24">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-foreground">A Writer's Arsenal</h2>
                <p className="max-w-[700px] text-muted-foreground text-lg">
                  Powerful tools designed to vanish into your workflow, leaving only your creativity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={feature.id} className="bg-card/50 border-white/5 hover:border-accent/30 transition-all duration-500 group overflow-hidden rounded-[2rem]">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.image && (
                       <div className="pt-4 relative overflow-hidden rounded-2xl aspect-video grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                         <Image
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
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
        
        {/* Call to Action */}
        <section className="w-full py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary to-background p-12 md:p-24 text-center border border-white/10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.05)_0%,transparent_70%)]" />
               <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight">The blank page is history.</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join a new generation of screenwriters and bring your scripts to life today.
                  </p>
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-16 text-xl font-bold">
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
