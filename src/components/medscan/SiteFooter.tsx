import { Link } from "@tanstack/react-router";
import { LogoMark } from "./Logo";
import { DISCLAIMER_TEXT } from "@/lib/exams";
import { NAV_ITEMS } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="bg-navy-foreground/10" />
            <span className="font-display text-xl font-semibold">MedScan</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-navy-foreground/70">{DISCLAIMER_TEXT}</p>
          <p className="text-xs text-navy-foreground/50">
            Educational hackathon prototype · Not a medical device · Images never leave your browser
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid grid-cols-2 content-start gap-x-12 gap-y-3 text-sm md:justify-self-end">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="text-navy-foreground/75 transition-colors hover:text-sky">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-foreground/50">
        © {new Date().getFullYear()} MedScan · For education and demonstration only
      </div>
    </footer>
  );
}
