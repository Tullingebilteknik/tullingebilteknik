import Link from "next/link";

export function Hero() {
  return (
    <section className="hero-dark relative overflow-hidden">
      {/* Subtle gradient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.30_0.06_255),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-white/90">
              Bilverkstad i Tullinge
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-700 tracking-tight text-white leading-[1.1]">
            Bilverkstad med{" "}
            <span className="text-secondary">kvalitet</span> i fokus
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            Vi är din lokala bilverkstad i Tullinge som servar alla bilmärken. Med modern
            utrustning och erfarna mekaniker ger vi din bil den omvårdnad den förtjänar.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center bg-primary text-white font-heading font-semibold text-base px-8 py-3.5 rounded-lg transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Boka tid nu
            </Link>
            <Link
              href="/tjanster"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors py-3.5"
            >
              Våra tjänster
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>5.0 på Google</span>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>Alla bilmärken</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>Personlig service</span>
          </div>
        </div>
      </div>
    </section>
  );
}
