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
        description: 'AI has creatives re-woven your changes.',
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
    toast({ title: 'Masterpiece Exported', description: 'Screenplay is ready for production.' });
  }

  const hasEdits = editedSceneIndexes.size > 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Script Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 glass rounded-2xl border-foreground/5 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
             <Scroll className="w-6 h-6 text-primary animate-pulse" />
             <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">{script.title}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-white border-none uppercase tracking-widest text-[8px] font-black py-1 px-3 rounded-full">{script.genre}</Badge>
            <Badge variant="secondary" className="bg-foreground/5 border-none uppercase tracking-widest text-[8px] font-black py-1 px-3 rounded-full">{script.tone}</Badge>
            <Badge variant="outline" className="border-foreground/20 uppercase tracking-widest text-[8px] font-black py-1 px-3 rounded-full">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button onClick={handleDownload} variant="outline" className="rounded-full px-6 h-10 text-sm font-bold border-foreground/10 hover:bg-foreground/5 transition-all">
            <FileDown className="mr-2 w-3.5 h-3.5" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-10 font-bold text-sm shadow-lg primary-glow transition-all active:scale-95">
            {isSaving ? <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" /> : <Save className="mr-2 w-3.5 h-3.5" />}
            Save Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Writing Surface */}
        <div className="lg:col-span-3 space-y-6">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-6">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden border-none glass transition-all duration-500 rounded-xl ${editedSceneIndexes.has(index) ? 'ring-2 ring-primary/40 shadow-lg' : 'ring-1 ring-foreground/5 hover:ring-foreground/10 shadow-md'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-6 hover:no-underline hover:bg-foreground/[0.02] transition-all">
                    <div className="flex items-center gap-6 text-left">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl transition-all ${editedSceneIndexes.has(index) ? 'bg-primary text-white scale-105 shadow-md' : 'bg-primary/10 text-primary/40'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-black text-xl uppercase tracking-tight text-foreground">{scene.location || 'INT. UNTITLED - DAY'}</h3>
                        <p className="text-[8px] text-primary uppercase tracking-widest font-black opacity-60">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-8 pt-1 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-[8px] uppercase tracking-widest font-black text-primary/70 ml-1.5 flex items-center gap-1.5">
                           <Wand2 className="w-2.5 h-2.5" /> Action & Setting
                        </Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[120px] font-body text-lg leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl p-5 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[8px] uppercase tracking-widest font-black text-primary/70 ml-1.5 flex items-center gap-1.5">
                           <Scroll className="w-2.5 h-2.5" /> Dialogue & Character
                        </Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[200px] font-body text-lg leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl p-5 transition-all"
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
        <div className="space-y-6">
          <Card className="sticky top-24 glass border-primary/20 bg-primary/[0.01] rounded-2xl overflow-hidden shadow-lg">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary w-full" />
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 font-black text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                Continuity
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1.5 font-medium italic">
                Manual changes ripple through time. Use AI to re-weave the remaining story.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {hasEdits ? (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col gap-2 text-[10px]">
                  <div className="flex items-center gap-2 font-black text-primary uppercase tracking-widest">
                     <AlertCircle className="w-3 h-3" /> Divergence
                  </div>
                  <p className="text-foreground/80 leading-relaxed font-medium">Scene {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')} altered. The timeline must be re-aligned.</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-foreground/5 text-[9px] text-muted-foreground flex items-center gap-2.5 font-bold">
                   <Settings2 className="w-3.5 h-3.5 opacity-30" />
                   <span>The narrative is consistent.</span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full h-11 text-sm shadow-md primary-glow transition-all active:scale-95" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" /> : <Sparkles className="mr-2 w-3.5 h-3.5" />}
                    Heal Timeline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-foreground/5 rounded-2xl p-8 max-w-lg shadow-xl">
                  <AlertDialogHeader className="space-y-3 text-center">
                    <AlertDialogTitle className="text-2xl font-black text-foreground">Analyze & Re-weave?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed font-medium italic">
                      StoryCraft will analyze your latest edits and creatively rewrite all following scenes to ensure narrative consistency.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-full border-foreground/10 hover:bg-foreground/5 px-6 h-10 text-sm font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-primary text-primary-foreground rounded-full px-8 h-10 text-sm font-black shadow-md">Commit Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-2xl border border-foreground/5 glass space-y-6">
             <h4 className="text-[8px] uppercase tracking-widest font-black text-primary/60 text-center">Analysis Matrix</h4>
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.length}</div>
                   <div className="text-[7px] uppercase text-muted-foreground font-black tracking-widest mt-0.5">Scenes</div>
                </div>
                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.reduce((acc, s) => acc + s.dialogue.split(/\s+/).length, 0)}</div>
                   <div className="text-[7px] uppercase text-muted-foreground font-black tracking-widest mt-0.5">Words</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
