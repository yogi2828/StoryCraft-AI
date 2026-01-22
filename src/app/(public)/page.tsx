import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AIGenerateIcon, SceneEditIcon, PDFExportIcon } from '@/components/icons';

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
        <section className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center text-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="a" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)"><rect x="0" y="0" width="100%" height="100%" fill="none"/><path d="M10-5V5m10 5V-5m-5 10H5m10 0H-5" stroke="hsl(var(--primary))" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#a)"/></svg>
            </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="container relative px-4 md:px-6 space-y-8 animate-fade-in-up">
            <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-foreground drop-shadow-2xl">
              From Idea to Screenplay.
              <br/>
              <span className="text-accent">Instantly.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl drop-shadow-lg">
              StorySynth is an AI-powered platform that helps you create, manage, and export movie scripts with ease.
              Unleash your creativity.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/register">Start Writing for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 mx-auto">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">The Ultimate Writing Copilot</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StorySynth provides all the tools you need to streamline your screenwriting process, from initial concept to final draft.
                </p>
            </div>

            <div className="space-y-32">
              {features.map((feature, index) => (
                <div key={feature.id} className="group mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  <div className={`lg:pr-8 lg:pt-4 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                      <div className="lg:max-w-lg">
                          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                              <feature.icon className="h-5 w-5 mr-2 text-accent" />
                              {feature.title}
                          </div>
                          <p className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{feature.title}</p>
                          <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            {feature.description}
                          </p>
                      </div>
                  </div>
                  {feature.image && (
                     <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      data-ai-hint={feature.image.imageHint}
                      className="w-full max-w-none rounded-xl shadow-2xl ring-1 ring-foreground/10 sm:w-[57rem] md:-ml-4 lg:-ml-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
                      width={800}
                      height={600}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="contact" className="w-full py-20 md:py-32 bg-muted/50 border-y">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-fade-in-up">
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
