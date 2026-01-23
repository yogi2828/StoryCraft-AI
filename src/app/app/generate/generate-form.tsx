'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Loader2, Sparkles, Save, FileDown } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { saveScript } from '@/lib/storage';
import type { GenerateFullScriptOutput } from '@/ai/flows/generate-full-script';
import { Separator } from '@/components/ui/separator';
import { exportScriptToPDF } from '@/lib/pdf';
import type { Script } from '@/lib/types';


const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  genre: z.string().min(1, 'Genre is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  language: z.string().min(1, 'Language is required.'),
  scriptType: z.string().min(1, 'Script type is required.'),
  characters: z.string().min(10, 'Character descriptions must be at least 10 characters.'),
  plotIdea: z.string().min(10, 'Plot idea must be at least 10 characters.'),
  numberOfScenes: z.coerce.number().min(1, 'You must generate at least one scene.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GenerateFullScriptOutput | null>(null);
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: 'The Last Stand',
      genre: 'Drama',
      tone: 'Serious',
      language: 'English',
      scriptType: 'Feature Film',
      characters: 'DETECTIVE MACK (50s, weary but sharp), a rookie cop, a mysterious informant.',
      plotIdea: 'A detective on the verge of retirement gets a final case that\'s mysteriously linked to his past.',
      numberOfScenes: 3,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedScript(null);
    setFormValues(values);

    const result = await generateFullScriptAction(values);

    if (result.success && result.data?.scenes) {
        setGeneratedScript(result.data);
        toast({ title: 'Script Generated!', description: `Your new script with ${result.data.scenes.length} scenes is ready below.` });
    } else {
        toast({ variant: 'destructive', title: 'AI Error', description: result.error || 'Failed to generate script.' });
    }
    
    setIsLoading(false);
  }
  
  function handleSaveScript() {
    if (!generatedScript || !formValues || !user) return;
    
    const newScenesForStorage = generatedScript.scenes.map(scene => ({
        title: `Scene ${scene.sceneNumber}`,
        location: scene.location,
        timeOfDay: scene.timeOfDay,
        description: scene.description,
        dialogue: scene.dialogue,
        aiGenerated: true,
    }));

    const newScript = saveScript({
        userId: user.id,
        title: formValues.title,
        genre: formValues.genre,
        tone: formValues.tone,
        language: formValues.language,
        scriptType: formValues.scriptType,
        aiModelUsed: 'Gemini',
    }, newScenesForStorage);

    toast({ title: 'Script Saved!', description: 'Your new script is in the library.' });
    router.push(`/app/scripts/${newScript.id}`);
  }

  function handleDownloadPdf() {
    if (!generatedScript || !formValues || !user) return;

    const tempScript: Script = {
      id: 'temp-script',
      userId: user.id,
      title: formValues.title,
      genre: formValues.genre,
      tone: formValues.tone,
      language: formValues.language,
      scriptType: formValues.scriptType,
      aiModelUsed: 'Gemini',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: generatedScript.scenes.map(scene => ({
        ...scene,
        id: `temp-scene-${scene.sceneNumber}`,
        scriptId: 'temp-script',
        title: `Scene ${scene.sceneNumber}`,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    };

    exportScriptToPDF(tempScript);
  }


  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Script Title</FormLabel>
                      <FormControl>
                        <Input placeholder="The Last Stand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Drama">Drama</SelectItem>
                          <SelectItem value="Comedy">Comedy</SelectItem>
                          <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                          <SelectItem value="Horror">Horror</SelectItem>
                          <SelectItem value="Action">Action</SelectItem>
                          <SelectItem value="Thriller">Thriller</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scriptType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Script Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Feature Film">Feature Film</SelectItem>
                          <SelectItem value="Short Film">Short Film</SelectItem>
                          <SelectItem value="TV Episode">TV Episode</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="characters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Characters & Roles</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., DETECTIVE MACK (50s, weary but sharp), a rookie cop, a mysterious informant."
                          className="min-h-[120px]"
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
                      <FormLabel>Plot Idea</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A detective on the verge of retirement gets a final case that's mysteriously linked to his past."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Serious">Serious</SelectItem>
                          <SelectItem value="Comedic">Comedic</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                          <SelectItem value="Lighthearted">Lighthearted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="numberOfScenes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Scenes</FormLabel>
                       <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select number of scenes" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Scene</SelectItem>
                          <SelectItem value="2">2 Scenes</SelectItem>
                          <SelectItem value="3">3 Scenes</SelectItem>
                          <SelectItem value="4">4 Scenes</SelectItem>
                          <SelectItem value="5">5 Scenes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Script
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your script... this may take a moment.</p>
        </div>
      )}

      {generatedScript && generatedScript.scenes.length > 0 && (
        <Card className="mt-8">
            <CardContent className="pt-6 space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold">Generated Script</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleDownloadPdf}>
                          <FileDown className="mr-2 h-4 w-4" /> Download PDF
                      </Button>
                      <Button onClick={handleSaveScript}>
                          <Save className="mr-2 h-4 w-4" /> Save Script
                      </Button>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-background/50 space-y-8 font-code">
                  {generatedScript.scenes.map((scene, index) => (
                      <div key={index} className="space-y-4">
                          <p className="font-bold uppercase">{scene.sceneNumber}. {scene.location} - {scene.timeOfDay}</p>
                          <p className="whitespace-pre-wrap">{scene.description}</p>
                          <p className="whitespace-pre-wrap">{scene.dialogue}</p>
                          {index < generatedScript.scenes.length - 1 && <Separator className="my-6" />}
                      </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
