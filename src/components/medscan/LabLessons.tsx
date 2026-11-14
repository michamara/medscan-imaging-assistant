import { Activity, HeartPulse, Waves } from "lucide-react";
import { EcgLabelledDiagram } from "./EcgWaveform";
import { Glossary } from "./Glossary";
import { SampleReport } from "./SampleReport";
import { SectionHeading } from "./SectionHeading";
import { XrayAnatomy } from "./XrayAnatomy";
import { RESULT_CONTENT } from "@/lib/exams";

const ECG_TOPICS = [
  {
    icon: HeartPulse,
    title: "Heart rate",
    text: "Heart rate is the number of beats per minute (bpm). In adults at rest, roughly 60–100 bpm is generally described as the typical range. On ECG paper at the standard speed, time runs from left to right, so the spacing between beats relates to the rate.",
  },
  {
    icon: Activity,
    title: "Rhythm",
    text: "Rhythm describes the pattern of beats. Reviewers check whether beats arrive at regular intervals and whether each beat follows the expected sequence of waves. The heart's usual rhythm is called sinus rhythm.",
  },
  {
    icon: Waves,
    title: "ECG waves",
    text: "Each heartbeat draws a repeating shape: a small P wave, a tall sharp QRS complex and a rounded T wave. Together they show electrical activation and recovery of the heart's chambers.",
  },
];

const ECG_WAVES = [
  { name: "P wave", text: "Activation of the upper chambers (atria)." },
  { name: "PR interval", text: "Time for the signal to travel from the atria to the ventricles." },
  { name: "QRS complex", text: "Activation of the main pumping chambers (ventricles)." },
  { name: "ST segment", text: "The flat stretch between ventricular activation and recovery." },
  { name: "T wave", text: "Electrical recovery of the ventricles." },
  { name: "QT interval", text: "Total time for ventricular activation and recovery." },
];

/** Chest X-ray anatomy lesson. Rendered only for the "Chest X-ray anatomy" tab. */
export function ChestAnatomyLesson() {
  return (
    <section className="border-t bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Lesson · Chest X-ray"
          title="Chest X-ray anatomy, step by step"
          description="Select a numbered marker to learn what each structure is and how it typically appears on a frontal chest radiograph."
        />
        <div className="mt-10">
          <XrayAnatomy />
        </div>
      </div>
    </section>
  );
}

/** ECG lesson. Rendered only for the "Normal ECG waveform" tab. */
export function EcgLesson() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Lesson · ECG"
            title="Anatomy of a single heartbeat"
            description="An ECG is a graph of voltage over time. Each beat produces the same family of waves, which clinicians examine one by one."
          />
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {ECG_WAVES.map((w) => (
              <div key={w.name} className="rounded-xl border-l-2 border-sky bg-muted px-4 py-3">
                <dt className="text-sm font-semibold text-primary">{w.name}</dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">{w.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <EcgLabelledDiagram className="shadow-lift" />
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {ECG_TOPICS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-soft text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-2xl font-medium text-primary">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Radiology report lesson. Rendered only for the X-ray case tabs. */
export function ReportLesson() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Lesson · Radiology report"
          title="How a radiology report is organised"
          description="Radiologists communicate results using a consistent structure. This template shows each section and what it is for — it contains no findings."
        />
        <div className="mt-10">
          <SampleReport />
        </div>
      </div>
    </section>
  );
}

/** Glossary for one topic area, rendered with the matching tab. */
export function GlossarySection({ topic }: { topic: "ecg" | "xray" }) {
  const terms = topic === "ecg" ? RESULT_CONTENT.ecg.glossary : RESULT_CONTENT.xray.glossary;
  return (
    <section className="mx-auto max-w-7xl space-y-14 px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Glossary" title="Key terms in simple English" description="Common words you will meet when learning about ECGs and X-rays." />
      <div>
        <h3 className="mb-5 font-sans text-lg font-semibold tracking-normal text-primary">{topic === "ecg" ? "ECG terms" : "X-ray terms"}</h3>
        <Glossary terms={terms} />
      </div>
    </section>
  );
}
