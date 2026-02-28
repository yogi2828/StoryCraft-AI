'use client';

import { useState, useEffect } from 'react';
import type { Script } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Sparkles, FileDown, AlertCircle, Trash2 } from 'lucide-react';
import { refineScriptAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { exportScriptToPDF } from '@/lib/pdf';
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
import { Badge } from '@/components/ui/badge';

interface ScriptEditorProps {
  initialScript: Script;
  onSave: (finalScript: Script) => void;
  isNewScript?: boolean;
}

export function ScriptEditor({ initialScript, onSave, isNewScript = false }: ScriptEditorProps) {
  const { toast } = useToast();
  const [script, setScript] = useState<Script>(initialScript);
  const [editedSceneIndexes, setEditedSceneIndexes] = useState<Set<number>>(new Set());
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setScript(initialScript);
  }, [initialScript]);

  const handleContentChange = (sceneIndex: number, field: 'description' | 'dialogue', value: string) => {
    const updatedScenes = [...script.scenes];
    updatedScenes[sceneIndex] = { ...updatedScenes[sceneIndex], [field]: value };
    setScript({ ...script, scenes: updatedScenes });
    
    const newEditedIndexes = new Set(editedSceneIndexes);
    newEditedIndexes.add(sceneIndex);
    setEditedSceneIndexes(newEditedIndexes);
  };

  const handleRefineScript = async () => {
    if (editedSceneIndexes.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No Changes',
        description: 'Edit at least one scene before refining continuity.',
      });
      return;
    }

    setIsRefining(true);
    const firstEditedIndex = Math.min(...Array.from(editedSceneIndexes));

    const result = await refineScriptAction({
      title: script.title,
      genre: script.genre,
      tone: script.tone,
      scenes: script.scenes,
      editedSceneIndex: firstEditedIndex,
    });

    if (result.success && result.data) {
      const updatedScenes = [...script.scenes];
      result.data.scenes.forEach((refinedContent, index) => {
        const targetSceneIndex = firstEditedIndex + 1 + index;
        if (updatedScenes[targetSceneIndex]) {
          updatedScenes[targetSceneIndex].description = refinedContent.description;
          updatedScenes[targetSceneIndex].dialogue = refinedContent.dialogue;
        }
      });
      setScript({ ...script, scenes: updatedScenes });
      setEditedSceneIndexes(new Set());
      toast({
        title: 'Continuity Restored',
        description: 'AI has adjusted subsequent scenes to match your edits.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Refinement Error',
        description: result.error || 'Failed to align the story.',
      });
    }

    setIsRefining(false);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    onSave(script);
    setIsSaving(false);
  }

  const handleDownload = () => {
    exportScriptToPDF(script);
    toast({ title: 'PDF Prepared', description: 'Your export has started.' });
  }

  const hasEdits = editedSceneIndexes.size > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{script.title}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{script.genre}</Badge>
            <Badge variant="secondary">{script.tone}</Badge>
            <Badge variant="outline">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleDownload} variant="outline" className="rounded-full">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="rounded-full px-8">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-4">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden transition-all duration-300 ${editedSceneIndexes.has(index) ? 'border-primary ring-1 ring-primary/20' : 'border-border/50'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/30">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${editedSceneIndexes.has(index) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div>
                        <h3 className="font-semibold">{scene.location || 'UNTITLED LOCATION'}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-6 pt-2 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-tighter text-muted-foreground">Action & Description</Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[120px] font-mono leading-relaxed bg-muted/20 border-none focus-visible:ring-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-tighter text-muted-foreground">Dialogue</Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[200px] font-mono leading-relaxed bg-muted/20 border-none focus-visible:ring-1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Continuity Engine
              </CardTitle>
              <CardDescription>
                Manual edits can break story flow. Use AI to re-align the script from your last edit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasEdits ? (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p>Changes detected in scene(s): {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')}. Refining will update all scenes that follow.</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No manual edits detected yet.</p>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Refine Script Continuity
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apply AI Refinement?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The AI will analyze your edits and rewrite all subsequent scenes to match the new story direction. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-accent text-accent-foreground">Confirm Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}