import { useState } from "react";
import xrayImg from "@/assets/xray-illustration.jpg";
import { cn } from "@/lib/utils";

export const ANATOMY_POINTS = [
  { id: 1, name: "Trachea", x: 50, y: 14, text: "The windpipe. It appears as a dark, air-filled tube running down the centre of the neck and upper chest." },
  { id: 2, name: "Clavicles", x: 24, y: 13, text: "The collarbones. Their position helps check whether the patient was standing straight for the image." },
  { id: 3, name: "Lungs", x: 30, y: 42, text: "Air-filled lungs let X-rays pass through, so they appear mostly dark with fine branching vessel markings." },
  { id: 4, name: "Hilum", x: 39, y: 40, text: "Where the main airways and blood vessels enter each lung, near the centre of the chest." },
  { id: 5, name: "Heart", x: 62, y: 57, text: "The heart forms a bright central shadow, slightly more to the patient's left side." },
  { id: 6, name: "Spine", x: 50, y: 33, text: "The vertebrae run down the middle and are partly hidden behind the heart and mediastinum." },
  { id: 7, name: "Diaphragm", x: 32, y: 70, text: "The dome-shaped muscle below the lungs. Its smooth curved outline marks the bottom of the chest." },
  { id: 8, name: "Costophrenic angle", x: 15, y: 74, text: "The sharp corner where the diaphragm meets the ribs at the lower edge of each lung." },
] as const;

export function XrayAnatomy() {
  const [active, setActive] = useState<number>(1);
  const point = ANATOMY_POINTS.find((p) => p.id === active)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <figure className="relative overflow-hidden rounded-3xl bg-navy-deep shadow-lift">
        <img src={xrayImg} alt="Illustrated chest X-ray used for anatomy education" width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 h-1/4 animate-scan" style={{ background: "var(--gradient-scan)" }} aria-hidden />
        {ANATOMY_POINTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p.id)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full font-mono text-xs font-bold transition-all duration-300",
              "inline-flex h-7 w-7 items-center justify-center border-2",
              active === p.id
                ? "scale-110 border-navy-foreground bg-sky text-sky-foreground shadow-glow"
                : "border-navy-foreground/70 bg-navy-deep/70 text-navy-foreground hover:bg-sky",
            )}
            aria-label={`Show ${p.name}`}
            aria-pressed={active === p.id}
          >
            {p.id}
          </button>
        ))}
        <span className="absolute bottom-3 left-3 rounded-full bg-navy-deep/80 px-3 py-1 font-mono text-[0.65rem] tracking-wider text-navy-foreground/80">
          R · patient's right
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-navy-deep/80 px-3 py-1 font-mono text-[0.65rem] tracking-wider text-navy-foreground/80">
          patient's left · L
        </span>
      </figure>

      <div className="flex flex-col gap-4">
        <div key={point.id} className="animate-fade-up rounded-2xl border bg-card p-6 shadow-card">
          <p className="eyebrow text-sky">Structure {point.id} of {ANATOMY_POINTS.length}</p>
          <h3 className="mt-2 text-2xl font-medium text-primary">{point.name}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{point.text}</p>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {ANATOMY_POINTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(p.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                  active === p.id ? "border-sky bg-sky-soft text-primary" : "bg-card text-muted-foreground hover:border-sky/50 hover:text-primary",
                )}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[0.65rem] text-primary-foreground">{p.id}</span>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Tip: X-rays are viewed as if facing the patient, so the patient's right side appears on your left. This illustration is for learning only.
        </p>
      </div>
    </div>
  );
}
