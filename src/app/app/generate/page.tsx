import { GenerateForm } from './generate-form';
import { BotMessageSquare, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Generate Script | StorySynth',
  description: 'Generate a new screenplay using AI.',
};

export default function GeneratePage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">Script Generator</h1>
            <p className="text-muted-foreground text-lg mt-2 max-w-lg mx-auto">Input your vision, and our AI model will draft the blueprints of your next cinematic journey.</p>
          </div>
        </header>

        <GenerateForm />

      </div>
    </div>
  );
}