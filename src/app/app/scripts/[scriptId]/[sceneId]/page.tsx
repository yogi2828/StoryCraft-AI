import { notFound } from 'next/navigation';
import { SceneEditor } from './editor';

export default function SceneEditorPage({ params }: { params: { scriptId: string, sceneId: string } }) {
  // All logic is in the client component to handle state, forms, and localStorage
  return <SceneEditor scriptId={params.scriptId} sceneId={params.sceneId} />;
}
