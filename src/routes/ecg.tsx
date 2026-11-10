import { createFileRoute } from "@tanstack/react-router";
import { Activity, HeartPulse, Waves } from "lucide-react";
import { PageHeader } from "@/components/medscan/PageHeader";
import { ExamUploadPanel } from "@/components/medscan/ExamUploadPanel";
import { EcgLabelledDiagram } from "@/components/medscan/EcgWaveform";
import { SectionHeading } from "@/components/medscan/SectionHeading";

export const Route = createFileRoute("/ecg")({
  head: () => ({
    meta: [
      { title: "ECG Analysis Demo — MedScan" },
      { name: "description", content: "Upload an ECG image for a local preview and learn about heart rate, rhythm and ECG waves in a simulated educational demo." },
      { property: "og:title", content: "ECG Analysis Demo — MedScan" },
      { property: "og:description", content: "Learn about heart rate, rhythm and the P, QRS and T waves with an educational ECG demonstration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EcgPage,
});

const TOPICS = [
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

const WAVES = [
  { name: "P wave", text: "Activation of the upper chambers (atria)." },
  { name: "PR interval", text: "Time for the signal to travel from the atria to the ventricles." },
  { name: "QRS complex", text: "Activation of the main pumping chambers (ventricles)." },
  { name: "ST segment", text: "The flat stretch between ventricular activation and recovery." },
  { name: "T wave", text: "Electrical recovery of the ventricles." },
  { name: "QT interval", text: "Total time for ventricular activation and recovery." },
];

function EcgPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 01 · Electrocardiogram"
        title="ECG Analysis"
        description="Upload an ECG image to create a private, local preview, then start a simulated demonstration that explains how ECGs are read."
      />
      <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExamUploadPanel type="ecg" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Learn the basics"
              title="Anatomy of a single heartbeat"
              description="An ECG is a graph of voltage over time. Each beat produces the same family of waves, which clinicians examine one by one."
            />
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {WAVES.map((w) => (
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
          {TOPICS.map(({ icon: Icon, title, text }) => (
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
    </>
  );
}
