'use server';

import { generateScreenplayScene, GenerateScreenplaySceneInput } from '@/ai/flows/generate-screenplay-scene';
import { generateFullScript, GenerateFullScriptInput } from '@/ai/flows/generate-full-script';
import { continuityAwareSceneRegeneration, ContinuityAwareSceneRegenerationInput } from '@/ai/flows/continuity-aware-scene-regeneration';
import { refineScriptFromEdit, RefineScriptFromEditInput } from '@/ai/flows/refine-script-from-edit';

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

export async function continuityAwareRegenerateSceneAction(input: ContinuityAwareSceneRegenerationInput) {
    try {
        const result = await continuityAwareSceneRegeneration(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in continuityAwareRegenerateSceneAction:', error);
        return { success: false, error: 'Failed to regenerate scene with continuity.' };
    }
}

export async function refineScriptAction(input: RefineScriptFromEditInput) {
    try {
        const result = await refineScriptFromEdit(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in refineScriptAction:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to refine script: ${errorMessage}` };
    }
}
