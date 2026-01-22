'use server';
/**
 * @fileOverview A screenplay scene generation AI agent.
 *
 * - generateScreenplayScene - A function that handles the screenplay scene generation process.
 * - GenerateScreenplaySceneInput - The input type for the generateScreenplayScene function.
 * - GenerateScreenplaySceneOutput - The return type for the generateScreenplayScene function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScreenplaySceneInputSchema = z.object({
  title: z.string().describe('The title of the screenplay.'),
  genre: z.string().describe('The genre of the screenplay.'),
  tone: z.string().describe('The tone of the screenplay (e.g., comedic, dramatic).'),
  language: z.string().describe('The language of the screenplay.'),
  scriptType: z.string().describe('The type of script (e.g., movie, TV episode).'),
  characterCount: z.number().describe('The number of characters in the scene.'),
  plotIdea: z.string().describe('A brief plot idea for the scene.'),
});
export type GenerateScreenplaySceneInput = z.infer<typeof GenerateScreenplaySceneInputSchema>;

const GenerateScreenplaySceneOutputSchema = z.object({
  sceneNumber: z.number().describe('The scene number.'),
  location: z.string().describe('The location of the scene.'),
  timeOfDay: z.string().describe('The time of day for the scene (e.g., Day, Night).'),
  description: z.string().describe('A detailed description of the scene.'),
  dialogue: z.string().describe('The dialogue for the scene.'),
});
export type GenerateScreenplaySceneOutput = z.infer<typeof GenerateScreenplaySceneOutputSchema>;

export async function generateScreenplayScene(
  input: GenerateScreenplaySceneInput
): Promise<GenerateScreenplaySceneOutput> {
  return generateScreenplaySceneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScreenplayScenePrompt',
  input: {schema: GenerateScreenplaySceneInputSchema},
  output: {schema: GenerateScreenplaySceneOutputSchema},
  prompt: `You are a professional screenwriter. Generate a screenplay scene based on the following information:

Title: {{{title}}}
Genre: {{{genre}}}
Tone: {{{tone}}}
Language: {{{language}}}
Script Type: {{{scriptType}}}
Character Count: {{{characterCount}}}
Plot Idea: {{{plotIdea}}}

Format the scene with a scene number, location, time of day, description, and dialogue.`,
});

const generateScreenplaySceneFlow = ai.defineFlow(
  {
    name: 'generateScreenplaySceneFlow',
    inputSchema: GenerateScreenplaySceneInputSchema,
    outputSchema: GenerateScreenplaySceneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
