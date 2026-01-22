'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileDown, Trash2, PlusCircle, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Script } from '@/lib/types';
import { getScripts, deleteScript } from '@/lib/storage';
import { exportScriptToPDF } from '@/lib/pdf';
import { Skeleton } from '@/components/ui/skeleton';

export function ScriptList() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setScripts(getScripts());
    setIsLoading(false);
  }, []);

  const handleDelete = (scriptId: string) => {
    deleteScript(scriptId);
    setScripts(getScripts());
    toast({
      title: 'Script Deleted',
      description: 'The script has been permanently removed.',
    });
  };
  
  const handleDownload = (script: Script) => {
    exportScriptToPDF(script);
    toast({
      title: 'Download Started',
      description: `${script.title} is being downloaded as a PDF.`,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (scripts.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold">Your Library is Empty</h3>
        <p className="text-muted-foreground mt-2">
          You haven't created any scripts yet.
        </p>
        <Button asChild className="mt-4">
          <Link href="/app/generate">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Script
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Scenes</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scripts.map((script) => (
            <TableRow key={script.id} className="cursor-pointer" onClick={() => router.push(`/app/scripts/${script.id}`)}>
              <TableCell className="font-medium">{script.title}</TableCell>
              <TableCell>{script.genre}</TableCell>
              <TableCell>{script.scenes.length}</TableCell>
              <TableCell>
                {new Date(script.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                       <DropdownMenuItem onClick={() => router.push(`/app/scripts/${script.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        View / Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(script)}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        script "{script.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(script.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
