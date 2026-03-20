import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/sections/CTABanner";
import { TjansterContent } from "@/components/sections/TjansterContent";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import Link from "next/link";
import { Phone, Star, Wrench as WrenchIcon, Clock, Users } from "lucide-react";

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
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#boka"
                  className="btn-hero inline-flex items-center gap-2 px-7 py-3 rounded-full font-heading font-600 text-sm"
                >
                  Boka service
                </Link>
                <a
                  href="tel:087786050"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-heading text-sm"
                >
                  <Phone className="h-4 w-4" />
                  08-778 60 50
                </a>
              </div>
            </ScrollReveal>
          </div>
          {/* Sentinel for sticky CTA visibility */}
          <div id="tjanster-hero-end" className="absolute bottom-0 left-0 h-1 w-full" />
        </section>

        {/* Trust bar */}
        <section className="py-6 border-b border-border/50 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { icon: Star, text: "4.9 ★ Google" },
              { icon: Users, text: "500+ nöjda kunder" },
              { icon: WrenchIcon, text: "Alla bilmärken" },
              { icon: Clock, text: "Svar samma dag" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="font-heading font-500">{text}</span>
              </div>
            ))}
          </div>
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
