import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ServiceConfigurator } from "@/components/configurator/ServiceConfigurator";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { TrustBanner } from "@/components/sections/TrustBanner";
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
        <TrustBanner />
        <ServiceConfigurator />
        <Testimonials />
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
