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
    <div className="space-y-12 animate-fade-in-up">
      {/* Script Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:p-12 glass rounded-3xl border-foreground/5 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
             <Scroll className="w-8 h-8 text-primary animate-pulse" />
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{script.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary text-white border-none uppercase tracking-widest text-[9px] font-black py-1.5 px-4 rounded-full">{script.genre}</Badge>
            <Badge variant="secondary" className="bg-foreground/5 border-none uppercase tracking-widest text-[9px] font-black py-1.5 px-4 rounded-full">{script.tone}</Badge>
            <Badge variant="outline" className="border-foreground/20 uppercase tracking-widest text-[9px] font-black py-1.5 px-4 rounded-full">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-4">
          <Button onClick={handleDownload} variant="outline" className="rounded-full px-8 h-12 text-base font-bold border-foreground/10 hover:bg-foreground/5 transition-all">
            <FileDown className="mr-2 w-4 h-4" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-12 font-bold text-lg shadow-xl primary-glow transition-all active:scale-95">
            {isSaving ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
            Save Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Writing Surface */}
        <div className="lg:col-span-3 space-y-8">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-8">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden border-none glass transition-all duration-500 rounded-2xl ${editedSceneIndexes.has(index) ? 'ring-2 ring-primary/40 shadow-xl' : 'ring-1 ring-foreground/5 hover:ring-foreground/10 shadow-lg'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-8 hover:no-underline hover:bg-foreground/[0.02] transition-all">
                    <div className="flex items-center gap-8 text-left">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${editedSceneIndexes.has(index) ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-primary/10 text-primary/40'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-2xl uppercase tracking-tight text-foreground">{scene.location || 'INT. UNTITLED - DAY'}</h3>
                        <p className="text-[9px] text-primary uppercase tracking-widest font-black opacity-60">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-10 pt-2 space-y-8">
                      <div className="space-y-4">
                        <Label className="text-[9px] uppercase tracking-widest font-black text-primary/70 ml-2 flex items-center gap-1.5">
                           <Wand2 className="w-3 h-3" /> Action & Setting
                        </Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[150px] font-body text-xl leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl p-6 transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[9px] uppercase tracking-widest font-black text-primary/70 ml-2 flex items-center gap-1.5">
                           <Scroll className="w-3 h-3" /> Dialogue & Character
                        </Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[250px] font-body text-xl leading-relaxed bg-foreground/5 border-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl p-6 transition-all"
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
        <div className="space-y-8">
          <Card className="sticky top-24 glass border-primary/20 bg-primary/[0.01] rounded-3xl overflow-hidden shadow-xl">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary w-full" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl flex items-center gap-2 font-black text-foreground">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Continuity
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-2 font-medium italic">
                Manual changes ripple through time. Use AI to re-weave the remaining story.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {hasEdits ? (
                <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2 font-black text-primary uppercase tracking-widest">
                     <AlertCircle className="w-3 h-3" /> Divergence
                  </div>
                  <p className="text-foreground/80 leading-relaxed font-medium">Scene {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')} altered. The timeline must be re-aligned.</p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-foreground/5 text-[10px] text-muted-foreground flex items-center gap-3 font-bold">
                   <Settings2 className="w-4 h-4 opacity-30" />
                   <span>The narrative is consistent.</span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full h-14 text-base shadow-xl primary-glow transition-all active:scale-95" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Sparkles className="mr-2 w-4 h-4" />}
                    Heal Timeline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-foreground/5 rounded-3xl p-10 max-w-xl shadow-2xl">
                  <AlertDialogHeader className="space-y-4 text-center">
                    <AlertDialogTitle className="text-3xl font-black text-foreground">Analyze & Re-weave?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                      StoryCraft will analyze your latest edits and creatively rewrite all following scenes to ensure narrative consistency.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8 gap-4">
                    <AlertDialogCancel className="rounded-full border-foreground/10 hover:bg-foreground/5 px-8 h-12 text-base font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-primary text-primary-foreground rounded-full px-10 h-12 text-base font-black shadow-xl">Commit Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <div className="p-8 rounded-3xl border border-foreground/5 glass space-y-8">
             <h4 className="text-[9px] uppercase tracking-widest font-black text-primary/60 text-center">Analysis Matrix</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.length}</div>
                   <div className="text-[8px] uppercase text-muted-foreground font-black tracking-widest mt-1">Scenes</div>
                </div>
                <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 text-center transition-all hover:bg-foreground/10 group">
                   <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{script.scenes.reduce((acc, s) => acc + s.dialogue.split(/\s+/).length, 0)}</div>
                   <div className="text-[8px] uppercase text-muted-foreground font-black tracking-widest mt-1">Words</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}