import Link from "next/link";

export function Hero() {
  return (
    <section className="scanlines relative overflow-hidden bg-background">
      {/* Tech grid background */}
      <div className="tech-grid absolute inset-0" />
      {/* Radial cyan atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,oklch(0.75_0.15_195_/_6%),transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="flex items-start justify-between">
          <div className="max-w-3xl">
            {/* Status badge */}
            <div className="mb-8 inline-flex items-center gap-3 border border-primary/20 rounded-sm px-4 py-2">
              <span className="status-dot shrink-0" />
              <span className="font-mono text-xs tracking-widest text-primary uppercase">
                Verkstad aktiv
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-700 uppercase tracking-tight text-foreground leading-[0.95]">
              Bilverkstad med{" "}
              <span className="text-gradient-cyan">kvalitet</span>{" "}
              i fokus
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Vi är din lokala bilverkstad i Tullinge som servar alla bilmärken. Med modern
              utrustning och erfarna mekaniker ger vi din bil den omvårdnad den förtjänar.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-5">
              <Link
                href="/kontakt"
                className="inline-flex items-center bg-primary text-primary-foreground font-heading font-600 uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all hover:shadow-[0_0_30px_oklch(0.75_0.15_195_/_25%)]"
              >
                Boka tid nu
              </Link>
              <Link
                href="/tjanster"
                className="group inline-flex items-center gap-2 font-mono text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Våra tjänster
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>

            {/* Trust status bar */}
            <div className="mt-14 flex flex-wrap items-center gap-4 font-mono text-xs tracking-wider text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>[5.0] Google Reviews</span>
              </div>
              <span className="text-border hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Alla bilmärken</span>
              </div>
              <span className="text-border hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Personlig service</span>
              </div>
            </div>
          </div>

          {/* Decorative readout lines */}
          <div className="hidden lg:flex flex-col gap-2 items-end pt-20 opacity-40">
            <div className="h-px w-48 bg-primary/20" />
            <div className="h-px w-32 bg-primary/15" />
            <div className="h-px w-56 bg-primary/10" />
            <div className="h-px w-24 bg-primary/20" />
            <div className="h-px w-40 bg-primary/8" />
            <div className="h-px w-16 bg-primary/15" />
            <div className="h-px w-52 bg-primary/10" />
            <div className="h-px w-28 bg-primary/20" />
            <div className="h-px w-44 bg-primary/8" />
            <div className="h-px w-20 bg-primary/15" />
            <div className="h-px w-36 bg-primary/10" />
            <div className="h-px w-48 bg-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
