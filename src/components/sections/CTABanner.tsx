"use client";

import { ScrollReveal } from "@/components/animation/ScrollReveal";

export function CTABanner() {
  return (
    <section className="hero-dark noise-overlay relative overflow-hidden py-24 sm:py-32">
      {/* Gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_30%_50%,oklch(0.16_0.015_260),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_30%,oklch(0.14_0.01_75/15%),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          {/* Label */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-white/15" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/30">Kontakta oss</span>
            <div className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-white/15" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-700 text-white mb-4">
            Redo att boka din tid?
          </h2>
          <p className="text-white/50 mb-10 max-w-2xl mx-auto">
            Kontakta oss idag för att boka en tid eller få en kostnadsfri offert.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="#boka"
              className="btn-hero inline-flex items-center bg-primary text-primary-foreground font-heading font-600 text-base px-8 py-3.5 rounded-full shadow-[0_4px_24px_oklch(0.72_0.12_75/20%)]"
            >
              Boka service
            </a>
            <a
              href="tel:0812345678"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              eller ring 08-123 456 78
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
