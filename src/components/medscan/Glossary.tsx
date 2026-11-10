import type { GlossaryTerm } from "@/lib/exams";

export function Glossary({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {terms.map((t) => (
        <div key={t.term} className="rounded-xl border bg-card p-4 transition-colors hover:border-sky/50 hover:bg-sky-soft/40">
          <dt className="font-semibold text-primary">{t.term}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
