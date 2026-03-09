"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { useEffect, useState } from "react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768 && (navigator.hardwareConcurrency ?? 4) >= 4);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const isDesktop = useIsDesktop();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[oklch(0.12_0.005_260)]">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_80%,oklch(0.16_0.015_260),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,oklch(0.14_0.01_75/20%),transparent)]" />
      </div>

      {/* 3D Canvas — desktop only */}
      {isDesktop && <HeroCanvas />}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">
              Bilverkstad i Tullinge
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-[clamp(2.5rem,8vw,5.5rem)] font-700 leading-[0.95] tracking-tight text-white"
          >
            Precision i<br />
            varje <span className="text-gradient-gold">detalj</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-white/50 leading-relaxed max-w-lg"
          >
            Vi är din lokala bilverkstad i Tullinge. Modern utrustning, erfarna mekaniker
            och personlig service — oavsett bilmärke.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/kontakt"
              className="btn-hero inline-flex items-center bg-primary text-primary-foreground font-heading font-600 text-base px-8 py-3.5 rounded-full shadow-[0_4px_24px_oklch(0.72_0.12_75/20%)]"
            >
              Boka service
            </Link>
            <Link
              href="/tjanster"
              className="group inline-flex items-center gap-2 text-sm font-500 text-white/40 hover:text-white transition-colors py-3.5"
            >
              Se tjänster
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-wrap items-center gap-6 text-sm text-white/40"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-mono text-xs">5.0</span>
            </div>
            <div className="h-3 w-px bg-white/15" />
            <span className="font-mono text-xs">Alla bilmärken</span>
            <div className="h-3 w-px bg-white/15" />
            <span className="font-mono text-xs">Personlig service</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/20">Scroll</span>
        <div className="w-px h-8 bg-white/10 relative overflow-hidden">
          <div className="w-full h-3 bg-primary/60 scroll-indicator" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.12_0.005_260)] to-transparent z-10" />
    </section>
  );
}
