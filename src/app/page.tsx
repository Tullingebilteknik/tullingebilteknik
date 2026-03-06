import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { DiagnosticWizard } from "@/components/forms/DiagnosticWizard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServiceGrid services={services || []} />
        <WhyUs />
        <Testimonials />

        {/* Diagnostic Wizard */}
        <section className="py-24 sm:py-32 bg-white border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Boka tid
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-700 text-foreground mt-3">
                Beskriv ditt ärende
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Fyll i formuläret nedan så återkommer vi med en tid som passar dig.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <DiagnosticWizard />
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            name: "Tullinge Bilteknik",
            description:
              "Professionell bilverkstad i Tullinge. Service, reparation och diagnostik av alla bilmärken.",
            url: "https://tullingebilteknik.se",
            telephone: "08-123 456 78",
            email: "info@tullingebilteknik.se",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Exempelgatan 1",
              addressLocality: "Tullinge",
              postalCode: "146 30",
              addressRegion: "Stockholm",
              addressCountry: "SE",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 59.2,
              longitude: 17.9,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "07:00",
                closes: "17:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "09:00",
                closes: "14:00",
              },
            ],
            priceRange: "$$",
            areaServed: [
              { "@type": "City", name: "Tullinge" },
              { "@type": "City", name: "Tumba" },
              { "@type": "City", name: "Huddinge" },
            ],
          }),
        }}
      />
    </>
  );
}
