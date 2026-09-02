import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="currentColor" className="text-primary" />
      <path
        d="M9.2 8.4h7.1c3.2 0 5.4 1.7 5.4 4.3 0 1.8-1.1 3.2-2.9 3.8 2.2.5 3.6 2.1 3.6 4.3 0 2.9-2.4 4.8-6 4.8H9.2V8.4zm3.5 6.7h3.4c1.5 0 2.4-.8 2.4-1.9s-.9-1.8-2.4-1.8h-3.4v3.7zm0 7.1h4c1.7 0 2.7-.9 2.7-2.1s-1-2-2.7-2H12.7v4.1z"
        fill="#07140c"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className="text-sm font-medium tracking-wide text-muted">bachelor</span>
      <span className="font-display text-lg font-semibold tracking-tight">money</span>
    </div>
  );
}
