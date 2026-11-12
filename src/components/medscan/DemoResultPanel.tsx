import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, FlaskConical, Info, Lock, RotateCcw, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafetyNotice } from "./Disclaimer";
import { DEMO_RESULT } from "@/lib/exams";
import { cn } from "@/lib/utils";

export interface DemoResultInfo {
  sessionId: string;
  previewUrl: string;
  examLabel: string;
  categoryLabel?: string;
  format: string;
  sizeLabel: string;
  dark: boolean;
}

/** Fixed, image-independent result shown after the simulated analysis. */
export function DemoResultPanel({ info, onReset }: { info: DemoResultInfo; onReset: () => void }) {
  return (
    <section
      aria-labelledby="demo-result-title"
      className="animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden rounded-3xl border bg-card shadow-lift"
    >
      <div className="flex flex-col gap-4 border-b bg-gradient-navy p-6 text-navy-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky/20 text-sky">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="eyebrow text-sky">Demo result</p>
            <h2 id="demo-result-title" className="mt-1 text-2xl font-medium sm:text-3xl">
              {DEMO_RESULT.title}
            </h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-caution/60 bg-caution-soft px-3.5 py-1.5 font-mono text-xs font-bold tracking-[0.14em] text-caution-foreground sm:self-auto">
          <AlertTriangle className="h-3.5 w-3.5" /> {DEMO_RESULT.status}
        </span>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr]">
        <figure className="overflow-hidden rounded-2xl border">
          <div className={cn("flex aspect-[4/3] items-center justify-center", info.dark ? "bg-navy-deep" : "bg-ecg-grid")}>
            <img src={info.previewUrl} alt="Your uploaded image, shown locally for reference" className="max-h-full max-w-full object-contain" />
          </div>
          <figcaption className="flex items-center gap-2 border-t bg-muted px-4 py-2.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 shrink-0 text-success" /> Shown for reference only — not examined, measured or interpreted.
          </figcaption>
        </figure>

        <div className="flex flex-col gap-5">
          <p className="text-base leading-relaxed text-primary sm:text-lg">{DEMO_RESULT.message}</p>

          <div className="flex gap-3 rounded-2xl bg-sky-soft p-4 text-sm text-primary">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
            <p>
              <strong className="font-semibold">Independent of your image.</strong> {DEMO_RESULT.independence} MedScan is an educational
              prototype.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Fact label="Exam" value={info.examLabel} />
            <Fact label="Body area" value={info.categoryLabel ?? "—"} />
            <Fact label="File" value={`${info.format} · ${info.sizeLabel}`} />
            <Fact label="Diagnosis" value="Not performed" tone="caution" />
          </dl>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="hero" size="lg" onClick={onReset}>
              <RotateCcw /> Reset &amp; try another image
            </Button>
            <Button asChild variant="sky" size="lg">
              <Link to="/learning-lab">
                <FlaskConical /> Explore the X-ray Learning Lab <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline-navy" size="lg">
              <Link to="/results/$sessionId" params={{ sessionId: info.sessionId }}>
                <ScrollText /> Full educational walkthrough
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <SafetyNotice />
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
