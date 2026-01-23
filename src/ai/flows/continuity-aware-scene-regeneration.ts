'use server';

/**
 * @fileOverview An AI agent for regenerating screenplay scenes with continuity awareness.
 *
 * - continuityAwareSceneRegeneration - A function that regenerates a scene in a screenplay,
 *   considering previous and subsequent scenes for context and an optional user prompt for specific edits.
 * - ContinuityAwareSceneRegenerationInput - The input type for the function.
 * - ContinuityAwareSceneRegenerationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContinuityAwareSceneRegenerationInputSchema = z.object({
  previousScenes: z.string().describe('The content of the scenes preceding the current scene to maintain continuity.'),
  currentScene: z.object({
    title: z.string().describe('The title of the scene.'),
    location: z.string().describe('The location of the scene.'),
    timeOfDay: z.string().describe('The time of day for the scene.'),
    description: z.string().describe('The current description of the scene.'),
    dialogue: z.string().describe('The current dialogue of the scene.'),
  }),
  subsequentScenes: z.string().optional().describe('The content of the scenes that follow the current scene for forward-looking continuity.'),
  editPrompt: z.string().optional().describe('An optional prompt from the user specifying desired changes.'),
});

export type ContinuityAwareSceneRegenerationInput = z.infer<typeof ContinuityAwareSceneRegenerationInputSchema>;

const ContinuityAwareSceneRegenerationOutputSchema = z.object({
  regeneratedScene: z.object({
    description: z.string().describe('The AI-regenerated description of the scene.'),
    dialogue: z.string().describe('The AI-regenerated dialogue for the scene.'),
  }),
});

export type ContinuityAwareSceneRegenerationOutput = z.infer<typeof ContinuityAwareSceneRegenerationOutputSchema>;

export async function continuityAwareSceneRegeneration(input: ContinuityAwareSceneRegenerationInput): Promise<ContinuityAwareSceneRegenerationOutput> {
  return continuityAwareSceneRegenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'continuityAwareSceneRegenerationPrompt',
  input: {schema: ContinuityAwareSceneRegenerationInputSchema},
  output: {schema: ContinuityAwareSceneRegenerationOutputSchema},
  prompt: `You are an expert screenwriter. Your task is to regenerate a screenplay scene to improve it, while ensuring it remains consistent with the scenes that came before and after it. You may also be given a specific prompt to guide the regeneration.

### Previous Scenes Summary
This is what has happened in the story so far:
{{{previousScenes}}}

### Current Scene to Regenerate
- Title: {{{currentScene.title}}}
- Location: {{{currentScene.location}}}
- Time: {{{currentScene.timeOfDay}}}
- Current Description: {{{currentScene.description}}}
- Current Dialogue: {{{currentScene.dialogue}}}

{{#if subsequentScenes}}
### Subsequent Scenes Summary
This is what happens *after* this scene:
{{{subsequentScenes}}}
{{/if}}

{{#if editPrompt}}
### User's Edit Request
The user wants you to apply the following change:
"{{{editPrompt}}}"
{{/if}}

### Your Task
Regenerate the 'Description' and 'Dialogue' for the current scene.
- Make the description more vivid and the action clearer.
- Make the dialogue more engaging and natural.
- **Crucially, ensure the regenerated scene logically follows the "Previous Scenes Summary" and leads into the "Subsequent Scenes Summary".**
- If an "User's Edit Request" is provided, prioritize fulfilling that request while maintaining continuity.
- Output only the regenerated scene content in the specified JSON format.
`,
});

const continuityAwareSceneRegenerationFlow = ai.defineFlow(
  {
    name: 'continuityAwareSceneRegenerationFlow',
    inputSchema: ContinuityAwareSceneRegenerationInputSchema,
    outputSchema: ContinuityAwareSceneRegenerationOutputSchema,
  },
  async input => {
    // If there are no previous scenes, provide a neutral starting point.
    if (!input.previousScenes.trim()) {
      input.previousScenes = "No previous scenes. This is the beginning of the script.";
    }
    const {output} = await prompt(input);
    return output!;
  }
);
