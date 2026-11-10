import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SimulatedChip } from "./Disclaimer";

const STEP_MS = 850;

export function AnalysisLoader({ steps, onComplete, title }: { steps: string[]; onComplete: () => void; title: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= steps.length) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrent((c) => c + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [current, steps.length, onComplete]);

  const pct = Math.min(100, Math.round((current / steps.length) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 p-4 backdrop-blur-sm animate-in fade-in-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loader-title"
      aria-live="polite"
    >
      <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl border bg-card p-6 shadow-lift sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative inline-flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sky/40" />
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-navy text-navy-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          </div>
          <SimulatedChip />
        </div>
        <h2 id="loader-title" className="text-2xl font-medium text-primary">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preparing a predefined educational demonstration. No medical interpretation is being performed.
        </p>
        <Progress value={pct} className="mt-6 h-1.5 bg-sky-soft" />
        <ol className="mt-6 space-y-3">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={step} className={cn("flex items-center gap-3 text-sm transition-colors", done ? "text-primary" : active ? "text-primary" : "text-muted-foreground/60")}>
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                    done && "border-success bg-success text-navy-foreground",
                    active && "border-sky bg-sky-soft",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin text-sky" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                {step}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
