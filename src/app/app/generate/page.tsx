import { GenerateForm } from './generate-form';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata = {
  title: 'Generate Script | StoryCraft AI',
  description: 'Generate a new screenplay using AI.',
};

export default function GeneratePage() {
  const decoImage = PlaceHolderImages.find(img => img.id === 'gen-header-deco');

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="relative flex flex-col items-center text-center gap-4 py-12 overflow-hidden rounded-[3rem] glass border-white/5">
          {decoImage && (
             <div className="absolute inset-0 -z-10 opacity-10">
                <Image
                  src={decoImage.imageUrl}
                  alt={decoImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={decoImage.imageHint}
                />
             </div>
          )}
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">Script Generator</h1>
            <p className="text-muted-foreground text-lg mt-2 max-w-lg mx-auto italic font-medium">Input your vision, and our AI model will draft the blueprints of your next cinematic journey.</p>
          </div>
        </header>

        <GenerateForm />

      </div>
    </div>
  );
}
