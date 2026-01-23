'use server';
/**
 * @fileOverview An AI agent for refining a script based on a user's edit.
 *
 * - refineScriptFromEdit - A function that takes a script with a user's edit,
 *   and regenerates all subsequent scenes to ensure continuity.
 * - RefineScriptFromEditInput - The input type for the function.
 * - RefineScriptFromEditOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  sceneNumber: z.number(),
  title: z.string(),
  location: z.string(),
  timeOfDay: z.string(),
  description: z.string(),
  dialogue: z.string(),
});

const RefineScriptFromEditInputSchema = z.object({
  title: z.string().describe('The title of the screenplay.'),
  genre: z.string().describe('The genre of the screenplay.'),
  tone: z.string().describe('The tone of the screenplay.'),
  scenes: z.array(SceneSchema).describe('The full array of scenes, including the user\'s manual edits.'),
  editedSceneIndex: z.number().describe('The index of the scene that the user edited.'),
});

export type RefineScriptFromEditInput = z.infer<typeof RefineScriptFromEditInputSchema>;

const RefineScriptFromEditOutputSchema = z.object({
  scenes: z.array(SceneSchema.pick({ description: true, dialogue: true })),
});

export type RefineScriptFromEditOutput = z.infer<typeof RefineScriptFromEditOutputSchema>;

export async function refineScriptFromEdit(input: RefineScriptFromEditInput): Promise<RefineScriptFromEditOutput> {
  return refineScriptFromEditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineScriptFromEditPrompt',
  input: {schema: RefineScriptFromEditInputSchema},
  output: {schema: RefineScriptFromEditOutputSchema},
  prompt: `You are a master screenwriter and script doctor. The user has provided a screenplay and made a manual edit to one of the scenes.
Your task is to accept the user's edit as the new source of truth and then regenerate ALL subsequent scenes to ensure the story remains logical, creative, and continuous.

### Screenplay Details
- Title: {{{title}}}
- Genre: {{{genre}}}
- Tone: {{{tone}}}

### Instructions
1. The user has edited scene number **{{scenes[editedSceneIndex].sceneNumber}}**. The content of this scene in the provided data is the user's final version. Do NOT change it.
2. Starting from the scene *after* the user's edit (scene number **{{math scenes[editedSceneIndex].sceneNumber '+' 1}}**), you must regenerate the 'description' and 'dialogue' for all following scenes.
3. The regeneration should creatively and logically follow the new direction set by the user's edit.
4. For the scenes you regenerate, maintain their original 'location' and 'timeOfDay' unless a change is absolutely necessary for story continuity.
5. Return ONLY the regenerated 'description' and 'dialogue' for the scenes that follow the edit. The number of objects in your output array must match the number of scenes you were asked to regenerate.

### Full Script (with user's edit)
{{#each scenes}}
---
SCENE {{sceneNumber}}
TITLE: {{title}}
LOCATION: {{location}}
TIME: {{timeOfDay}}

DESCRIPTION:
{{description}}

DIALOGUE:
{{dialogue}}
---
{{/each}}
`,
});

const refineScriptFromEditFlow = ai.defineFlow(
  {
    name: 'refineScriptFromEditFlow',
    inputSchema: RefineScriptFromEditInputSchema,
    outputSchema: RefineScriptFromEditOutputSchema,
  },
  async (input) => {
    // We only need to prompt the AI to regenerate scenes *after* the edited one.
    const scenesToRegenerateCount = input.scenes.length - (input.editedSceneIndex + 1);

    if (scenesToRegenerateCount <= 0) {
      // If the last scene was edited, there's nothing to regenerate.
      return { scenes: [] };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
