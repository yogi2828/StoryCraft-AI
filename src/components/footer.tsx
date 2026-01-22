import Link from 'next/link';
import { Logo } from '@/components/icons';

export function Footer() {
  return (
    <footer className="bg-muted/50 text-muted-foreground border-t">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">StorySynth</span>
          </Link>
          <p className="text-sm">
            From Idea to Screenplay — Instantly.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
          <div className="grid gap-2">
            <h4 className="font-semibold text-foreground">Product</h4>
            <Link href="/#features" className="hover:text-foreground" prefetch={false}>
              Features
            </Link>
            <Link href="/app/generate" className="hover:text-foreground" prefetch={false}>
              Generator
            </Link>
          </div>
          <div className="grid gap-2">
            <h4 className="font-semibold text-foreground">Company</h4>
            <Link href="/#about" className="hover:text-foreground" prefetch={false}>
              About
            </Link>
            <Link href="/#contact" className="hover:text-foreground" prefetch={false}>
              Contact
            </Link>
          </div>
          <div className="grid gap-2">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <Link href="#" className="hover:text-foreground" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground" prefetch={false}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm md:px-6">
          <p>&copy; 2024 StorySynth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
