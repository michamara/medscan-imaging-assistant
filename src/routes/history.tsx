import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useSyncExternalStore } from "react";
import { format } from "date-fns";
import { Activity, ArrowRight, Eye, History as HistoryIcon, Lock, ScanLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/medscan/PageHeader";
import { SimulatedChip } from "@/components/medscan/Disclaimer";
import { EXAMS, xrayCategoryLabel, type ExamType } from "@/lib/exams";
import { clearHistory, deleteSession, getHistory, subscribeHistory, type DemoSession } from "@/lib/history";
import { forgetAllPreviews, forgetPreview } from "@/lib/image-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Demo History — MedScan" },
      { name: "description", content: "Review your previous MedScan demo sessions. Only non-sensitive metadata is stored on this device." },
      { property: "og:title", content: "Demo History — MedScan" },
      { property: "og:description", content: "Review previous MedScan demonstration sessions stored locally on your device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const EMPTY: DemoSession[] = [];
type Filter = "all" | ExamType;

function HistoryPage() {
  const sessions = useSyncExternalStore(subscribeHistory, getHistory, () => EMPTY);
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => (filter === "all" ? sessions : sessions.filter((s) => s.type === filter)), [sessions, filter]);
  const counts = {
    all: sessions.length,
    ecg: sessions.filter((s) => s.type === "ecg").length,
    xray: sessions.filter((s) => s.type === "xray").length,
  };

  const remove = (id: string) => {
    deleteSession(id);
    forgetPreview(id);
    toast.success("Session deleted");
  };

  const clearAll = () => {
    clearHistory();
    forgetAllPreviews();
    toast.success("History cleared", { description: "All demo sessions were removed from this device." });
  };

  return (
    <>
      <PageHeader
        eyebrow="Analysis history"
        title="Previous demo sessions"
        description="Revisit your earlier demonstrations. Only the exam type, date, file format and size are stored — on this device only."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full border bg-card p-1 shadow-card" role="tablist" aria-label="Filter by exam type">
            {(["all", "ecg", "xray"] as const).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary",
                )}
              >
                {f === "all" ? "All" : EXAMS[f].shortName} <span className="ml-1 font-mono text-xs opacity-70">{counts[f]}</span>
              </button>
            ))}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={sessions.length === 0}>
                <Trash2 /> Delete history
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-primary">Delete all demo history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes all {sessions.length} saved demo sessions from this device. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {visible.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed bg-muted px-6 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-card">
              <HistoryIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-medium text-primary">{sessions.length === 0 ? "No demo sessions yet" : "No sessions match this filter"}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Run an ECG or X-ray demonstration and it will appear here.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero"><Link to="/ecg">Start ECG demo <ArrowRight /></Link></Button>
              <Button asChild variant="outline-navy"><Link to="/xray">Start X-ray demo</Link></Button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {visible.map((s, i) => {
              const exam = EXAMS[s.type];
              const Icon = s.type === "ecg" ? Activity : ScanLine;
              return (
                <li
                  key={s.id}
                  className="flex animate-fade-up flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card transition-all hover:border-sky/40 hover:shadow-lift sm:flex-row sm:items-center sm:p-5"
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span className={cn("inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", s.type === "ecg" ? "bg-sky-soft text-primary" : "bg-gradient-navy text-navy-foreground")}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-primary">{exam.title}</p>
                        <SimulatedChip />
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {format(new Date(s.createdAt), "d MMM yyyy · HH:mm")}{s.category ? ` · ${xrayCategoryLabel(s.category)}` : ""} · {s.format} · {s.sizeKb} KB · #{s.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="hero" size="sm" className="flex-1 sm:flex-none">
                      <Link to="/results/$sessionId" params={{ sessionId: s.id }}>
                        <Eye /> View results
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(s.id)} aria-label={`Delete ${exam.title} session from ${format(new Date(s.createdAt), "d MMM yyyy HH:mm")}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-success" /> Stored in your browser only. Images and file names are never saved.
        </p>
      </section>
    </>
  );
}
