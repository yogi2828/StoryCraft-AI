'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, Loader2 } from 'lucide-react';
import type { Script } from '@/lib/types';
import { getScriptById, updateScript } from '@/lib/storage';
import { exportScriptToPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';
import { ScriptEditor } from '@/components/script-editor';

export function SceneList({ scriptId }: { scriptId: string }) {
  const [script, setScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const foundScript = getScriptById(scriptId);
    if (foundScript) {
      setScript(foundScript);
    }
    setIsLoading(false);
  }, [scriptId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!script) {
    notFound();
  }
  
  const handleDownload = () => {
    if (!script) return;
    exportScriptToPDF(script);
    toast({
      title: 'Download Started',
      description: `${script.title} is being downloaded as a PDF.`,
    });
  }

  const handleSave = (finalScript: Script) => {
    const updatedScript = updateScript(scriptId, finalScript);
    if (updatedScript) {
      setScript(updatedScript);
      toast({ title: 'Script Saved', description: 'Your changes have been saved to the library.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save script.' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-8">
        <div className="space-y-6">
          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <CardTitle className="text-3xl">{script.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Last updated on {new Date(script.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                   <Button onClick={handleDownload} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
               <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">{script.genre}</Badge>
                <Badge variant="secondary">{script.tone}</Badge>
                <Badge variant="secondary">{script.scriptType}</Badge>
              </div>
            </CardHeader>
          </Card>
           <ScriptEditor
              key={script.id}
              initialScript={script}
              onSave={handleSave}
            />
        </div>
      </div>
    </div>
  );
}
