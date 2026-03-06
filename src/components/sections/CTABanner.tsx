import Link from "next/link";

export function CTABanner() {
  return (
    <section className="hero-dark noise-overlay section-angle-top relative overflow-hidden py-20 sm:py-24">
      {/* Gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_30%_50%,oklch(0.25_0.06_260),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_30%,oklch(0.22_0.05_75/20%),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative label with flanking lines */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
          <span className="font-mono text-xs tracking-widest uppercase text-white/40">Kontakta oss</span>
          <div className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-700 text-white mb-4">
          Redo att boka din tid?
        </h2>
        <p className="text-white/70 mb-8 max-w-2xl mx-auto">
          Kontakta oss idag för att boka en tid eller få en kostnadsfri offert. Vi finns här för att
          hjälpa dig.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/kontakt"
            className="inline-flex items-center bg-secondary text-foreground font-heading font-semibold text-base px-8 py-3.5 rounded-lg transition-all hover:shadow-[0_4px_24px_oklch(0.80_0.15_75/30%)] hover:-translate-y-0.5"
          >
            Boka tid nu
          </Link>
          <a
            href="tel:0812345678"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            eller ring 08-123 456 78
          </a>
        </div>
      </div>
    </section>
  );
}
