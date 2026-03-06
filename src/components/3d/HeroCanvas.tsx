"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_50%,oklch(0.18_0.02_75/30%),transparent)]" />
        }
      >
        <HeroScene />
      </Suspense>
    </div>
  );
}
