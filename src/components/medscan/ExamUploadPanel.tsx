import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Activity, Lock, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUploader, type SelectedImage } from "./ImageUploader";
import { AnalysisLoader } from "./AnalysisLoader";
import { Disclaimer } from "./Disclaimer";
import { ANALYSIS_STEPS, EXAMS, type ExamType } from "@/lib/exams";
import { addSession, createSessionId } from "@/lib/history";
import { rememberPreview } from "@/lib/image-session";
import { fileFormatLabel } from "@/lib/file-validation";

export function ExamUploadPanel({ type }: { type: ExamType }) {
  const exam = EXAMS[type];
  const navigate = useNavigate();
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [running, setRunning] = useState(false);
  const handedOff = useRef<string | null>(null);
  const imageRef = useRef<SelectedImage | null>(null);
  imageRef.current = image;

  useEffect(() => {
    return () => {
      const current = imageRef.current;
      if (current && handedOff.current !== current.url) URL.revokeObjectURL(current.url);
    };
  }, []);

  const select = useCallback((next: SelectedImage) => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return next;
    });
    toast.success("Image ready", { description: "Your preview was created locally in this browser." });
  }, []);

  const remove = useCallback(() => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const start = () => {
    if (!image) {
      toast.error("Please upload an image first", { description: "Choose a JPG, JPEG or PNG file to start the demo." });
      return;
    }
    setRunning(true);
  };

  const complete = useCallback(() => {
    const current = imageRef.current;
    if (!current) return;
    const id = createSessionId();
    handedOff.current = current.url;
    rememberPreview(id, current.url);
    try {
      addSession({ id, type, format: fileFormatLabel(current.file.type), sizeKb: current.file.size / 1024 });
    } catch {
      toast.error("History could not be saved", { description: "Your browser storage may be full or disabled." });
    }
    void navigate({ to: "/results/$sessionId", params: { sessionId: id } });
  }, [navigate, type]);

  const Icon = type === "ecg" ? Activity : ScanLine;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border bg-card p-4 shadow-card sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-soft text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-sans text-lg font-semibold tracking-normal text-primary">{exam.uploadLabel}</h2>
            <p className="text-sm text-muted-foreground">Step 1 of 2 — select an image to preview</p>
          </div>
        </div>
        <ImageUploader
          value={image}
          onSelect={select}
          onRemove={remove}
          uploadLabel={exam.uploadLabel}
          variant={type === "xray" ? "dark" : "light"}
          disabled={running}
        />
        <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Step 2 of 2 — results are predefined and educational.</p>
          <Button variant="sky" size="xl" onClick={start} disabled={running} aria-disabled={!image}>
            <Sparkles /> Start Demo Analysis
          </Button>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-3xl bg-gradient-navy p-6 text-navy-foreground shadow-lift">
          <p className="eyebrow text-sky">Privacy by design</p>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
              <span><strong className="font-semibold">Stays on your device.</strong> <span className="text-navy-foreground/70">Images are previewed in your browser and never uploaded to any server.</span></span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
              <span><strong className="font-semibold">Minimal history.</strong> <span className="text-navy-foreground/70">Only the exam type, date, format and file size are saved locally — never the image or its name.</span></span>
            </li>
            <li className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
              <span><strong className="font-semibold">Educational results.</strong> <span className="text-navy-foreground/70">The results screen is the same for every image and explains concepts, not findings.</span></span>
            </li>
          </ul>
        </div>
        <Disclaimer compact />
      </aside>

      {running && <AnalysisLoader title={`Running ${exam.shortName} demo`} steps={ANALYSIS_STEPS[type]} onComplete={complete} />}
    </div>
  );
}
