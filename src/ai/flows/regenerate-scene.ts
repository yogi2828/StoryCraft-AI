'use server';

/**
 * @fileOverview An AI agent for regenerating screenplay scenes.
 *
 * - regenerateScene - A function that regenerates a scene in a screenplay.
 * - RegenerateSceneInput - The input type for the regenerateScene function.
 * - RegenerateSceneOutput - The return type for the regenerateScene function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateSceneInputSchema = z.object({
  title: z.string().describe('The title of the scene.'),
  location: z.string().describe('The location of the scene.'),
  timeOfDay: z.string().describe('The time of day for the scene (e.g., Day, Night).'),
  description: z.string().describe('A detailed description of the scene, including actions and settings.'),
  dialogue: z.string().describe('The existing dialogue in the scene.'),
  genre: z.string().describe('The genre of the screenplay.'),
  tone: z.string().describe('The tone of the screenplay (e.g., dramatic, comedic).'),
  scriptType: z.string().describe('The type of screenplay (e.g., feature film, short film).'),
});

export type RegenerateSceneInput = z.infer<typeof RegenerateSceneInputSchema>;

const RegenerateSceneOutputSchema = z.object({
  regeneratedScene: z.object({
    description: z.string().describe('The AI-regenerated description of the scene.'),
    dialogue: z.string().describe('The AI-regenerated dialogue for the scene.'),
  }),
});

export type RegenerateSceneOutput = z.infer<typeof RegenerateSceneOutputSchema>;

export async function regenerateScene(input: RegenerateSceneInput): Promise<RegenerateSceneOutput> {
  return regenerateSceneFlow(input);
}

const regenerateScenePrompt = ai.definePrompt({
  name: 'regenerateScenePrompt',
  input: {schema: RegenerateSceneInputSchema},
  output: {schema: RegenerateSceneOutputSchema},
  prompt: `You are an AI screenwriter tasked with regenerating scenes for a screenplay.

  Given the following information about the scene, regenerate the scene description and dialogue to improve the scene.

  Title: {{{title}}}
  Location: {{{location}}}
  Time of Day: {{{timeOfDay}}}
  Description: {{{description}}}
  Dialogue: {{{dialogue}}}
  Genre: {{{genre}}}
  Tone: {{{tone}}}
  Script Type: {{{scriptType}}}

  Regenerate the scene, focusing on making the description more vivid and the dialogue more engaging, while keeping the scene consistent with its original intent.  Your output should fit within common screenplay formatting, and should not include any extra text other than the scene itself.

  Ensure the regenerated scene includes both a description and dialogue.

  Description:
  {{regeneratedScene.description}}

  Dialogue:
  {{regeneratedScene.dialogue}}`,
});

const regenerateSceneFlow = ai.defineFlow(
  {
    name: 'regenerateSceneFlow',
    inputSchema: RegenerateSceneInputSchema,
    outputSchema: RegenerateSceneOutputSchema,
  },
  async input => {
    const {output} = await regenerateScenePrompt(input);
    return output!;
  }
);
