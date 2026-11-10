import { FileText } from "lucide-react";
import { SimulatedChip } from "./Disclaimer";

const SECTIONS = [
  { title: "Clinical indication", text: "The reason the image was requested, written by the referring clinician — for example, the symptoms being investigated." },
  { title: "Technique", text: "How the image was taken: the view (such as PA or AP), patient position and any notes on image quality." },
  { title: "Comparison", text: "Whether earlier images were available to compare against, and their dates." },
  { title: "Findings", text: "A systematic description of each area reviewed: airway, lungs, heart and mediastinum, diaphragm, bones and soft tissues. MedScan never generates findings." },
  { title: "Impression", text: "The radiologist's overall conclusion in a few lines, written by a qualified professional using the full clinical context." },
];

export function SampleReport() {
  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-lift">
      <header className="flex flex-col gap-4 border-b bg-muted px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-navy text-navy-foreground">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-medium text-primary">Radiology Report</p>
            <p className="font-mono text-xs text-muted-foreground">Sample template · structure only</p>
          </div>
        </div>
        <SimulatedChip />
      </header>
      <dl className="grid grid-cols-2 gap-px border-b bg-border sm:grid-cols-4">
        {[
          ["Patient", "Demo — no real data"],
          ["Examination", "Chest radiograph"],
          ["View", "PA (example)"],
          ["Reported by", "Not applicable"],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-5 py-3">
            <dt className="eyebrow text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-sm font-medium text-primary">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="divide-y">
        {SECTIONS.map((s, i) => (
          <section key={s.title} className="grid gap-2 px-6 py-5 sm:grid-cols-[180px_1fr]">
            <h4 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-primary">
              <span className="font-mono text-xs text-sky">0{i + 1}</span> {s.title}
            </h4>
            <p className="text-sm italic leading-relaxed text-muted-foreground">{s.text}</p>
          </section>
        ))}
      </div>
      <footer className="border-t bg-caution-soft px-6 py-3 text-center font-mono text-[0.7rem] font-semibold tracking-wider text-caution-foreground">
        SAMPLE TEMPLATE – NOT A REAL REPORT – NO FINDINGS ARE GENERATED
      </footer>
    </article>
  );
}
