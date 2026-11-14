import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, BrainCircuit, Cpu, Gauge, Info, Loader2, Lock, RotateCcw, ScanSearch, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageUploader, type SelectedImage } from "./ImageUploader";
import { AI_EXPERIMENT_NOTICE, AI_SCORE_EXPLANATION, isLowConfidence, toPercent, type ClassScore } from "@/lib/ai-experiment";
import { classifyImage, InferenceError, loadClassifier, ModelLoadError, type LoadedModel } from "@/lib/ai-model";
import { cn } from "@/lib/utils";

type Phase =
  | { name: "idle" }
  | { name: "loading-model" }
  | { name: "classifying" }
  | { name: "done"; scores: ClassScore[]; ms: number }
  | { name: "error"; message: string; kind: "model" | "image" };

export function AiExperimentNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="AI experiment notice"
      className={cn("flex items-start gap-3 rounded-2xl border-2 border-caution/60 bg-caution-soft p-4 text-caution-foreground sm:p-5", className)}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        <p className="font-mono text-xs font-semibold tracking-[0.14em]">EDUCATIONAL AI EXPERIMENT</p>
        <p className="text-sm font-medium leading-relaxed sm:text-base">{AI_EXPERIMENT_NOTICE}</p>
      </div>
    </div>
  );
}

