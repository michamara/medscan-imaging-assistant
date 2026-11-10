import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Activity, ScanLine } from "lucide-react";
import xrayImg from "@/assets/xray-illustration.jpg";
import { EcgWaveform } from "./EcgWaveform";
import { EXAMS, type ExamType } from "@/lib/exams";
import { cn } from "@/lib/utils";

export function ExamCard({ type, className }: { type: ExamType; className?: string }) {
  const exam = EXAMS[type];
  const isEcg = type === "ecg";
  return (
    <Link
      to={isEcg ? "/ecg" : "/xray"}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-sky/50 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className={cn("relative h-56 overflow-hidden sm:h-64", isEcg ? "bg-ecg-grid" : "bg-navy-deep")}>
        {isEcg ? (
          <EcgWaveform beats={4} className="absolute inset-x-0 top-1/2 h-32 -translate-y-1/2 px-4" strokeClassName="text-primary" />
        ) : (
          <>
            <img src={xrayImg} alt="" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-80 transition-transform duration-700 group-hover:scale-105" />
            <div className="pointer-events-none absolute inset-x-0 h-1/3 animate-scan" style={{ background: "var(--gradient-scan)" }} aria-hidden />
          </>
        )}
        <span className="absolute left-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-background/95 text-primary shadow-card">
          {isEcg ? <Activity className="h-5 w-5" /> : <ScanLine className="h-5 w-5" />}
        </span>
        <span className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="eyebrow text-sky">{exam.fullName}</p>
        <h3 className="mt-2 font-sans text-2xl font-bold uppercase tracking-wide text-primary sm:text-3xl">
          {isEcg ? "ECG Analysis" : "X-Ray Analysis"}
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{exam.description}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Open module <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
