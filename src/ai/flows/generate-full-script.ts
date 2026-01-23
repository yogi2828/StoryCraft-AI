'use server';
/**
 * @fileOverview A full script generation AI agent.
 *
 * - generateFullScript - A function that handles the full script generation process.
 * - GenerateFullScriptInput - The input type for the generateFullScript function.
 * - GenerateFullScriptOutput - The return type for the generateFullScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  sceneNumber: z.number().describe('The scene number, starting from 1.'),
  location: z.string().describe('The location of the scene (e.g., INT. COFFEE SHOP - DAY).'),
  timeOfDay: z.string().describe('The time of day for the scene (e.g., Day, Night).'),
  description: z.string().describe('A detailed description of the scene, setting, and actions.'),
  dialogue: z.string().describe('The dialogue for the scene, formatted with character names in uppercase.'),
});

const GenerateFullScriptInputSchema = z.object({
  title: z.string().describe('The title of the screenplay.'),
  genre: z.string().describe('The genre of the screenplay.'),
  tone: z.string().describe('The tone of the screenplay (e.g., comedic, dramatic).'),
  language: z.string().describe('The language of the screenplay.'),
  scriptType: z.string().describe('The type of script (e.g., movie, TV episode).'),
  characters: z.string().describe('A description of the characters in the scene, including their names, roles, and personalities.'),
  plotIdea: z.string().describe('A brief plot idea for the script.'),
  numberOfScenes: z.number().min(1).max(10).describe('The number of scenes to generate.'),
});
export type GenerateFullScriptInput = z.infer<typeof GenerateFullScriptInputSchema>;

const GenerateFullScriptOutputSchema = z.object({
  scenes: z.array(SceneSchema),
});
export type GenerateFullScriptOutput = z.infer<typeof GenerateFullScriptOutputSchema>;

export async function generateFullScript(
  input: GenerateFullScriptInput
): Promise<GenerateFullScriptOutput> {
  return generateFullScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFullScriptPrompt',
  input: {schema: GenerateFullScriptInputSchema},
  output: {schema: GenerateFullScriptOutputSchema},
  prompt: `You are a professional screenwriter. Generate a screenplay with multiple scenes based on the following information. You must generate exactly {{{numberOfScenes}}} scenes.

Title: {{{title}}}
Genre: {{{genre}}}
Tone: {{{tone}}}
Language: {{{language}}}
Script Type: {{{scriptType}}}
Characters: {{{characters}}}
Plot Idea: {{{plotIdea}}}

Ensure the scenes flow logically from one to the next, following the plot idea. Each scene should be formatted with a scene number, location, time of day, a detailed description, and dialogue. The final output must be a JSON object with a "scenes" array, where each element in the array is a scene object.
`,
});

const generateFullScriptFlow = ai.defineFlow(
  {
    name: 'generateFullScriptFlow',
    inputSchema: GenerateFullScriptInputSchema,
    outputSchema: GenerateFullScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
