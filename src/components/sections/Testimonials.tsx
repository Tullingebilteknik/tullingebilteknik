"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

const testimonials = [
  {
    id: "001",
    name: "Anna K.",
    vehicle: "Volvo XC60",
    date: "2026-02",
    text: "Fantastisk service! De fixade mitt AC-problem på en dag och priset var mycket rimligt. Rekommenderas varmt!",
  },
  {
    id: "002",
    name: "Erik L.",
    vehicle: "BMW 320d",
    date: "2026-01",
    text: "Har gått hit i flera år nu. Alltid ärliga med vad som behöver göras och vad som kan vänta. Pålitlig verkstad.",
  },
  {
    id: "003",
    name: "Maria S.",
    vehicle: "Tesla Model 3",
    date: "2025-12",
    text: "Bästa verkstaden i Tullinge! Snabb service, bra priser och trevlig personal. Min bil har aldrig gått bättre.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const testimonial = testimonials[current];

  return (
    <section className="py-24 sm:py-32 bg-white tech-surface">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Kundrecensioner
            </span>
            <div className="mt-12 min-h-[320px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                  className="text-center max-w-2xl mx-auto"
                >
                  {/* Lab report card */}
                  <div className="border border-border/40 rounded-lg p-8 sm:p-10 relative">
                    {/* Report header */}
                    <div className="flex items-center justify-between mb-6">
                      <StarRating />
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-primary/50">
                        Verifierad kund
                      </span>
                    </div>

                    <blockquote className="text-xl sm:text-2xl font-300 italic text-foreground/80 leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    {/* Report footer */}
                    <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                      <div className="text-left">
                        <span className="font-heading text-sm font-600 text-foreground block">
                          {testimonial.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
                          {testimonial.vehicle}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground/40 tracking-wider">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-primary w-6"
                      : "bg-foreground/10 hover:bg-foreground/20"
                  }`}
                  aria-label={`Visa recension ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
