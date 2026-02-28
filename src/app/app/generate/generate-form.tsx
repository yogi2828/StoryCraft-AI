'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { generateFullScriptAction } from '@/app/actions';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { ScriptEditor } from '@/components/script-editor';
import { saveScript } from '@/lib/storage';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import type { Script } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(2, 'A title is required.'),
  genre: z.string().min(1, 'Genre is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  language: z.string().min(1, 'Language is required.'),
  scriptType: z.string().min(1, 'Script type is required.'),
  characters: z.string().min(10, 'Tell us more about the characters.'),
  plotIdea: z.string().min(10, 'Describe the plot in more detail.'),
  numberOfScenes: z.coerce.number().min(1).max(10, 'Maximum 10 scenes per generation.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<Script | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      genre: 'Drama',
      tone: 'Serious',
      language: 'English',
      scriptType: 'Feature Film',
      characters: '',
      plotIdea: '',
      numberOfScenes: 3,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedScript(null);

    const result = await generateFullScriptAction(values);

    if (result.success && result.data?.scenes && user) {
        const scriptForEditor: Script = {
          id: `temp-${crypto.randomUUID()}`,
          userId: user.id,
          title: values.title,
          genre: values.genre,
          tone: values.tone,
          language: values.language,
          scriptType: values.scriptType,
          status: 'draft',
          aiModelUsed: 'Gemini',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          scenes: result.data.scenes.map((scene, index) => ({
            ...scene,
            id: `temp-scene-${index}`,
            scriptId: `temp-${crypto.randomUUID()}`,
            title: `Scene ${scene.sceneNumber}`,
            aiGenerated: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        };
        setGeneratedScript(scriptForEditor);
        toast({ title: 'Script Born!', description: 'Your script has been drafted. Review and refine it below.' });
    } else {
        toast({ variant: 'destructive', title: 'Creative Block', description: result.error || 'The AI encountered an issue.' });
    }
    
    setIsLoading(false);
  }
  
  function handleSaveScript(finalScript: Script) {
    if (!user) return;
    
    const newScript = saveScript({
        userId: user.id,
        title: finalScript.title,
        genre: finalScript.genre,
        tone: finalScript.tone,
        language: finalScript.language,
        scriptType: finalScript.scriptType,
        aiModelUsed: 'Gemini',
    }, finalScript.scenes);

    toast({ title: 'Saved to Library', description: 'Your script is now permanent.' });
    router.push(`/app/scripts/${newScript.id}`);
  }

  return (
    <div className="space-y-12">
      <Card className="border-primary/10 shadow-2xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            Script Blueprint
          </CardTitle>
          <CardDescription>Provide the foundation, and let AI build the scenes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Midnight in Kyoto" {...field} className="text-lg font-medium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Drama">Drama</SelectItem>
                          <SelectItem value="Comedy">Comedy</SelectItem>
                          <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                          <SelectItem value="Action">Action</SelectItem>
                          <SelectItem value="Horror">Horror</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Serious">Serious</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                          <SelectItem value="Comedic">Comedic</SelectItem>
                          <SelectItem value="Noir">Noir</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scriptType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Feature Film">Feature Film</SelectItem>
                          <SelectItem value="Short Film">Short Film</SelectItem>
                          <SelectItem value="TV Episode">TV Episode</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfScenes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scenes to Generate</FormLabel>
                      <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <SelectItem key={n} value={String(n)}>{n} {n === 1 ? 'Scene' : 'Scenes'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="characters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Dossier</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Introduce your protagonists, antagonists, and their key traits..." 
                          className="min-h-[150px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plotIdea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plot Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What is the central conflict or spark of this script?" 
                          className="min-h-[150px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" size="lg" disabled={isLoading} className="px-12 rounded-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Manifesting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Ignite Generation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {generatedScript && (
        <div className="animate-in slide-in-from-bottom duration-1000">
          <ScriptEditor
            key={generatedScript.id}
            initialScript={generatedScript}
            onSave={handleSaveScript}
            isNewScript={true}
          />
        </div>
      )}
    </div>
  );
}