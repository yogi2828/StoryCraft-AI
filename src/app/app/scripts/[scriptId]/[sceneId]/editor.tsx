'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { getScriptById, updateScene, addScene } from '@/lib/storage';
import { continuityAwareRegenerateSceneAction } from '@/app/actions';
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react';
import type { Script, Scene } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  location: z.string().min(1, 'Location is required.'),
  timeOfDay: z.string().min(1, 'Time of day is required.'),
  description: z.string().min(1, 'Description is required.'),
  dialogue: z.string().min(1, 'Dialogue is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function SceneEditor({ scriptId, sceneId }: { scriptId: string; sceneId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [script, setScript] = useState<Script | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [isNewScene, setIsNewScene] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationPrompt, setRegenerationPrompt] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      timeOfDay: 'Day',
      description: '',
      dialogue: '',
    },
  });
  
  useEffect(() => {
    const foundScript = getScriptById(scriptId);
    if (!foundScript) {
      setIsLoading(false);
      return;
    }
    setScript(foundScript);

    if (sceneId === 'new') {
      setIsNewScene(true);
      const newSceneNumber = foundScript.scenes.length + 1;
      form.reset({
        title: `Scene ${newSceneNumber}`,
        location: '',
        timeOfDay: 'Day',
        description: '',
        dialogue: ''
      });
    } else {
      const foundScene = foundScript.scenes.find(s => s.id === sceneId);
      if (foundScene) {
        setScene(foundScene);
        form.reset(foundScene);
      }
    }
    setIsLoading(false);
  }, [scriptId, sceneId, form]);

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  if (!script || (!scene && !isNewScene)) {
    notFound();
  }

  const onSubmit = (values: FormValues) => {
    setIsSaving(true);
    let updatedScript;
    if (isNewScene) {
      updatedScript = addScene(scriptId, { ...values, aiGenerated: false });
    } else {
      updatedScript = updateScene(scriptId, sceneId, values);
    }
    
    if (updatedScript) {
      setScript(updatedScript);
      toast({ title: 'Scene Saved', description: 'Your changes have been saved.' });
      if (isNewScene) {
        const newSceneId = updatedScript.scenes[updatedScript.scenes.length - 1].id;
        router.replace(`/app/scripts/${scriptId}/${newSceneId}`);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the scene.' });
    }
    setIsSaving(false);
  };
  
  const handleContinuityRegenerate = async () => {
    if (!script) return;
    setIsRegenerating(true);
    
    const currentValues = form.getValues();
    const sceneIndex = script.scenes.findIndex(s => s.id === sceneId);
    
    if (sceneIndex === -1 && !isNewScene) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find the current scene.' });
        setIsRegenerating(false);
        return;
    }

    const previousScenesContent = script.scenes
        .slice(0, sceneIndex)
        .map(s => `SCENE ${s.sceneNumber}: ${s.location.toUpperCase()}\n${s.description}\n${s.dialogue}`)
        .join('\n\n---\n\n');

    const result = await continuityAwareRegenerateSceneAction({
        previousScenes: previousScenesContent,
        currentScene: {
            title: currentValues.title,
            location: currentValues.location,
            timeOfDay: currentValues.timeOfDay,
            description: currentValues.description,
            dialogue: currentValues.dialogue,
        },
        editPrompt: regenerationPrompt,
    });

    if (result.success && result.data) {
        form.setValue('description', result.data.regeneratedScene.description, { shouldValidate: true });
        form.setValue('dialogue', result.data.regeneratedScene.dialogue, { shouldValidate: true });
        toast({ title: 'Scene Regenerated!', description: 'The scene has been updated with AI, maintaining continuity.' });
    } else {
        toast({ variant: 'destructive', title: 'AI Error', description: result.error || 'Failed to regenerate scene.' });
    }

    setIsRegenerating(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push(`/app/scripts/${scriptId}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {script.title}
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isNewScene ? 'New Scene' : 'Edit Scene'}</CardTitle>
                <CardDescription>
                  {isNewScene
                    ? 'Fill in the details for your new scene.'
                    : `Editing Scene ${scene?.sceneNumber} of "${script.title}".`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Scene Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Interrogation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., INT. WAREHOUSE - NIGHT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeOfDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time of Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Day">Day</SelectItem>
                            <SelectItem value="Night">Night</SelectItem>
                            <SelectItem value="Dusk">Dusk</SelectItem>
                            <SelectItem value="Dawn">Dawn</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the setting and actions." className="min-h-[150px] font-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dialogue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dialogue</FormLabel>
                      <FormControl>
                        <Textarea placeholder={`CHARACTER\n(V.O.)\nI had a bad feeling about this.\n\nOTHER CHARACTER\nTell me something I don't know.`} className="min-h-[250px] font-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {!isNewScene && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Regeneration</CardTitle>
                  <CardDescription>
                    Use AI to rewrite this scene. You can provide a prompt for the changes you want, and the AI will consider previous scenes to maintain continuity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Label htmlFor="regeneration-prompt">Regeneration Prompt (Optional)</Label>
                    <Textarea
                      id="regeneration-prompt"
                      placeholder="e.g., 'Make the dialogue more tense.' or 'Add a new character who interrupts the conversation.'"
                      value={regenerationPrompt}
                      onChange={(e) => setRegenerationPrompt(e.target.value)}
                      className="font-sans"
                    />
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleContinuityRegenerate} disabled={isRegenerating}>
                        {isRegenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Regenerate with AI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                {isNewScene ? 'Create Scene' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
