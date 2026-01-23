import { config } from 'dotenv';
config();

import '@/ai/flows/generate-screenplay-scene.ts';
import '@/ai/flows/continuity-aware-scene-regeneration.ts';
import '@/ai/flows/generate-full-script.ts';
