import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Bone, CheckCircle2, ScanLine, Wind } from "lucide-react";
import { PageHeader } from "@/components/medscan/PageHeader";
import { EducationalBadge, LabCaseViewer } from "@/components/medscan/LabCaseViewer";
import { LAB_CASES } from "@/lib/learning-lab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning-lab")({
  head: () => ({
    meta: [
      { title: "X-ray Learning Lab — MedScan" },
      {
        name: "description",
        content: "Interactive educational examples: wrist and ankle fractures, a healthy wrist, chest X-ray anatomy and a normal ECG waveform, with highlights and explanations.",
      },
      { property: "og:title", content: "X-ray Learning Lab — MedScan" },
      { property: "og:description", content: "Explore prepared X-ray and ECG teaching examples with highlights and beginner-friendly explanations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearningLabPage,
});

const ICONS: Record<string, typeof Bone> = {
  "wrist-fracture": Bone,
  "ankle-fracture": Bone,
  "healthy-wrist": CheckCircle2,
  "chest-anatomy": Wind,
  "normal-ecg": Activity,
};

function LearningLabPage() {
  const [activeId, setActiveId] = useState(LAB_CASES[0].id);
  const active = LAB_CASES.find((c) => c.id === activeId) ?? LAB_CASES[0];

  return (
    <>
      <PageHeader
        eyebrow="Module 03 · Learning Lab"
        title="X-ray Learning Lab"
        description="Prepared teaching examples from public medical image libraries. Toggle the highlights and open the explanations to learn what each image shows."
      >
        <div className="flex flex-wrap items-center gap-3">
          <EducationalBadge />
          <p className="text-sm text-muted-foreground">These examples are not your uploads and are never generated from them.</p>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div role="tablist" aria-label="Learning Lab examples" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {LAB_CASES.map((c) => {
            const Icon = ICONS[c.id] ?? ScanLine;
            const selected = c.id === active.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls="lab-panel"
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex min-w-[10.5rem] shrink-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky sm:min-w-0",
                  selected ? "border-primary bg-primary text-primary-foreground shadow-lift" : "bg-card text-primary shadow-card hover:-translate-y-0.5 hover:border-sky",
                )}
              >
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", selected ? "bg-sky/25 text-sky" : "bg-sky-soft text-primary")}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{c.title}</span>
                  <span className={cn("block text-xs", selected ? "text-primary-foreground/70" : "text-muted-foreground")}>{c.category}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="lab-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`}>
          <LabCaseViewer key={active.id} item={active} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Highlights mark areas named by each image's original author or standard anatomy. MedScan does not analyse these images or any image you upload.
        </p>
      </section>
    </>
  );
}
