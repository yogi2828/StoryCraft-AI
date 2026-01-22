import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M15.25 3.25L5.75 6.75L9 16.25L18.5 12.75L15.25 3.25Z" />
        <path d="M9.5 16.75L4.75 18.25L3.25 17.25L4.25 14.5L9.5 16.75Z" />
        <path d="M14.5 3.75L20.25 2.25L21.75 3.25L20.75 6L14.5 3.75Z" />
    </svg>
  );
}

export function AIGenerateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M9.5 2.5a2.5 2.5 0 0 1 5 0" />
      <path d="M6.25 5A2.25 2.25 0 0 0 4 7.25v.14a5.5 5.5 0 0 0 0 9.22v.14A2.25 2.25 0 0 0 6.25 19h11.5A2.25 2.25 0 0 0 20 16.75v-.14a5.5 5.5 0 0 0 0-9.22v-.14A2.25 2.25 0 0 0 17.75 5Z" />
      <path d="M12 8v8" />
      <path d="M16 12H8" />
    </svg>
  );
}

export function SceneEditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 0 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

export function PDFExportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  );
}
