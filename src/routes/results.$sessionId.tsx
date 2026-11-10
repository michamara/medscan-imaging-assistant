import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Activity, ArrowLeft, Check, Clock, EyeOff, History, ImageOff, Loader2, Lock, RotateCcw, ScanLine, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Disclaimer, SimulatedBanner, SimulatedChip } from "@/components/medscan/Disclaimer";
import { Glossary } from "@/components/medscan/Glossary";
import { EcgLabelledDiagram } from "@/components/medscan/EcgWaveform";
import { SampleReport } from "@/components/medscan/SampleReport";
import { EXAMS, RESULT_CONTENT } from "@/lib/exams";
import { getSession, subscribeHistory, type DemoSession } from "@/lib/history";
import { getPreview } from "@/lib/image-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results/$sessionId")({
  head: () => ({
    meta: [
      { title: "Demo Results — MedScan" },
      { name: "description", content: "Simulated educational demonstration results. Not a medical diagnosis." },
      { property: "og:title", content: "Demo Results — MedScan" },
      { property: "og:description", content: "Simulated educational demonstration results. Not a medical diagnosis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

function useSession(id: string): DemoSession | null | undefined {
  return useSyncExternalStore(
    subscribeHistory,
    () => getSession(id) ?? null,
    () => undefined,
  );
}

function ResultsPage() {
  const { sessionId } = Route.useParams();
  const session = useSession(sessionId);

  if (session === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-sky" /> Loading demo session…
      </div>
    );
  }
  if (session === null) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-soft text-primary">
          <EyeOff className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-medium text-primary">Session not found</h1>
        <p className="mt-2 text-muted-foreground">This demo session may have been deleted from your history, or it was created on another device.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero"><Link to="/history">View history</Link></Button>
          <Button asChild variant="outline-navy"><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    );
  }
  return <ResultsDashboard session={session} />;
}

function ResultsDashboard({ session }: { session: DemoSession }) {
  const exam = EXAMS[session.type];
  const content = RESULT_CONTENT[session.type];
  const [preview, setPreview] = useState<string | undefined>();
  useEffect(() => setPreview(getPreview(session.id)), [session.id]);
  const isEcg = session.type === "ecg";
  const Icon = isEcg ? Activity : ScanLine;

  const pipeline = [
    { label: "Image previewed locally", done: true },
    { label: "File format and size validated", done: true },
    { label: "Educational module loaded", done: true },
    { label: "Medical interpretation", done: false, note: "Not performed" },
  ];

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <Link to={isEcg ? "/ecg" : "/xray"} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to {exam.title}
        </Link>
        <SimulatedBanner className="mt-5 animate-fade-up" />

        <header className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="animate-fade-up">
            <p className="eyebrow text-sky">Results dashboard · Session {session.id}</p>
            <h1 className="mt-3 text-4xl font-medium text-primary sm:text-5xl">{exam.title} — Demo Results</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {format(new Date(session.createdAt), "d MMMM yyyy, HH:mm")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline-navy"><Link to="/history"><History /> History</Link></Button>
            <Button asChild variant="hero"><Link to={isEcg ? "/ecg" : "/xray"}><RotateCcw /> New demo</Link></Button>
          </div>
        </header>

        {/* Summary row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryTile label="Examination type" value={exam.fullName} sub={exam.shortName} icon={<Icon className="h-5 w-5" />} />
          <SummaryTile
            label="Analysis status"
            value="Demo complete"
            sub="Simulated · no interpretation"
            icon={<Check className="h-5 w-5" />}
            tone="success"
          />
          <SummaryTile label="Data handling" value="Browser only" sub={`${session.format} · ${session.sizeKb} KB · not uploaded`} icon={<Lock className="h-5 w-5" />} />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="overflow-hidden rounded-3xl border bg-card shadow-card" aria-label="Uploaded image preview">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-sans text-base font-semibold tracking-normal text-primary">Uploaded image preview</h2>
              <SimulatedChip />
            </div>
            <div className={cn("relative flex aspect-[4/3] items-center justify-center overflow-hidden", isEcg ? "bg-ecg-grid" : "bg-navy-deep")}>
              {preview ? (
                <>
                  <img src={preview} alt="Your uploaded image, shown locally" className="max-h-full max-w-full object-contain" />
                  {!isEcg && <div className="pointer-events-none absolute inset-x-0 h-1/4 animate-scan" style={{ background: "var(--gradient-scan)" }} aria-hidden />}
                </>
              ) : (
                <div className={cn("flex max-w-xs flex-col items-center gap-3 p-6 text-center", isEcg ? "text-muted-foreground" : "text-navy-foreground/70")}>
                  <ImageOff className="h-8 w-8" />
                  <p className="text-sm">Image previews are never saved. They are only available in the browser tab where you uploaded them.</p>
                </div>
              )}
            </div>
            <p className="border-t bg-muted px-5 py-3 text-xs text-muted-foreground">
              Your image was displayed for reference only. It was not examined, measured or interpreted.
            </p>
          </section>

          <section className="flex flex-col rounded-3xl border bg-card p-6 shadow-card" aria-label="Analysis status">
            <h2 className="font-sans text-base font-semibold tracking-normal text-primary">Demonstration pipeline</h2>
            <ol className="mt-5 space-y-3">
              {pipeline.map((step, i) => (
                <li key={step.label} className="flex animate-fade-up items-center gap-3 rounded-xl border px-4 py-3" style={{ animationDelay: `${i * 120}ms` }}>
                  <span className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full", step.done ? "bg-success-soft text-success" : "bg-caution-soft text-caution-foreground")}>
                    {step.done ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                  <span className="flex-1 text-sm font-medium text-primary">{step.label}</span>
                  {step.note && <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-caution-foreground">{step.note}</span>}
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl bg-sky-soft p-5">
              <p className="eyebrow text-sky">Overview</p>
              <p className="mt-2 text-sm leading-relaxed text-primary">{content.overview}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-background">
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
          <section>
            <p className="eyebrow text-sky">Educational explanation</p>
            <h2 className="mt-2 text-3xl font-medium text-primary">Understanding the {exam.shortName}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {content.explanation.map((b, i) => (
                <article key={b.title} className="rounded-3xl border bg-card p-6 shadow-card">
                  <span className="font-display text-3xl font-light text-sky/60">0{i + 1}</span>
                  <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal text-primary">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-sky">What professionals review</p>
              <h2 className="mt-2 text-3xl font-medium text-primary">A systematic checklist</h2>
              <p className="mt-3 text-muted-foreground">These are the general topics a qualified clinician considers. MedScan provides no values or findings for any of them.</p>
              <ul className="mt-6 space-y-2">
                {content.reviewTopics.map((t) => (
                  <li key={t} className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
                    <span className="text-sm font-medium text-primary">{t}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Topic only</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pt-12">{isEcg ? <EcgLabelledDiagram className="shadow-lift" /> : <SampleReport />}</div>
          </section>

          <section>
            <p className="eyebrow text-sky">Medical terminology</p>
            <h2 className="mt-2 text-3xl font-medium text-primary">Key terms in simple English</h2>
            <div className="mt-8">
              <Glossary terms={content.glossary} />
            </div>
          </section>

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, sub, icon, tone }: { label: string; value: string; sub: string; icon: ReactNode; tone?: "success" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
      <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone === "success" ? "bg-success-soft text-success" : "bg-sky-soft text-primary")}>{icon}</span>
      <div className="min-w-0">
        <p className="eyebrow text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold text-primary">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
