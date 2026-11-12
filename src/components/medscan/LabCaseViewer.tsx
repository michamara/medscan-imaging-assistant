import { useState } from "react";
import { BookOpen, Eye, EyeOff, GraduationCap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcgLabelledDiagram } from "./EcgWaveform";
import { SafetyNotice } from "./Disclaimer";
import type { LabCase } from "@/lib/learning-lab";
import { cn } from "@/lib/utils";

export function EducationalBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-caution bg-caution-soft px-3 py-1 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-caution-foreground shadow-card",
        className,
      )}
    >
      <GraduationCap className="h-3.5 w-3.5" /> EDUCATIONAL EXAMPLE
    </span>
  );
}

export function LabCaseViewer({ item }: { item: LabCase }) {
  const [showHighlight, setShowHighlight] = useState(true);
  const [explain, setExplain] = useState(false);
  const media = item.media;
  const highlightColor = item.tone === "fracture" ? "caution" : "sky";

  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-lift" aria-labelledby={`case-${item.id}-title`}>
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Image column */}
        <div className={cn("relative flex flex-col", media.kind === "image" ? "bg-navy-deep" : "bg-muted")}>
          <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
            <EducationalBadge />
          </div>
          <div className="flex flex-1 items-center justify-center p-4 pt-14 sm:p-8 sm:pt-16">
            {media.kind === "image" ? (
              <div className="relative w-fit">
                <img
                  src={media.url}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                  className="block h-auto max-h-[460px] w-auto max-w-full rounded-lg sm:max-h-[540px]"
                />
                {showHighlight &&
                  item.highlights.map((h) => (
                    <div
                      key={h.label}
                      className="pointer-events-none absolute animate-in fade-in-0 zoom-in-95"
                      style={{ left: `${h.cx - h.w / 2}%`, top: `${h.cy - h.h / 2}%`, width: `${h.w}%`, height: `${h.h}%` }}
                      data-testid="lab-highlight"
                    >
                      <span
                        className={cn(
                          "absolute inset-0 rounded-[50%] border-[3px] border-dashed",
                          highlightColor === "caution" ? "border-caution bg-caution/15" : "border-sky bg-sky/15",
                        )}
                      />
                      <span
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.65rem] font-semibold shadow-card sm:text-xs",
                          h.labelAt === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
                          highlightColor === "caution" ? "bg-caution text-caution-foreground" : "bg-sky text-sky-foreground",
                        )}
                      >
                        {h.label}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <EcgLabelledDiagram className="w-full max-w-xl bg-card" highlightQrs={showHighlight} />
            )}
          </div>
          <div className={cn("border-t px-4 py-3 text-xs sm:px-6", media.kind === "image" ? "border-navy-foreground/10 text-navy-foreground/70" : "text-muted-foreground")}>
            {media.kind === "image" ? (
              <p>
                {media.note && <span>{media.note} </span>}
                Image:{" "}
                <a href={media.credit.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-navy-foreground">
                  {media.credit.title}
                </a>{" "}
                by {media.credit.author}, via Wikimedia Commons,{" "}
                <a href={media.credit.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-navy-foreground">
                  {media.credit.license}
                </a>
                . Resized for this demo.
              </p>
            ) : (
              <p>Schematic illustration drawn for MedScan — not a recording from a real patient.</p>
            )}
          </div>
        </div>

        {/* Text column */}
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="eyebrow text-sky">{item.category}</p>
            <h2 id={`case-${item.id}-title`} className="mt-2 text-3xl font-medium text-primary">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
          </div>

          <div className={cn("rounded-2xl border-l-4 p-4", item.tone === "fracture" ? "border-caution bg-caution-soft" : "border-sky bg-sky-soft")}>
            <p className="eyebrow text-muted-foreground">Educational finding</p>
            <p className="mt-1.5 font-medium leading-relaxed text-primary">{item.finding}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline-navy"
              onClick={() => setShowHighlight((v) => !v)}
              aria-pressed={showHighlight}
              className="flex-1"
            >
              {showHighlight ? <EyeOff /> : <Eye />} {showHighlight ? "Hide Highlight" : "Show Highlight"}
            </Button>
            <Button variant={explain ? "hero" : "sky"} onClick={() => setExplain((v) => !v)} aria-expanded={explain} aria-controls={`case-${item.id}-explain`} className="flex-1">
              <BookOpen /> {explain ? "Hide Explanation" : "Explain This Image"}
            </Button>
          </div>
          <p className="-mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {item.highlightCaption}
          </p>

          {explain && (
            <div id={`case-${item.id}-explain`} className="animate-fade-up space-y-3 rounded-2xl border bg-background p-5">
              <p className="eyebrow text-sky">Beginner-friendly explanation</p>
              {item.explanation.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-primary">
                  {p}
                </p>
              ))}
              <div className="pt-1">
                <p className="text-sm font-semibold text-primary">What to look for</p>
                <ul className="mt-2 space-y-1.5">
                  {item.lookFor.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" /> {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <SafetyNotice className="mt-auto" />
        </div>
      </div>
    </article>
  );
}
