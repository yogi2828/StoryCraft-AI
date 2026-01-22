import { GenerateForm } from './generate-form';
import { BotMessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Generate Script | StorySynth',
  description: 'Generate a new screenplay using AI.',
};

export default function GeneratePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <BotMessageSquare className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Script Generator</h1>
            <p className="text-muted-foreground">Fill in the details below to generate a new script with AI.</p>
          </div>
        </header>

        <GenerateForm />

      </div>
    </div>
  );
}
