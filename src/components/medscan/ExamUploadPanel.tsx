import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, AlertCircle, Bone, Footprints, Hand, Lock, RotateCcw, ScanLine, ShieldCheck, Smile, Sparkles, Wind } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUploader, type SelectedImage } from "./ImageUploader";
import { AnalysisLoader } from "./AnalysisLoader";
import { DemoResultPanel, type DemoResultInfo } from "./DemoResultPanel";
import { Disclaimer } from "./Disclaimer";
import {
  ANALYSIS_STEPS,
  DEMO_ANALYSIS_MS,
  EXAMS,
  NO_IMAGE_MESSAGE,
  XRAY_CATEGORIES,
  xrayCategoryLabel,
  type ExamType,
  type XrayCategory,
} from "@/lib/exams";
import { addSession, createSessionId } from "@/lib/history";
import { rememberPreview } from "@/lib/image-session";
import { fileFormatLabel, formatFileSize } from "@/lib/file-validation";
import { cn } from "@/lib/utils";

type Phase = { name: "idle" } | { name: "loading" } | { name: "done"; info: DemoResultInfo } | { name: "error"; message: string };

const CATEGORY_ICONS: Record<XrayCategory, typeof Bone> = {
  chest: Wind,
  "arm-hand": Hand,
  "leg-foot": Footprints,
  spine: Bone,
  dental: Smile,
};

export function ExamUploadPanel({ type }: { type: ExamType }) {
  const exam = EXAMS[type];
  const isXray = type === "xray";
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [category, setCategory] = useState<XrayCategory>("chest");
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [missingImage, setMissingImage] = useState(false);
  const handedOff = useRef(new Set<string>());
  const imageRef = useRef<SelectedImage | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  imageRef.current = image;

  const release = (img: SelectedImage | null) => {
    if (img && !handedOff.current.has(img.url)) URL.revokeObjectURL(img.url);
  };

  useEffect(() => () => release(imageRef.current), []);

  // Bring the loader / result into view whenever the phase changes.
  useEffect(() => {
    if (phase.name === "idle") return;
    const t = setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => clearTimeout(t);
  }, [phase.name]);

  const select = useCallback((next: SelectedImage) => {
    setImage((prev) => {
      release(prev);
      return next;
    });
    setMissingImage(false);
    setPhase({ name: "idle" });
    toast.success("Image ready", { description: "Your preview was created locally in this browser." });
  }, []);

  const remove = useCallback(() => {
    setImage((prev) => {
      release(prev);
      return null;
    });
    setPhase({ name: "idle" });
  }, []);

  const analyze = () => {
    if (phase.name === "loading") return;
    if (!image) {
      setMissingImage(true);
      toast.error(NO_IMAGE_MESSAGE, { description: "Choose a JPG, JPEG or PNG file, then click Analyze Image." });
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setMissingImage(false);
    setPhase({ name: "loading" });
  };

  const complete = useCallback(() => {
    try {
      const current = imageRef.current;
      if (!current) throw new Error("missing image");
      const id = createSessionId();
      handedOff.current.add(current.url);
      rememberPreview(id, current.url);
      const format = fileFormatLabel(current.file.type);
      try {
        addSession({ id, type, format, sizeKb: current.file.size / 1024, ...(isXray ? { category } : {}) });
      } catch {
        toast.warning("History could not be saved", { description: "Your browser storage may be full or disabled. The demo still works." });
      }
      setPhase({
        name: "done",
        info: {
          previewUrl: current.url,
          examLabel: exam.shortName,
          categoryLabel: isXray ? xrayCategoryLabel(category) : undefined,
          format,
          sizeLabel: formatFileSize(current.file.size),
          dark: isXray,
        },
      });
    } catch {
      setPhase({ name: "error", message: "Something went wrong while preparing the preview. Please check your image and try again." });
      toast.error("Preview could not be shown", { description: "Please try again or choose another image." });
    }
  }, [category, exam.shortName, isXray, type]);

  const reset = () => {
    setImage((prev) => {
      release(prev);
      return null;
    });
    setPhase({ name: "idle" });
    setMissingImage(false);
    setTimeout(() => uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const running = phase.name === "loading";
  const Icon = type === "ecg" ? Activity : ScanLine;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div ref={uploadRef} className="scroll-mt-24 rounded-3xl border bg-card p-4 shadow-card sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-soft text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-sans text-lg font-semibold tracking-normal text-primary">{exam.uploadLabel}</h2>
              <p className="text-sm text-muted-foreground">
                {isXray ? "Step 1 — choose a body area, then select an image" : "Step 1 — select an image to preview"}
              </p>
            </div>
          </div>

          {isXray && (
            <fieldset className="mb-5">
              <legend className="eyebrow mb-2.5 text-muted-foreground">X-ray category</legend>
              <div role="radiogroup" aria-label="X-ray category" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {XRAY_CATEGORIES.map((c) => {
                  const CatIcon = CATEGORY_ICONS[c.id];
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={running}
                      onClick={() => {
                        setCategory(c.id);
                        if (phase.name === "done") setPhase({ name: "idle" });
                      }}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky disabled:opacity-60",
                        active ? "border-primary bg-primary text-primary-foreground shadow-card" : "bg-background text-muted-foreground hover:border-sky hover:text-primary",
                      )}
                    >
                      <CatIcon className="h-4 w-4 shrink-0" /> {c.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <ImageUploader
            value={image}
            onSelect={select}
            onRemove={remove}
            uploadLabel={exam.uploadLabel}
            variant={isXray ? "dark" : "light"}
            disabled={running}
          />

          {missingImage && !image && (
            <div role="alert" className="mt-3 flex animate-fade-up items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {NO_IMAGE_MESSAGE}
            </div>
          )}

          <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Step 2 — see how results will be presented in a future version.</p>
            <Button variant="sky" size="xl" onClick={analyze} disabled={running}>
              <Sparkles /> {running ? "Analyzing…" : "Analyze Image"}
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
                <span><strong className="font-semibold">Minimal history.</strong> <span className="text-navy-foreground/70">Only the exam type, body area, date, format and file size are saved locally — never the image or its name.</span></span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                <span><strong className="font-semibold">Prototype preview.</strong> <span className="text-navy-foreground/70">No medical analysis is performed. The result screen is the same for every image.</span></span>
              </li>
            </ul>
          </div>
          <Disclaimer compact />
        </aside>
      </div>

      <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
        {phase.name === "loading" && (
          <AnalysisLoader title={`Preparing ${exam.shortName} preview`} steps={ANALYSIS_STEPS[type]} totalMs={DEMO_ANALYSIS_MS} onComplete={complete} />
        )}
        {phase.name === "done" && <DemoResultPanel info={phase.info} onReset={reset} />}
        {phase.name === "error" && (
          <div role="alert" className="flex flex-col gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> {phase.message}
            </p>
            <Button variant="outline-navy" onClick={reset}>
              <RotateCcw /> Start over
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
