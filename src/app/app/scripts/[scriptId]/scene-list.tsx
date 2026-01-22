'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, PlusCircle, Trash2, Edit } from 'lucide-react';
import type { Script } from '@/lib/types';
import { getScriptById, deleteScene } from '@/lib/storage';
import { exportScriptToPDF } from '@/lib/pdf';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
    return <div className="p-8">Loading...</div>;
  }

  if (!script) {
    notFound();
  }
  
  const handleDownload = () => {
    exportScriptToPDF(script);
    toast({
      title: 'Download Started',
      description: `${script.title} is being downloaded as a PDF.`,
    });
  }
  
  const handleDeleteScene = (sceneId: string) => {
    const updatedScript = deleteScene(script.id, sceneId);
    if (updatedScript) {
      setScript(updatedScript);
    }
    toast({
      title: 'Scene Deleted',
      description: 'The scene has been removed from the script.',
    });
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{script.title}</CardTitle>
              <CardDescription>
                Last updated on {new Date(script.updatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{script.genre}</Badge>
                <Badge variant="secondary">{script.tone}</Badge>
                <Badge variant="secondary">{script.scriptType}</Badge>
              </div>
              <Button onClick={handleDownload} className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Download Full PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Scenes</h2>
            <Button asChild>
              <Link href={`/app/scripts/${script.id}/new`}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Scene
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {script.scenes.length > 0 ? (
              script.scenes.map((scene) => (
                <Card key={scene.id} className="hover:border-primary/80 transition-colors">
                  <div className="p-4 flex items-center justify-between">
                    <Link href={`/app/scripts/${script.id}/${scene.id}`} className="flex-1">
                      <h3 className="font-semibold">{scene.sceneNumber}. {scene.title || 'Untitled Scene'}</h3>
                      <p className="text-sm text-muted-foreground">{scene.location} - {scene.timeOfDay}</p>
                    </Link>
                    <div className="flex gap-2 items-center">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/app/scripts/${script.id}/${scene.id}`}><Edit className="h-4 w-4" /></Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete Scene?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete "{scene.title || 'Untitled Scene'}". This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDeleteScene(scene.id)}
                                >
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Scenes Yet</h3>
                <p className="text-muted-foreground mt-2">Add a scene to start building your script.</p>
                <Button asChild className="mt-4">
                  <Link href={`/app/scripts/${script.id}/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Scene
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
