import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertOctagon, ArrowRight, BrainCircuit, GraduationCap, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/medscan/PageHeader";
import { Disclaimer } from "@/components/medscan/Disclaimer";
import { EcgWaveform } from "@/components/medscan/EcgWaveform";
import aboutImg from "@/assets/about-research.jpg";
import xrayImg from "@/assets/xray-illustration.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MedScan — Educational Imaging Prototype" },
      { name: "description", content: "What MedScan is, how AI can support medical imaging research, what ECG and X-ray examinations are, and the prototype's limitations." },
      { property: "og:title", content: "About MedScan — Educational Imaging Prototype" },
      { property: "og:description", content: "Learn about MedScan, AI in medical imaging research, ECG and X-ray examinations, and our limitations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const AI_POINTS = [
  { title: "Pattern research", text: "Researchers study whether algorithms can learn visual patterns from large, carefully labelled image collections." },
  { title: "Workflow support", text: "AI tools are explored for tasks like sorting worklists or flagging image-quality problems, always with human review." },
  { title: "Measurement assistance", text: "Some validated, regulated tools help professionals with repetitive measurements — something MedScan does not do." },
  { title: "Education", text: "Interactive interfaces can help students learn anatomy, terminology and systematic review habits." },
];

const LIMITATIONS = [
  "It does not analyse, measure or interpret any uploaded image.",
  "All results are predefined and identical for every image.",
  "It cannot detect diseases, abnormalities or emergencies.",
  "It provides no diagnoses and no treatment recommendations.",
  "It has not been clinically validated and is not a certified medical device.",
  "Educational text is simplified and may not cover every case.",
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="What is MedScan?"
        description="MedScan is an educational hackathon prototype that demonstrates what a modern medical imaging interface for ECG and X-ray images could look like. It is a learning tool — not a medical device."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] shadow-lift">
          <img src={aboutImg} alt="Abstract illustration of medical imaging research" width={1536} height={1024} className="h-64 w-full object-cover sm:h-96" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-navy text-navy-foreground"><BrainCircuit className="h-5 w-5" /></span>
            <h2 className="mt-5 text-3xl font-medium text-primary sm:text-4xl">How AI can support medical imaging research</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Artificial intelligence is an active area of medical imaging research. Real clinical tools require large validated datasets, rigorous testing, regulatory approval and supervision by qualified professionals.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {AI_POINTS.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-card p-5 shadow-card">
                <h3 className="font-sans text-base font-semibold tracking-normal text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <article className="overflow-hidden rounded-3xl border bg-card shadow-card">
            <div className="bg-ecg-grid px-6 py-8"><EcgWaveform beats={3} className="h-20" strokeClassName="text-primary" /></div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow flex items-center gap-2 text-sky"><Activity className="h-3.5 w-3.5" /> Electrocardiogram</p>
              <h2 className="mt-2 text-3xl font-medium text-primary">What is an ECG?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                An electrocardiogram is a quick, painless test that records the heart's electrical activity using small sticky electrodes on the skin. The recording shows each heartbeat as a pattern of waves, which helps healthcare professionals assess the heart's rate and rhythm.
              </p>
              <Button asChild variant="link" className="mt-3 px-0"><Link to="/ecg">Open the ECG module <ArrowRight /></Link></Button>
            </div>
          </article>
          <article className="overflow-hidden rounded-3xl border bg-card shadow-card">
            <div className="relative h-36 overflow-hidden bg-navy-deep">
              <img src={xrayImg} alt="" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover object-[center_30%] opacity-80" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow flex items-center gap-2 text-sky"><ScanLine className="h-3.5 w-3.5" /> Radiography</p>
              <h2 className="mt-2 text-3xl font-medium text-primary">What is an X-ray?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                An X-ray examination uses a small, controlled dose of radiation to create images of the inside of the body. Dense tissues like bone appear bright and air appears dark. A chest X-ray shows the lungs, heart, airways and bones of the chest.
              </p>
              <Button asChild variant="link" className="mt-3 px-0"><Link to="/xray">Open the X-ray module <ArrowRight /></Link></Button>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-caution-soft text-caution-foreground"><AlertOctagon className="h-5 w-5" /></span>
            <h2 className="mt-5 text-3xl font-medium text-primary sm:text-4xl">Limitations of this prototype</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">MedScan was built for learning and demonstration. Please keep these limitations in mind.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {LIMITATIONS.map((l) => (
              <li key={l} className="flex gap-3 rounded-2xl border bg-card p-4 text-sm text-primary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" /> {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-[2rem] bg-gradient-navy p-8 text-navy-foreground shadow-lift sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-1 h-7 w-7 shrink-0 text-sky" />
            <div>
              <h2 className="text-2xl font-medium sm:text-3xl">Ready to explore?</h2>
              <p className="mt-1 text-navy-foreground/70">Try an interactive demonstration — your images stay on your device.</p>
            </div>
          </div>
          <Button asChild variant="sky" size="xl"><Link to="/">Get Started <ArrowRight /></Link></Button>
        </div>

        <Disclaimer className="mt-10" />
      </section>
    </>
  );
}
