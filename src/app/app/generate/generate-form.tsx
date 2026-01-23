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
import { generateSceneAction } from '@/app/actions';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { saveScript } from '@/lib/storage';
import type { GenerateScreenplaySceneOutput } from '@/ai/flows/generate-screenplay-scene';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  genre: z.string().min(1, 'Genre is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  language: z.string().min(1, 'Language is required.'),
  scriptType: z.string().min(1, 'Script type is required.'),
  characters: z.string().min(10, 'Character descriptions must be at least 10 characters.'),
  plotIdea: z.string().min(10, 'Plot idea must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScene, setGeneratedScene] = useState<GenerateScreenplaySceneOutput | null>(null);
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
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedScene(null);
    setFormValues(values);

    // Simulate local AI generation for demo purposes
    setTimeout(() => {
      const mockScene: GenerateScreenplaySceneOutput = {
        sceneNumber: 1,
        location: 'INT. COFFEE SHOP - DAY',
        timeOfDay: 'Day',
        description: 'A bustling coffee shop. Patrons chat and type on laptops. SUNLIGHT streams through the large front window.',
        dialogue: `JANE (30s, sharp, focused) sips her latte, staring intently at her laptop screen.\n\nMARK (30s, charming, a bit disheveled) approaches her table.\n\nMARK\nIs this seat taken?\n\nJane looks up, annoyed.\n\nJANE\nIt is now.`,
      };
      setGeneratedScene(mockScene);
      toast({ title: 'Scene Generated!', description: 'Your new scene is ready below.' });
      setIsLoading(false);
    }, 1500);
  }
  
  function handleSaveScript() {
    if (!generatedScene || !formValues || !user) return;
    
    const newSceneForStorage = {
        title: `Scene ${generatedScene.sceneNumber}`,
        location: generatedScene.location,
        timeOfDay: generatedScene.timeOfDay,
        description: generatedScene.description,
        dialogue: generatedScene.dialogue,
        aiGenerated: true,
    };

    const newScript = saveScript({
        userId: user.id,
        title: formValues.title,
        genre: formValues.genre,
        tone: formValues.tone,
        language: formValues.language,
        scriptType: formValues.scriptType,
        aiModelUsed: 'Local Demo',
    }, [newSceneForStorage]);

    toast({ title: 'Script Saved!', description: 'Your new script is in the library.' });
    router.push(`/app/scripts/${newScript.id}`);
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Scene
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your scene... this may take a moment.</p>
        </div>
      )}

      {generatedScene && (
        <Card className="mt-8">
            <CardContent className="pt-6 space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold">Generated Scene</h3>
                    <Button onClick={handleSaveScript}>
                        <Save className="mr-2 h-4 w-4" /> Save Script
                    </Button>
                </div>
                <div className="p-4 border rounded-lg bg-background/50 space-y-4 font-code">
                    <p className="font-bold uppercase">{generatedScene.sceneNumber}. {generatedScene.location} - {generatedScene.timeOfDay}</p>
                    <p className="whitespace-pre-wrap">{generatedScene.description}</p>
                    <p className="whitespace-pre-wrap">{generatedScene.dialogue}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
