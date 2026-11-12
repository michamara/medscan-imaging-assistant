import { cn } from "@/lib/utils";

function beat(x: number) {
  return [
    `L${x + 20},60`,
    `Q${x + 30},46 ${x + 40},60`,
    `L${x + 55},60`,
    `L${x + 60},67`,
    `L${x + 66},10`,
    `L${x + 72},76`,
    `L${x + 78},60`,
    `L${x + 95},60`,
    `Q${x + 112},38 ${x + 128},60`,
    `L${x + 200},60`,
  ].join(" ");
}

export function buildEcgPath(beats: number) {
  let d = "M0,60";
  for (let i = 0; i < beats; i++) d += " " + beat(i * 200);
  return d;
}

/** Decorative animated ECG trace. Reference illustration only. */
export function EcgWaveform({
  beats = 4,
  className,
  strokeClassName = "text-sky",
  animate = true,
  sweep = false,
}: {
  beats?: number;
  className?: string;
  strokeClassName?: string;
  animate?: boolean;
  sweep?: boolean;
}) {
  const width = beats * 200;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg viewBox={`0 0 ${width} 90`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <path
          d={buildEcgPath(beats)}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={cn(strokeClassName, animate && "animate-ecg-draw")}
        />
      </svg>
      {sweep && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 animate-ecg-sweep bg-gradient-to-r from-transparent via-sky/20 to-transparent" />
      )}
    </div>
  );
}

/** Labelled single-beat diagram used for education. */
export function EcgLabelledDiagram({ className, highlightQrs = false }: { className?: string; highlightQrs?: boolean }) {
  return (
    <figure className={cn("rounded-2xl border bg-ecg-grid p-4 sm:p-6", className)}>
      <svg viewBox="-10 -6 220 130" className="h-auto w-full" role="img" aria-labelledby="ecg-diagram-title">
        <title id="ecg-diagram-title">Labelled illustration of one heartbeat on an ECG: P wave, QRS complex and T wave</title>
        {highlightQrs && (
          <rect x="54" y="6" width="26" height="74" rx="5" className="animate-in fade-in-0 fill-caution/25 stroke-caution" strokeWidth="1.2" strokeDasharray="3 2" />
        )}
        <path
          d={"M-10,60 " + beat(0)}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          className="animate-ecg-draw text-primary"
        />
        {/* wave labels */}
        <g className="fill-sky font-mono" fontSize="8" fontWeight="600" textAnchor="middle">
          <text x="30" y="40">P</text>
          <text x="66" y="4">QRS</text>
          <text x="112" y="32">T</text>
        </g>
        {/* PR interval */}
        <g className="stroke-muted-foreground fill-muted-foreground" strokeWidth="0.8">
          <line x1="20" y1="88" x2="60" y2="88" />
          <line x1="20" y1="84" x2="20" y2="92" />
          <line x1="60" y1="84" x2="60" y2="92" />
          <text x="40" y="100" fontSize="6.5" textAnchor="middle" stroke="none" className="font-mono">PR interval</text>
          <line x1="60" y1="108" x2="128" y2="108" />
          <line x1="60" y1="104" x2="60" y2="112" />
          <line x1="128" y1="104" x2="128" y2="112" />
          <text x="94" y="120" fontSize="6.5" textAnchor="middle" stroke="none" className="font-mono">QT interval</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Reference illustration of a single heartbeat — not derived from any uploaded image.
      </figcaption>
    </figure>
  );
}
