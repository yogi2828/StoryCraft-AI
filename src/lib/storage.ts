'use client';
import type { Script, Scene } from './types';

const SCRIPTS_KEY = 'storysynth_scripts';

function getScriptsFromStorage(): Script[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SCRIPTS_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse scripts from localStorage", error);
    return [];
  }
}

function saveScriptsToStorage(scripts: Script[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}

export function getScripts(): Script[] {
  return getScriptsFromStorage();
}

export function getScriptById(scriptId: string): Script | undefined {
  const scripts = getScriptsFromStorage();
  return scripts.find(s => s.id === scriptId);
}

export function saveScript(scriptData: Omit<Script, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'scenes'>, scenes: Scene[]): Script {
  const scripts = getScriptsFromStorage();
  const now = new Date().toISOString();
  const newScript: Script = {
    ...scriptData,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    scenes: scenes.map((scene, index) => ({...scene, sceneNumber: index + 1})),
  };
  saveScriptsToStorage([...scripts, newScript]);
  return newScript;
}

export function updateScript(scriptId: string, updates: Partial<Script>): Script | undefined {
  const scripts = getScriptsFromStorage();
  const scriptIndex = scripts.findIndex(s => s.id === scriptId);
  if (scriptIndex === -1) return undefined;
  
  const updatedScript = { ...scripts[scriptIndex], ...updates, updatedAt: new Date().toISOString() };
  scripts[scriptIndex] = updatedScript;
  saveScriptsToStorage(scripts);
  return updatedScript;
}

export function deleteScript(scriptId: string): void {
  const scripts = getScriptsFromStorage();
  const updatedScripts = scripts.filter(s => s.id !== scriptId);
  saveScriptsToStorage(updatedScripts);
}

export function addScene(scriptId: string, sceneData: Omit<Scene, 'id' | 'createdAt' | 'updatedAt' | 'sceneNumber' | 'scriptId'>): Script | undefined {
  const scripts = getScriptsFromStorage();
  const scriptIndex = scripts.findIndex(s => s.id === scriptId);
  if (scriptIndex === -1) return undefined;

  const now = new Date().toISOString();
  const newScene: Scene = {
    ...sceneData,
    id: crypto.randomUUID(),
    scriptId,
    sceneNumber: scripts[scriptIndex].scenes.length + 1,
    createdAt: now,
    updatedAt: now,
  };
  
  scripts[scriptIndex].scenes.push(newScene);
  scripts[scriptIndex].updatedAt = now;
  saveScriptsToStorage(scripts);
  return scripts[scriptIndex];
}

export function updateScene(scriptId: string, sceneId: string, updates: Partial<Scene>): Script | undefined {
    const scripts = getScriptsFromStorage();
    const scriptIndex = scripts.findIndex(s => s.id === scriptId);
    if (scriptIndex === -1) return undefined;

    const sceneIndex = scripts[scriptIndex].scenes.findIndex(sc => sc.id === sceneId);
    if (sceneIndex === -1) return undefined;

    const now = new Date().toISOString();
    scripts[scriptIndex].scenes[sceneIndex] = { ...scripts[scriptIndex].scenes[sceneIndex], ...updates, updatedAt: now };
    scripts[scriptIndex].updatedAt = now;
    saveScriptsToStorage(scripts);
    return scripts[scriptIndex];
}

export function deleteScene(scriptId: string, sceneId: string): Script | undefined {
  const scripts = getScriptsFromStorage();
  const scriptIndex = scripts.findIndex(s => s.id === scriptId);
  if (scriptIndex === -1) return undefined;

  scripts[scriptIndex].scenes = scripts[scriptIndex].scenes
    .filter(sc => sc.id !== sceneId)
    .map((sc, index) => ({ ...sc, sceneNumber: index + 1 }));

  scripts[scriptIndex].updatedAt = new Date().toISOString();
  saveScriptsToStorage(scripts);
  return scripts[scriptIndex];
}
