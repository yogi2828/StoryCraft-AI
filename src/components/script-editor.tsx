'use client';

import { useState, useEffect } from 'react';
import type { Script } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Sparkles, FileDown, AlertCircle, Trash2, Settings2, Scroll } from 'lucide-react';
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
    <div className="space-y-12 animate-fade-in-up">
      {/* Refined Script Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 glass rounded-[2.5rem] border-white/10 shadow-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <Scroll className="w-8 h-8 text-accent animate-pulse" />
             <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{script.title}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-primary text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-black py-1.5 px-4 rounded-full">{script.genre}</Badge>
            <Badge variant="secondary" className="bg-white/5 border-white/10 uppercase tracking-[0.2em] text-[10px] font-black py-1.5 px-4 rounded-full">{script.tone}</Badge>
            <Badge variant="outline" className="border-white/20 uppercase tracking-[0.2em] text-[10px] font-black py-1.5 px-4 rounded-full">{script.scriptType}</Badge>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <Button onClick={handleDownload} variant="ghost" className="rounded-full text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all">
            <FileDown className="mr-2 h-5 w-5" /> Export PDF
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isRefining} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-12 h-14 font-black text-lg shadow-2xl shadow-accent/30 amber-glow transition-all active:scale-95">
            {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Save Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Writing Surface */}
        <div className="lg:col-span-3 space-y-8">
          <Accordion type="multiple" defaultValue={['scene-0']} className="space-y-8">
            {script.scenes.map((scene, index) => (
              <AccordionItem value={`scene-${index}`} key={scene.id || index} className="border-none">
                <Card className={`overflow-hidden border-none glass transition-all duration-700 rounded-[2rem] ${editedSceneIndexes.has(index) ? 'ring-2 ring-accent shadow-[0_0_50px_-15px_hsl(var(--accent)/0.3)]' : 'ring-1 ring-white/5 hover:ring-white/20'}`}>
                  <AccordionTrigger className="flex items-center justify-between w-full p-8 hover:no-underline hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-8 text-left">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${editedSceneIndexes.has(index) ? 'bg-accent text-accent-foreground amber-glow scale-110' : 'bg-primary/30 text-accent/50'}`}>
                        {scene.sceneNumber}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl uppercase tracking-tight text-white/90">{scene.location || 'INT. UNTITLED - DAY'}</h3>
                        <p className="text-[10px] text-accent/60 uppercase tracking-[0.4em] mt-1.5 font-black">{scene.timeOfDay}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-10 pt-2 space-y-10">
                      <div className="space-y-4">
                        <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-accent/70 ml-2">Action & Setting</Label>
                        <Textarea
                          value={scene.description}
                          onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                          className="min-h-[160px] font-body text-xl leading-relaxed bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-3xl p-6 transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] uppercase tracking-[0.4em] font-black text-accent/70 ml-2">Dialogue & Character</Label>
                        <Textarea
                          value={scene.dialogue}
                          onChange={(e) => handleContentChange(index, 'dialogue', e.target.value)}
                          className="min-h-[280px] font-body text-xl leading-relaxed bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-3xl p-6 transition-all"
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
        <div className="space-y-10">
          <Card className="sticky top-28 glass border-accent/30 bg-accent/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="h-2 bg-gradient-to-r from-accent/50 via-accent to-accent/50 w-full" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl flex items-center gap-3 font-black text-white/90">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                Continuity Engine
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-2 font-medium italic">
                Manual changes ripple through time. Use AI to re-weave the remaining tapestry of your story.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {hasEdits ? (
                <div className="p-6 rounded-3xl bg-accent/10 border border-accent/30 flex flex-col gap-3 text-xs">
                  <div className="flex items-center gap-2 font-black text-accent uppercase tracking-widest">
                     <AlertCircle className="w-4 h-4" /> Disruption Detected
                  </div>
                  <p className="text-white/70 leading-relaxed">Scene {Array.from(editedSceneIndexes).map(i => i + 1).join(', ')} has been manually altered. The timeline must be re-aligned.</p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-white/5 text-xs text-muted-foreground flex items-center gap-4 font-medium">
                   <Settings2 className="w-5 h-5 opacity-30" />
                   <span>Timeline is currently consistent.</span>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-black rounded-full h-14 text-md amber-glow transition-all active:scale-95" disabled={!hasEdits || isRefining}>
                    {isRefining ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Sparkles className="mr-3 h-5 w-5" />}
                    Heal Narrative AI
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-white/10 rounded-[3rem] p-10 max-w-lg">
                  <AlertDialogHeader className="space-y-4">
                    <AlertDialogTitle className="text-3xl font-black text-white/90">Analyze & Re-weave?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-lg leading-relaxed font-medium">
                      StoryCraft will analyze your latest edits and creatively rewrite all following scenes to ensure the narrative arc remains focused and consistent.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-10 gap-4">
                    <AlertDialogCancel className="rounded-full border-white/10 hover:bg-white/5 px-8 h-12 font-bold">Discard</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRefineScript} className="bg-accent text-accent-foreground rounded-full px-10 h-12 font-black amber-glow">Commit Refinement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          
          <div className="p-8 rounded-[2rem] border border-white/5 bg-white/2 space-y-6">
             <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-accent/50 text-center">Script Analysis</h4>
             <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center transition-all hover:bg-white/10">
                   <div className="text-3xl font-black text-white/90">{script.scenes.length}</div>
                   <div className="text-[9px] uppercase text-muted-foreground font-black tracking-widest mt-1">Scenes</div>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center transition-all hover:bg-white/10">
                   <div className="text-3xl font-black text-white/90">{script.scenes.reduce((acc, s) => acc + s.dialogue.split(/\s+/).length, 0)}</div>
                   <div className="text-[9px] uppercase text-muted-foreground font-black tracking-widest mt-1">Words</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}