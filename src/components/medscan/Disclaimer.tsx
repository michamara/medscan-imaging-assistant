import { AlertTriangle, ShieldAlert } from "lucide-react";
import { DISCLAIMER_TEXT, SIMULATED_LABEL } from "@/lib/exams";
import { cn } from "@/lib/utils";

export function SimulatedBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-center justify-center gap-2.5 rounded-xl border border-caution/40 bg-caution-soft px-4 py-3 text-center text-caution-foreground",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="font-mono text-xs font-semibold tracking-[0.12em] sm:text-sm">{SIMULATED_LABEL}</span>
    </div>
  );
}

export function SimulatedChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-caution/40 bg-caution-soft px-2.5 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.12em] text-caution-foreground",
        className,
      )}
    >
      <AlertTriangle className="h-3 w-3" />
      SIMULATED DEMO
    </span>
  );
}

export function Disclaimer({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className={cn(
        "flex gap-4 rounded-2xl border border-caution/40 bg-caution-soft text-caution-foreground",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caution/20">
        <ShieldAlert className="h-5 w-5" />
      </span>
      <div className="space-y-1">
        <p className="font-mono text-xs font-semibold tracking-[0.14em]">IMPORTANT DISCLAIMER</p>
        <p className={cn("leading-relaxed", compact ? "text-sm" : "text-sm sm:text-base")}>{DISCLAIMER_TEXT}</p>
      </div>
    </aside>
  );
}
