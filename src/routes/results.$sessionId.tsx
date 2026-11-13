import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowLeft, Clock, EyeOff, History, Loader2, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DemoResultPanel } from "@/components/medscan/DemoResultPanel";
import { EXAMS, xrayCategoryLabel } from "@/lib/exams";
import { getSession, subscribeHistory, type DemoSession } from "@/lib/history";
import { getPreview } from "@/lib/image-session";

export const Route = createFileRoute("/results/$sessionId")({
  head: () => ({
    meta: [
      { title: "Image Analysis — Prototype Preview · MedScan" },
      { name: "description", content: "Prototype preview of how MedScan will present image analysis results. No medical analysis or diagnosis has been performed." },
      { property: "og:title", content: "Image Analysis — Prototype Preview · MedScan" },
      { property: "og:description", content: "Prototype preview screen. Not a medical device and not a diagnosis." },
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
        <Loader2 className="h-5 w-5 animate-spin text-sky" /> Loading session…
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
        <p className="mt-2 text-muted-foreground">This session may have been deleted from your history, or it was created on another device.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero"><Link to="/history">View history</Link></Button>
          <Button asChild variant="outline-navy"><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    );
  }
  return <SessionResult session={session} />;
}

function SessionResult({ session }: { session: DemoSession }) {
  const exam = EXAMS[session.type];
  const isEcg = session.type === "ecg";
  const [preview, setPreview] = useState<string | undefined>();
  useEffect(() => setPreview(getPreview(session.id)), [session.id]);

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to history
        </Link>
        <header className="mb-6 mt-6">
          <p className="eyebrow text-sky">{exam.title} · Session {session.id}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> {format(new Date(session.createdAt), "d MMMM yyyy, HH:mm")}
          </p>
        </header>
        <DemoResultPanel
          info={{
            previewUrl: preview,
            examLabel: exam.shortName,
            categoryLabel: session.category ? xrayCategoryLabel(session.category) : undefined,
            format: session.format,
            sizeLabel: `${session.sizeKb} KB`,
            dark: !isEcg,
          }}
          actions={
            <>
              <Button asChild variant="hero" size="lg">
                <Link to={isEcg ? "/ecg" : "/xray"}><RotateCcw /> Upload another image</Link>
              </Button>
              <Button asChild variant="outline-navy" size="lg">
                <Link to="/history"><History /> History</Link>
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
}
