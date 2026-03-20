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
    .eq("category", "verkstad")
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
            telephone: "08-778 60 50",
            email: "info@tullingebilteknik.se",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Mekanikervägen 3",
              addressLocality: "Tullinge",
              postalCode: "146 33",
              addressRegion: "Stockholm",
              addressCountry: "SE",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 59.2006,
              longitude: 17.9088,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "16:00",
              },
            ],
            priceRange: "$$",
            areaServed: [
              { "@type": "City", name: "Tullinge" },
              { "@type": "City", name: "Tumba" },
              { "@type": "City", name: "Huddinge" },
              { "@type": "City", name: "Salem" },
              { "@type": "City", name: "Botkyrka" },
              { "@type": "City", name: "Flemingsberg" },
              { "@type": "City", name: "Segeltorp" },
              { "@type": "City", name: "Skogås" },
              { "@type": "City", name: "Trångsund" },
              { "@type": "City", name: "Vårby" },
              { "@type": "City", name: "Kungens Kurva" },
              { "@type": "City", name: "Rönninge" },
              { "@type": "City", name: "Södertälje" },
            ],
          }),
        }}
      />
    </>
  );
}
