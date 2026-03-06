import Link from "next/link";

export function CTABanner() {
  return (
    <section className="hero-dark relative overflow-hidden py-16 sm:py-20">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
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
            className="inline-flex items-center bg-primary text-white font-heading font-semibold text-base px-8 py-3.5 rounded-lg transition-all hover:bg-primary/90 hover:shadow-lg"
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
