import Link from "next/link";

export function CTABanner() {
  return (
    <section className="scanlines relative overflow-hidden bg-muted py-16 sm:py-20">
      <div className="tech-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_50%,oklch(0.75_0.15_195_/_8%),transparent)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="line-gradient mb-10" />

        <h2 className="font-heading text-3xl sm:text-4xl font-700 uppercase text-foreground mb-4">
          Redo att boka din tid?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Kontakta oss idag för att boka en tid eller få en kostnadsfri offert. Vi finns här för att
          hjälpa dig.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/kontakt"
            className="inline-flex items-center bg-primary text-primary-foreground font-heading font-600 uppercase tracking-wider text-sm px-8 py-3.5 rounded-sm transition-all hover:shadow-[0_0_30px_oklch(0.75_0.15_195_/_25%)]"
          >
            Boka tid nu
          </Link>
          <a
            href="tel:0812345678"
            className="font-mono text-sm text-primary/60 hover:text-primary transition-colors"
          >
            eller ring 08-123 456 78
          </a>
        </div>

        <div className="line-gradient mt-10" />
      </div>
    </section>
  );
}
