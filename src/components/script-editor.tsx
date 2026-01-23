'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Script, Scene } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Sparkles, FileDown, AlertTriangle } from 'lucide-react';
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
        title: 'No changes detected',
        description: 'Please edit a scene before refining with AI.',
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
        title: 'Script Refined!',
        description: 'Subsequent scenes have been updated by the AI to maintain continuity.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Refinement Failed',
        description: result.error || 'An unknown error occurred.',
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
  }
  
  const hasEdits = editedSceneIndexes.size > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <CardTitle>{isNewScript ? "Edit & Refine Your New Script" : "Script Editor"}</CardTitle>
            <CardDescription>
              {isNewScript 
                ? "Your generated script is below. Make any edits, then use the AI to refine it."
                : "Edit your scenes directly. Use the AI to automatically adjust for continuity."
              }
            </CardDescription>
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <Button onClick={handleDownload} variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Download PDF
            </Button>
             <Button onClick={handleSaveChanges} disabled={isSaving || isRefining}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-background/50">
           <CardHeader className="flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">AI Continuity Refinement</CardTitle>
                <CardDescription>
                    After editing a scene, let the AI automatically rewrite subsequent scenes to match.
                </CardDescription>
              </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button disabled={!hasEdits || isRefining}>
                        {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Refine with AI
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm AI Refinement</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will send your script to the AI. It will use your latest edit as a reference and may <span className="font-bold">overwrite all subsequent scenes</span> to ensure story continuity. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRefineScript}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
           </CardHeader>
           {hasEdits && (
            <CardContent>
                <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-yellow-200">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    You have unsaved AI refinements. Click &quot;Refine with AI&quot; to apply continuity changes.
                </div>
            </CardContent>
           )}
        </Card>

        <Accordion type="multiple" defaultValue={['scene-0']} className="w-full space-y-4">
          {script.scenes.map((scene, index) => (
            <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-b-0">
               <Card className="overflow-hidden">
                <AccordionTrigger className="flex items-center justify-between w-full p-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-4">
                     {editedSceneIndexes.has(index) && <div className="w-2 h-2 rounded-full bg-accent" title="Edited"></div>}
                    <h3 className="font-semibold text-lg">{scene.sceneNumber}. {scene.title}</h3>
                    <p className="text-sm text-muted-foreground">{scene.location} - {scene.timeOfDay}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-6 pt-2 space-y-4">
                    <div>
                      <Label htmlFor={`description-${index}`} className="font-semibold">Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={scene.description}
                        onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                        className="mt-2 min-h-[150px] font-code"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`dialogue-${index}`} className="font-semibold">Dialogue</Label>
                      <Textarea
                        id={`dialogue-${index}`}
                        value={scene.dialogue}
                        onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                        className="mt-2 min-h-[200px] font-code"
                      />
                    </div>
                  </div>
                </AccordionContent>
               </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
