'use client';

import { useState, useEffect } from 'react';
import type { Script } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Sparkles, FileDown, AlertCircle, Settings2, Scroll, Wand2 } from 'lucide-react';
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
        title: 'Narrative Re-aligned',
        description: 'The AI has creatively woven your changes into the following scenes.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Refinement Error',
        description: result.error || 'The story engine encountered a block.',
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
    toast({ title: 'Masterpiece Exported', description: 'Your screenplay is ready for the silver screen.' });
  }

  const hasEdits = editedSceneIndexes.size > 0;

  return (
    <div className="space-y-20 animate-fade-in-up">
      {/* Refined Script Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 p-16 glass rounded-[5rem] border-foreground/5 shadow-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-5">
             <Scroll className="w-10 h-10 text-primary animate-pulse" />
             <h2 className="text-6xl font-black tracking-tighter text-foreground">{script.title}</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Badge className="bg-primary text-white border-none uppercase tracking-[0.3em] text-[10px] font-black py-2.5 px-6 rounded-full">{script.genre}</Badge>
            <Badge variant="secondary" className="bg-foreground/5 border-none uppercase tracking-[0.3em] text-[10px] font-black py-2.5 px-6 rounded-full">{script.tone}</Badge>
            <Badge variant="outline" className="border-foreground/20 uppercase tracking-[0.3em] text-[10px] font-black py-2.5 px-6 rounded-full">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <Button onClick={handleDownload} variant="outline" className="rounded-full px-10 h-20 text-xl font-black border-foreground/10 hover:bg-foreground/5 transition-all">
            <FileDown className="mr-3 w-5 h-5" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-16 h-20 font-black text-2xl shadow-3xl primary-glow transition-all active:scale-95">
            {isSaving ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Save className="mr-3 h-6 w-6" />}
            Save Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Main Writing Surface */}
        <div className="lg:col-span-3 space-y-12">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-12">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden border-none glass transition-all duration-1000 rounded-[4rem] ${editedSceneIndexes.has(index) ? 'ring-4 ring-primary/40 shadow-3xl' : 'ring-1 ring-foreground/5 hover:ring-foreground/15 shadow-2xl'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-12 hover:no-underline hover:bg-foreground/2 transition-all">
                    <div className="flex items-center gap-12 text-left">
                      <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-3xl transition-all ${editedSceneIndexes.has(index) ? 'bg-primary text-white scale-110 shadow-2xl' : 'bg-primary/10 text-primary/40'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-4xl uppercase tracking-tighter text-foreground">{scene.location || 'INT. UNTITLED - DAY'}</h3>
                        <p className="text-[10px] text-primary uppercase tracking-[0.5em] font-black opacity-60">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-16 pt-2 space-y-12">
                      <div className="space-y-6">
                        <Label className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-4 flex items-center gap-2">
                           <Wand2 className="w-3.5 h-3.5" /> Action & Setting
                        </Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[220px] font-body text-2xl leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[3rem] p-10 transition-all"
                        />
                      </div>
                      <div className="space-y-6">
                        <Label className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/70 ml-4 flex items-center gap-2">
                           <Scroll className="w-3.5 h-3.5" /> Dialogue & Character
                        </Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[350px] font-body text-2xl leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-[3rem] p-10 transition-all"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Cinematic Tool Panel */}
        <div className="space-y-12">
          <Card className="sticky top-28 glass border-primary/30 bg-primary/2 rounded-[4rem] overflow-hidden shadow-3xl">
            <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary w-full" />
            <CardHeader className="p-10 pb-6">
              <CardTitle className="text-3xl flex items-center gap-4 font-black text-foreground">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                Continuity
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground leading-relaxed mt-4 font-medium italic">
                Manual changes ripple through time. Use AI to re-weave the remaining tapestry of your story.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              {hasEdits ? (
                <div className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-3 font-black text-primary uppercase tracking-[0.2em]">
                     <AlertCircle className="w-4 h-4" /> Timeline Divergence
                  </div>
                  <p className="text-foreground/80 leading-relaxed font-medium">Scene {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')} has been manually altered. The timeline must be re-aligned.</p>
                </div>
              ) : (
                <div className="p-8 rounded-[2.5rem] bg-foreground/5 text-sm text-muted-foreground flex items-center gap-5 font-bold">
                   <Settings2 className="w-6 h-6 opacity-30" />
                   <span>The narrative is consistent.</span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full h-20 text-xl shadow-3xl primary-glow transition-all active:scale-95" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-4 h-6 w-6 animate-spin" /> : <Sparkles className="mr-4 h-6 w-6" />}
                    Heal Timeline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-foreground/5 rounded-[4rem] p-16 max-w-2xl shadow-3xl">
                  <AlertDialogHeader className="space-y-6 text-center">
                    <AlertDialogTitle className="text-5xl font-black text-foreground leading-none">Analyze & Re-weave?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-2xl leading-relaxed font-medium italic">
                      StoryCraft will analyze your latest edits and creatively rewrite all following scenes to ensure the narrative arc remains focused and consistent.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-16 gap-6">
                    <AlertDialogCancel className="rounded-full border-foreground/10 hover:bg-foreground/5 px-12 h-16 text-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-primary text-primary-foreground rounded-full px-16 h-16 text-xl font-black shadow-3xl">Commit Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <div className="p-10 rounded-[3.5rem] border border-foreground/5 glass space-y-10">
             <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-primary/60 text-center">Analysis Matrix</h4>
             <div className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-[2.5rem] bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-5xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.length}</div>
                   <div className="text-[9px] uppercase text-muted-foreground font-black tracking-[0.3em] mt-2">Scenes</div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-5xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.reduce((acc, s) => acc + s.dialogue.split(/\s+/).length, 0)}</div>
                   <div className="text-[9px] uppercase text-muted-foreground font-black tracking-[0.3em] mt-2">Words</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}