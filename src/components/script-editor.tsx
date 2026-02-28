'use client';

import { useState, useEffect } from 'react';
import type { Script } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Sparkles, FileDown, AlertCircle, Trash2, Settings2 } from 'lucide-react';
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
    toast({ title: 'PDF Exported', description: 'Your screenplay is ready for production.' });
  }

  const hasEdits = editedSceneIndexes.size > 0;

  return (
    <div className="space-y-10">
      {/* Script Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 glass rounded-3xl border-white/5 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">{script.title}</h2>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-primary/40 text-accent border-accent/20 uppercase tracking-widest text-[10px] py-1 px-3">{script.genre}</Badge>
            <Badge variant="secondary" className="bg-white/5 border-white/10 uppercase tracking-widest text-[10px] py-1 px-3">{script.tone}</Badge>
            <Badge variant="outline" className="border-white/20 uppercase tracking-widest text-[10px] py-1 px-3">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleDownload} variant="ghost" className="rounded-full text-foreground/70 hover:text-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 h-12 font-bold shadow-xl shadow-accent/20">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Editor Surface */}
        <div className="lg:col-span-3 space-y-6">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-6">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden border-none glass transition-all duration-500 ${editedSceneIndexes.has(index) ? 'ring-2 ring-accent/50 shadow-[0_0_30px_-12px_hsl(var(--accent))]' : 'ring-1 ring-white/5'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-6 hover:no-underline hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-6 text-left">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${editedSceneIndexes.has(index) ? 'bg-accent text-accent-foreground' : 'bg-primary/40 text-accent/60'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl uppercase tracking-tight">{scene.location || 'UNTITLED LOCATION'}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-8 pt-2 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-accent/80">Scene Description</Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[150px] font-body text-lg leading-relaxed bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/30 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-accent/80">Dialogue & Action</Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[250px] font-body text-lg leading-relaxed bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/30 rounded-2xl"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Floating Tool Sidebar */}
        <div className="space-y-8">
          <Card className="sticky top-24 glass border-accent/20 bg-accent/5 rounded-3xl overflow-hidden">
            <div className="h-1 bg-accent/50 w-full" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <Sparkles className="w-5 h-5 text-accent" />
                Continuity Weaver
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                Manually editing scenes can disrupt the narrative flow. Use AI to intelligently re-align all subsequent scenes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasEdits ? (
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-accent">
                     <AlertCircle className="w-4 h-4" /> Edits Detected
                  </div>
                  <p className="text-muted-foreground leading-snug">Scene(s) {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')} modified. Refining will rewrite the remainder of the script.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 text-xs text-muted-foreground flex items-center gap-3">
                   <Settings2 className="w-4 h-4 opacity-40" />
                   <span>No changes detected.</span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-2xl h-12" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Refine Script AI
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-white/10 rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Analyze & Reweave?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-lg">
                      The AI will analyze your latest edits and creatively rewrite all following scenes to ensure the story remains logical and compelling.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8">
                    <AlertDialogCancel className="rounded-full border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-accent text-accent-foreground rounded-full px-8 hover:bg-accent/90">Confirm Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-3xl border border-white/5 bg-white/5 space-y-4">
             <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">Editor Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-xl font-bold">{script.scenes.length}</div>
                   <div className="text-[10px] uppercase text-muted-foreground font-bold">Scenes</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-xl font-bold">{script.scenes.reduce((acc, s) => acc + s.dialogue.split(' ').length, 0)}</div>
                   <div className="text-[10px] uppercase text-muted-foreground font-bold">Words</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}