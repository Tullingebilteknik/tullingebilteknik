import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/sections/CTABanner";
import { TjansterContent } from "@/components/sections/TjansterContent";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Se alla tjänster vi erbjuder på Tullinge Bilteknik. Service, bromsar, däck, AC, diagnostik, biltvätt och rekond. Bilverkstad i Tullinge.",
};

export default async function TjansterPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  const allServices = (services || []) as Service[];
  const verkstadServices = allServices.filter((s) => s.category === "verkstad");
  const washMain = allServices.filter((s) => s.category === "tvatt_rekond" && !s.is_addon);
  const washAddons = allServices.filter((s) => s.category === "tvatt_rekond" && s.is_addon);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-dark noise-overlay relative py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.16_0.015_260),transparent)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/30">
                Våra tjänster
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white mt-4">
                Verkstad, tvätt &amp; rekond
              </h1>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto">
                Från mekanisk expertis till skonsam handtvätt — allt din bil behöver under ett och samma tak.
              </p>
            </ScrollReveal>
          </div>
          {/* Sentinel for sticky CTA visibility */}
          <div id="tjanster-hero-end" className="absolute bottom-0 left-0 h-1 w-full" />
        </section>

        <TjansterContent
          verkstadServices={verkstadServices}
          washMain={washMain}
          washAddons={washAddons}
        />

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
