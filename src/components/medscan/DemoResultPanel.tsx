import { AlertTriangle, ImageOff, Lock, MonitorSmartphone, RotateCcw, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DEMO_RESULT } from "@/lib/exams";
import { cn } from "@/lib/utils";

export interface DemoResultInfo {
  previewUrl?: string | undefined;
  examLabel: string;
  categoryLabel?: string | undefined;
  format: string;
  sizeLabel: string;
  dark: boolean;
}

export function ResultDisclaimer({ className }: { className?: string }) {
  return (
    <div role="note" aria-label="Medical disclaimer" className={cn("flex items-start gap-3 rounded-2xl border-2 border-caution/60 bg-caution-soft p-4 text-caution-foreground sm:p-5", className)}>
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        <p className="font-mono text-xs font-semibold tracking-[0.14em]">MEDICAL DISCLAIMER</p>
        <p className="text-sm font-medium leading-relaxed sm:text-base">{DEMO_RESULT.disclaimer}</p>
      </div>
    </div>
  );
}

/** Fixed, image-independent prototype preview. Contains no findings or lessons. */
export function DemoResultPanel({ info, onReset, actions }: { info: DemoResultInfo; onReset?: () => void; actions?: ReactNode }) {
  return (
    <section aria-labelledby="demo-result-title" className="animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden rounded-3xl border bg-card shadow-lift">
      <div className="flex flex-col gap-4 border-b bg-gradient-navy p-6 text-navy-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky/20 text-sky">
            <MonitorSmartphone className="h-6 w-6" />
          </span>
          <h2 id="demo-result-title" className="text-2xl font-medium sm:text-3xl">
            {DEMO_RESULT.title}
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-caution/60 bg-caution-soft px-3.5 py-1.5 font-mono text-xs font-bold tracking-[0.14em] text-caution-foreground sm:self-auto">
          <AlertTriangle className="h-3.5 w-3.5" /> {DEMO_RESULT.status}
        </span>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr]">
        <figure className="overflow-hidden rounded-2xl border">
          <div className={cn("flex aspect-[4/3] items-center justify-center", info.dark ? "bg-navy-deep" : "bg-ecg-grid")}>
            {info.previewUrl ? (
              <img src={info.previewUrl} alt="Your uploaded image, shown locally" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className={cn("flex max-w-xs flex-col items-center gap-3 p-6 text-center text-sm", info.dark ? "text-navy-foreground/70" : "text-muted-foreground")}>
                <ImageOff className="h-8 w-8" />
                Image previews are never saved. They are only available in the browser tab where you uploaded them.
              </div>
            )}
          </div>
          <figcaption className="flex items-center gap-2 border-t bg-muted px-4 py-2.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 shrink-0 text-success" /> Kept in your browser — never uploaded.
          </figcaption>
        </figure>

        <div className="flex flex-col gap-5">
          <div className="space-y-4">
            {DEMO_RESULT.paragraphs.map((p) => (
              <p key={p} className="text-base leading-relaxed text-primary">
                {p}
              </p>
            ))}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Fact label="Exam" value={info.examLabel} />
            <Fact label="Body area" value={info.categoryLabel ?? "—"} />
            <Fact label="File" value={`${info.format} · ${info.sizeLabel}`} />
            <Fact label="Analysis" value="Not performed" tone="caution" />
          </dl>

          {(onReset || actions) && (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {onReset && (
                <Button variant="hero" size="lg" onClick={onReset}>
                  <RotateCcw /> Reset &amp; upload another image
                </Button>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <ResultDisclaimer />
      </div>
    </section>
  );
}

function Fact({ label, value, tone }: { label: string; value: string; tone?: "caution" }) {
  return (
    <div className="rounded-xl border px-3 py-2.5">
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 truncate font-semibold", tone === "caution" ? "text-caution-foreground" : "text-primary")}>{value}</dd>
    </div>
  );
}
