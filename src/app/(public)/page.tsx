import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AIGenerateIcon, SceneEditIcon, PDFExportIcon } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';

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
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-500/10 via-amber-500/5 to-fuchsia-500/10 animate-gradient-xy" />
          <div className="absolute bottom-0 left-0 -z-10 h-48 w-full bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="container relative px-4 md:px-6 space-y-8 animate-fade-in-up">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent drop-shadow-sm">
              From Idea to Screenplay.
              <br/>
              <span className="bg-gradient-to-r from-amber-500 to-fuchsia-500 bg-clip-text text-transparent">Instantly.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl drop-shadow-lg">
              StorySynth is an AI-powered platform that helps you create, manage, and export movie scripts with ease.
              Unleash your creativity.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-amber-500/20 transition-all">
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
                <div key={feature.id} className="group mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-10 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  <div className={`lg:pr-8 lg:pt-4 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                      <div className="lg:max-w-lg">
                          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                              <feature.icon className="h-5 w-5 mr-2 text-amber-500" />
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
                      className="w-full h-auto rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-transform duration-500 ease-in-out group-hover:scale-105"
                      width={feature.image.width}
                      height={feature.image.height}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="contact" className="w-full py-20 md:py-32">
         <div className="container px-4 md:px-6">
            <Card className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500 text-primary-foreground overflow-hidden">
              <CardContent className="p-10 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-3 text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Write Your Masterpiece?</h2>
                  <p className="mx-auto max-w-[600px] opacity-80 md:text-xl/relaxed">
                    Join thousands of writers and bring your stories to life.
                    Start for free, no credit card required.
                  </p>
                </div>
                <div className="flex-shrink-0">
                   <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90 w-full sm:w-auto">
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
