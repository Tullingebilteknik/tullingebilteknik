"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const BlueprintCarScene = dynamic(
  () => import("@/components/3d/BlueprintCar"),
  { ssr: false }
);

const reasons = [
  {
    num: "01",
    title: "Modern utrustning",
    description:
      "Vi investerar kontinuerligt i den senaste diagnosutrustningen för att snabbt och korrekt identifiera problem.",
  },
  {
    num: "02",
    title: "Erfarna mekaniker",
    description:
      "Vårt team har mångårig erfarenhet av alla bilmärken. Vi löser även de mest komplexa problemen.",
  },
  {
    num: "03",
    title: "Snabba ledtider",
    description:
      "Vi värdesätter din tid. De flesta jobb utförs samma dag eller senast dagen efter.",
  },
  {
    num: "04",
    title: "Kvalitetsgaranti",
    description:
      "Vi använder originaldelar eller kvalitetsdelar med garanti. Ditt förtroende är vår prioritet.",
  },
];

export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card) => {
      if (!card) return;

      const num = card.querySelector(".ghost-num");
      const content = card.querySelector(".card-content");

      gsap.from(content, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          once: true,
        },
      });

      if (num) {
        gsap.from(num, {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-muted tech-surface relative overflow-hidden">
      {/* Blueprint 3D background — desktop only */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <BlueprintCarScene />
        </Suspense>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-5 lg:gap-16">
          {/* Sticky heading — left */}
          <div className="lg:col-span-2 mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-[30vh]">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Varför välja oss
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground mt-3">
                Kvalitet sedan dag ett
              </h2>
              <div className="w-12 h-0.5 bg-primary mt-6" />
            </div>
          </div>

          {/* Scrolling reason cards — right */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-16">
            {reasons.map((reason, index) => (
              <div
                key={reason.num}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="relative lg:min-h-[40vh] flex items-start"
              >
                {/* Ghost number */}
                <span className="ghost-num absolute -top-4 -left-2 lg:-left-8 font-heading text-[8rem] lg:text-[12rem] font-700 leading-none text-foreground/[0.02] select-none pointer-events-none">
                  {reason.num}
                </span>

                {/* Content */}
                <div className="card-content relative pt-8 lg:pt-12 max-w-md">
                  <span className="font-mono text-xs tracking-wider text-primary/70 uppercase">
                    {reason.num}
                  </span>
                  <h3 className="font-heading text-xl lg:text-2xl font-600 text-foreground mt-2 mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
