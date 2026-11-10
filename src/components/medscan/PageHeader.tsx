import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <p className="eyebrow mb-4 animate-fade-up text-sky">{eyebrow}</p>
        <h1 className="max-w-3xl animate-fade-up text-4xl font-medium leading-[1.05] text-primary [animation-delay:80ms] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:160ms] sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8 animate-fade-up [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