export function AiClassifierPanel() {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [missingImage, setMissingImage] = useState(false);
  const imageRef = useRef<SelectedImage | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  imageRef.current = image;

  useEffect(() => () => {
    if (imageRef.current) URL.revokeObjectURL(imageRef.current.url);
  }, []);

  useEffect(() => {
    if (phase.name !== "done" && phase.name !== "error") return;
    const t = setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    return () => clearTimeout(t);
  }, [phase.name]);

  const select = useCallback((next: SelectedImage) => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return next;
    });
    setMissingImage(false);
    setPhase({ name: "idle" });
  }, []);

  const remove = useCallback(() => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
    setPhase({ name: "idle" });
  }, []);

  const busy = phase.name === "loading-model" || phase.name === "classifying";

  const classify = async () => {
    if (busy) return;
    const current = imageRef.current;
    if (!current) {
      setMissingImage(true);
      toast.error("Please upload an image first.", { description: "Choose a JPG, JPEG or PNG file, then click Classify Image." });
      return;
    }
    setMissingImage(false);
    try {
      let loaded = model;
      if (!loaded) {
        setPhase({ name: "loading-model" });
        loaded = await loadClassifier();
        setModel(loaded);
      }
      setPhase({ name: "classifying" });
      const { scores, ms } = await classifyImage(loaded, current.url);
      if (imageRef.current?.url !== current.url) return; // image changed meanwhile
      setPhase({ name: "done", scores, ms });
    } catch (err) {
      const isModel = err instanceof ModelLoadError;
      const message =
        err instanceof ModelLoadError || err instanceof InferenceError
          ? err.message
          : "Something unexpected went wrong while classifying the image. Please try again.";
      setPhase({ name: "error", message, kind: isModel ? "model" : "image" });
      toast.error(isModel ? "Model could not be loaded" : "Classification failed", { description: message });
    }
  };

  const reset = () => {
    remove();
    setMissingImage(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border bg-card p-4 shadow-card sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-soft text-primary">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-sans text-lg font-semibold tracking-normal text-primary">Upload an image to classify</h2>
              <p className="text-sm text-muted-foreground">Step 1 — select a JPG, JPEG or PNG image</p>
            </div>
          </div>

          <ImageUploader value={image} onSelect={select} onRemove={remove} uploadLabel="Upload image" disabled={busy} />

          {missingImage && !image && (
            <div role="alert" className="mt-3 flex animate-fade-up items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> Please upload an image first.
            </div>
          )}

          <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Step 2 — run the trained model on this image, locally in your browser.</p>
            <Button variant="sky" size="xl" onClick={classify} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : <ScanSearch />}
              {phase.name === "loading-model" ? "Loading model…" : phase.name === "classifying" ? "Classifying…" : "Classify Image"}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl bg-gradient-navy p-6 text-navy-foreground shadow-lift">
            <p className="eyebrow text-sky">About this model</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                <span>
                  <strong className="font-semibold">Trained with Teachable Machine.</strong>{" "}
                  <span className="text-navy-foreground/70">An image classifier with two categories: ECG Diagram and X-ray Illustration.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                <span>
                  <strong className="font-semibold">Runs in your browser.</strong>{" "}
                  <span className="text-navy-foreground/70">The model is downloaded once and runs on your device with TensorFlow.js. Your image is never uploaded or saved.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                <span>
                  <strong className="font-semibold">Model status:</strong>{" "}
                  <span className="text-navy-foreground/70" aria-live="polite">
                    {model
                      ? `Loaded · ${model.labels.length} classes · ${model.imageSize}×${model.imageSize}px input · ${model.backend.toUpperCase()} backend`
                      : phase.name === "loading-model"
                        ? "Loading…"
                        : "Not loaded yet — it loads when you click Classify Image."}
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-primary">
              <Info className="h-4 w-4 text-sky" /> UNDERSTANDING THE SCORES
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{AI_SCORE_EXPLANATION}</p>
          </div>
        </aside>
      </div>

      <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
        {busy && (
          <div role="status" className="flex animate-in fade-in-0 items-center gap-4 rounded-3xl border bg-card p-6 shadow-lift">
            <span className="relative inline-flex h-12 w-12 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-sky/40" />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-navy text-navy-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            </span>
            <div>
              <p className="text-lg font-medium text-primary">{phase.name === "loading-model" ? "Loading the trained model…" : "Running the model on your image…"}</p>
              <p className="text-sm text-muted-foreground">
                {phase.name === "loading-model" ? "Downloading about 2 MB of model files. This happens only once per visit." : "Processing locally in your browser."}
              </p>
            </div>
          </div>
        )}

        {phase.name === "done" && <ClassificationResult scores={phase.scores} ms={phase.ms} onReset={reset} />}

        {phase.name === "error" && (
          <div role="alert" className="flex flex-col gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> {phase.message}
            </p>
            <div className="flex gap-2">
              <Button variant="sky" onClick={classify}>
                <RotateCcw /> Try again
              </Button>
              {phase.kind === "image" && (
                <Button variant="outline-navy" onClick={reset}>
                  Choose another image
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClassificationResult({ scores, ms, onReset }: { scores: ClassScore[]; ms: number; onReset: () => void }) {
  const top = scores[0];
  const uncertain = isLowConfidence(scores);
  return (
    <section aria-labelledby="ai-result-title" className="animate-fade-up space-y-5 rounded-3xl border bg-card p-6 shadow-lift sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/40 bg-sky-soft px-2.5 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.12em] text-primary">
          <BrainCircuit className="h-3 w-3" /> REAL MODEL OUTPUT · EDUCATIONAL EXPERIMENT
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Gauge className="h-3.5 w-3.5" /> Inference time: {ms} ms · on this device
        </span>
      </div>

      <div>
        <p className="eyebrow text-muted-foreground">Predicted image category</p>
        <h2 id="ai-result-title" className="mt-1 text-3xl font-medium text-primary sm:text-4xl">
          {top?.className ?? "Unknown"}
        </h2>
        {uncertain && (
          <p className="mt-2 text-sm text-caution-foreground">
            The model is uncertain about this image — its top score is below 70%. Treat this category as a weak guess.
          </p>
        )}
      </div>

      <ul className="space-y-4" aria-label="Scores for each class">
        {scores.map((s, i) => (
          <li key={s.className}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className={cn("font-medium", i === 0 ? "text-primary" : "text-muted-foreground")}>{s.className}</span>
              <span className="font-mono font-semibold text-primary">{toPercent(s.probability)}</span>
            </div>
            <Progress value={s.probability * 100} className="h-2.5 bg-sky-soft" aria-label={`${s.className} score ${toPercent(s.probability)}`} />
          </li>
        ))}
      </ul>

      <p className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-primary">What this means:</strong> the model compared your image with the ECG diagrams and X-ray
        illustrations it was trained on. It recognizes the type of picture only — it does not look for fractures, diseases or any medical
        finding. Scores are not guaranteed probabilities of correctness.
      </p>

      <AiExperimentNotice />

      <div className="flex justify-end">
        <Button variant="outline-navy" onClick={onReset}>
          <RotateCcw /> Classify another image
        </Button>
      </div>
    </section>
  );
}
