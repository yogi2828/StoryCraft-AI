import { Library } from 'lucide-react';
import { ScriptList } from './script-list';

export const metadata = {
  title: 'Script Library | StoryCraft AI',
  description: 'View and manage your saved scripts.',
};

export default function LibraryPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <Library className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Script Library</h1>
            <p className="text-muted-foreground">All your creative work, in one place.</p>
          </div>
        </header>

        <ScriptList />
      </div>
    </div>
  );
}
