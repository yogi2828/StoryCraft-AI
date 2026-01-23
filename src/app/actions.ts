'use server';

import { generateScreenplayScene, GenerateScreenplaySceneInput } from '@/ai/flows/generate-screenplay-scene';
import { regenerateScene, RegenerateSceneInput } from '@/ai/flows/regenerate-scene';
import { continuityAwareDialogueImprovement, ContinuityAwareDialogueImprovementInput } from '@/ai/flows/continuity-aware-dialogue-improvement';
import { generateFullScript, GenerateFullScriptInput } from '@/ai/flows/generate-full-script';

export async function generateSceneAction(input: GenerateScreenplaySceneInput) {
    try {
        const result = await generateScreenplayScene(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in generateSceneAction:', error);
        return { success: false, error: 'Failed to generate scene.' };
    }
}

export async function generateFullScriptAction(input: GenerateFullScriptInput) {
    try {
        const result = await generateFullScript(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in generateFullScriptAction:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to generate script: ${errorMessage}` };
    }
}

export async function regenerateSceneAction(input: RegenerateSceneInput) {
    try {
        const result = await regenerateScene(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in regenerateSceneAction:', error);
        return { success: false, error: 'Failed to regenerate scene.' };
    }
}

export async function improveDialogueAction(input: ContinuityAwareDialogueImprovementInput) {
    try {
        const result = await continuityAwareDialogueImprovement(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in improveDialogueAction:', error);
        return { success: false, error: 'Failed to improve dialogue.' };
    }
}
