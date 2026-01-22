// use server'

/**
 * @fileOverview A flow that improves dialogue with continuity awareness.
 *
 * - continuityAwareDialogueImprovement - A function that handles the dialogue improvement process.
 * - ContinuityAwareDialogueImprovementInput - The input type for the continuityAwareDialogueImprovement function.
 * - ContinuityAwareDialogueImprovementOutput - The return type for the continuityAwareDialogueImprovement function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContinuityAwareDialogueImprovementInputSchema = z.object({
  previousScenes: z.string().describe('The content of the scenes preceding the current scene.'),
  currentSceneDialogue: z.string().describe('The dialogue of the current scene to be improved.'),
});
export type ContinuityAwareDialogueImprovementInput = z.infer<typeof ContinuityAwareDialogueImprovementInputSchema>;

const ContinuityAwareDialogueImprovementOutputSchema = z.object({
  improvedDialogue: z.string().describe('The improved dialogue for the current scene, maintaining continuity with previous scenes.'),
});
export type ContinuityAwareDialogueImprovementOutput = z.infer<typeof ContinuityAwareDialogueImprovementOutputSchema>;

export async function continuityAwareDialogueImprovement(input: ContinuityAwareDialogueImprovementInput): Promise<ContinuityAwareDialogueImprovementOutput> {
  return continuityAwareDialogueImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'continuityAwareDialogueImprovementPrompt',
  input: {schema: ContinuityAwareDialogueImprovementInputSchema},
  output: {schema: ContinuityAwareDialogueImprovementOutputSchema},
  prompt: `You are a professional script writer. You are tasked with improving the dialogue of a scene in a movie script, ensuring that it maintains continuity with the scenes that came before it.

Previous Scenes:
{{{previousScenes}}}

Current Scene Dialogue:
{{{currentSceneDialogue}}}

Improved Dialogue:`, // The prompt is intentionally left lean, as this will be refined in follow-up iterations.
});

const continuityAwareDialogueImprovementFlow = ai.defineFlow(
  {
    name: 'continuityAwareDialogueImprovementFlow',
    inputSchema: ContinuityAwareDialogueImprovementInputSchema,
    outputSchema: ContinuityAwareDialogueImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
