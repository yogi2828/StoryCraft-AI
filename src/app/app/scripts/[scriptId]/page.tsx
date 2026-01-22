import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getScriptById } from '@/lib/storage.ts';
import { FileDown, PlusCircle } from 'lucide-react';
import { SceneList } from './scene-list';
import type { Script } from '@/lib/types';


async function getScript(id: string): Promise<Script | undefined> {
    // In a real app, this would be a server-side fetch.
    // For this simulation, we can't use the client-side storage function here.
    // This page will be a client component to access localStorage.
    return undefined;
}


export default function ScriptOverviewPage({ params }: { params: { scriptId: string } }) {
  // This page is now a client component via scene-list.tsx which needs access to localStorage
  // The logic is moved into SceneList
  return <SceneList scriptId={params.scriptId} />;
}
