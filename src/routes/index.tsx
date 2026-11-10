import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Cpu, FileImage, Lock, MousePointerClick, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamCard } from "@/components/medscan/ExamCard";
import { EcgWaveform } from "@/components/medscan/EcgWaveform";
import { SectionHeading } from "@/components/medscan/SectionHeading";
import { Disclaimer, SimulatedChip } from "@/components/medscan/Disclaimer";
import xrayImg from "@/assets/xray-illustration.jpg";
import aboutImg from "@/assets/about-research.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedScan — Intelligent Medical Imaging Assistant" },
      { name: "description", content: "Explore ECG and X-ray imaging through AI-inspired educational demonstrations. Images stay in your browser." },
      { property: "og:title", content: "MedScan — Intelligent Medical Imaging Assistant" },
      { property: "og:description", content: "Explore ECG and X-ray imaging through AI-inspired educational demonstrations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  { icon: MousePointerClick, title: "Choose an exam", text: "Pick the ECG or X-ray module to open its dedicated workspace." },
  { icon: Upload, title: "Upload an image", text: "Drag and drop a JPG or PNG. A preview is created locally — nothing is sent anywhere." },
  { icon: Cpu, title: "Run the demo", text: "Start a simulated demonstration that walks through an AI-style processing flow." },
  { icon: BookOpen, title: "Learn from results", text: "Explore predefined educational content and medical terms explained in plain English." },
];

const TRUST = [
  { icon: Lock, label: "Images never leave your browser" },
  { icon: FileImage, label: "JPG, JPEG & PNG up to 10 MB" },
  { icon: ShieldCheck, label: "No diagnoses — education only" },
  { icon: Sparkles, label: "AI-inspired demonstrations" },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28">
          <div>
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-sky/30 bg-background/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-card backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" /> Educational imaging prototype
            </span>
            <h1 className="mt-6 animate-fade-up text-5xl font-medium leading-[1.02] text-primary [animation-delay:80ms] sm:text-6xl lg:text-7xl">
              Intelligent Medical <em className="font-light italic text-sky">Imaging</em> Assistant
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">
              Explore ECG and X-ray imaging through AI-inspired educational demonstrations.
            </p>
            <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <Button asChild variant="hero" size="xl">
                <a href="#modules">
                  Get Started <ArrowRight />
                </a>
              </Button>
              <Button asChild variant="outline-navy" size="xl">
                <a href="#how-it-works">How it works</a>
              </Button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative animate-fade-up [animation-delay:200ms]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-sky/10 blur-3xl" aria-hidden />
            <div className="relative rounded-[2rem] border bg-card/90 p-4 shadow-lift backdrop-blur sm:p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <SimulatedChip />
              </div>
              <div className="rounded-2xl border bg-ecg-grid p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="eyebrow text-muted-foreground">ECG · reference trace</p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-sky">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky" /> LIVE DEMO
                  </span>
                </div>
                <EcgWaveform beats={5} className="h-24" strokeClassName="text-primary" sweep />
              </div>
              <div className="mt-4 grid grid-cols-5 gap-4">
                <div className="relative col-span-2 overflow-hidden rounded-2xl bg-navy-deep">
                  <img src={xrayImg} alt="Illustrated chest X-ray" width={1024} height={1024} className="aspect-square h-full w-full object-cover opacity-85" />
                  <div className="pointer-events-none absolute inset-x-0 h-1/3 animate-scan" style={{ background: "var(--gradient-scan)" }} aria-hidden />
                </div>
                <div className="col-span-3 flex flex-col justify-between gap-3">
                  {["Image loaded locally", "Format validated", "Educational module ready"].map((t, i) => (
                    <div key={t} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 animate-fade-up" style={{ animationDelay: `${600 + i * 180}ms` }}>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-medium text-primary sm:text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden animate-float-soft rounded-2xl border bg-card px-4 py-3 shadow-lift sm:block">
              <p className="eyebrow text-muted-foreground">Privacy</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Lock className="h-3.5 w-3.5 text-success" /> 0 bytes uploaded
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-muted">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-primary">
              <Icon className="h-4 w-4 shrink-0 text-sky" /> {label}
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Demonstration modules"
          title="Choose an examination type"
          description="Each module has its own upload workspace, educational content and results dashboard."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ExamCard type="ecg" />
          <ExamCard type="xray" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How It Works" title="From upload to understanding in four steps" align="center" />
          <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent lg:block" aria-hidden />
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-3xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-navy text-navy-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-4xl font-light text-sky/50">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img src={aboutImg} alt="Abstract illustration of medical imaging research" width={1536} height={1024} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading
              eyebrow="About MedScan"
              title="A learning space for the future of medical imaging"
              description="MedScan is an educational hackathon prototype. It shows how an AI-assisted imaging interface could feel — clean uploads, clear progress and readable explanations — without performing any real interpretation."
            />
            <ul className="mt-6 space-y-3 text-sm text-primary">
              {["Built for students, educators and curious minds", "Every result is predefined and independent of your image", "Designed with privacy first — no server uploads"].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky" /> {t}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline-navy" size="xl" className="mt-8">
              <Link to="/about">
                Learn more about MedScan <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <Disclaimer className="mt-16" />
      </section>
    </>
  );
}
