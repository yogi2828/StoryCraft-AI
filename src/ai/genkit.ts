import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: 'AIzaSyDTA6lp4H_g7owYKgviy1wMTGTuo1aQ2l4' })],
  model: 'googleai/gemini-2.5-flash',
});