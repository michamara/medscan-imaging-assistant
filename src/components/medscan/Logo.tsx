import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-navy shadow-card",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
        <path
          d="M3 17h6l2.5-6 4 12 3.5-9 2 3H29"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sky"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="MedScan home">
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      <span className="font-display text-xl font-semibold tracking-tight text-primary">
        Med<span className="text-sky">Scan</span>
      </span>
    </Link>
  );
}
