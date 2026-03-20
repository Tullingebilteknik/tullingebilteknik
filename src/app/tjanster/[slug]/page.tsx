import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE_URL = "https://tullingebilteknik.se";

const AREA_SERVED = [
  "Tullinge", "Tumba", "Huddinge", "Salem", "Botkyrka",
  "Flemingsberg", "Segeltorp", "Skogås", "Trångsund",
  "Vårby", "Kungens Kurva", "Rönninge", "Södertälje",
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("title, description, landing_meta_desc, landing_hero_image, slug")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!service) return { title: "Tjänst ej funnen" };

  const description = service.landing_meta_desc || service.description;
  const title = `${service.title} Tullinge | Bilverkstad Botkyrka — Tullinge Bilteknik`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/tjanster/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/tjanster/${service.slug}`,
      ...(service.landing_hero_image && {
        images: [{ url: service.landing_hero_image, alt: `${service.title} — Tullinge Bilteknik` }],
      }),
    },
  };
}

function ServiceSchema({ service }: { service: Service }) {
  const description = service.landing_meta_desc || service.description;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description,
    url: `${BASE_URL}/tjanster/${service.slug}`,
    ...(service.landing_hero_image && { image: service.landing_hero_image }),
    provider: {
      "@type": "AutoRepair",
      name: "Tullinge Bilteknik",
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
    },
    areaServed: AREA_SERVED.map((city) => ({ "@type": "City", name: city })),
    ...(service.price && {
      offers: {
        "@type": "Offer",
        price: service.price.replace(/[^\d]/g, ""),
        priceCurrency: "SEK",
      },
    }),
  };

  const faq = service.landing_faq || [];
  const faqSchema = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export default async function ServiceLandingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!service) notFound();

  const hasLanding = !!(service.landing_content && service.landing_content.trim());
  const faq = (service.landing_faq || []) as { question: string; answer: string }[];

  return (
    <>
      <ServiceSchema service={service} />
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-dark noise-overlay relative py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.16_0.015_260),transparent)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div className="text-center lg:text-left">
                <Link
                  href="/tjanster"
                  className="inline-flex items-center gap-2 text-sm font-500 text-white/40 hover:text-white/70 transition-colors mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Alla tjänster
                </Link>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white">
                  {service.title} i Tullinge
                </h1>

                {/* AIO paragraph */}
                <p className="mt-4 text-white/60 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {service.description}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/#boka"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-600 text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-[0_4px_24px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px"
                  >
                    Boka {service.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="tel:08-7786050"
                    className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white font-heading font-500 text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    08-778 60 50
                  </a>
                </div>
              </div>

              {/* Hero image */}
              {service.landing_hero_image && (
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={service.landing_hero_image}
                    alt={`${service.title} — Tullinge Bilteknik`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {hasLanding ? (
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-700 prose-a:text-primary prose-img:rounded-xl prose-strong:text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {service.landing_content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-700">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.long_description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="py-16 sm:py-20 bg-muted">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-700 text-foreground mb-2">
                Vanliga frågor
              </h2>
              <div className="w-12 h-0.5 bg-primary mb-8" />

              <div className="space-y-3">
                {faq.map((item, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border/50 bg-white overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-heading font-600 text-foreground hover:bg-muted/50 transition-colors list-none">
                      <span>{item.question}</span>
                      <span className="text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none ml-4">+</span>
                    </summary>
                    <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA + NAP */}
        <section className="hero-dark noise-overlay relative py-16 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.16_0.015_260),transparent)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-700 text-white mb-4">
              Redo att boka?
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Kontakta oss idag eller boka direkt online. Vi finns på Mekanikervägen 3 i Tullinge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/#boka"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-600 text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-[0_4px_24px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px"
              >
                Boka {service.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:08-7786050"
                className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white font-heading font-500 text-sm border border-white/10 px-8 py-3.5 rounded-full transition-colors"
              >
                <Phone className="h-4 w-4" />
                Ring 08-778 60 50
              </a>
            </div>

            {/* NAP data */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/40 text-sm font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <a
                  href="https://maps.google.com/maps?q=Mekanikerv%C3%A4gen+3,+146+33+Tullinge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/70 transition-colors"
                >
                  Mekanikervägen 3, 146 33 Tullinge
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mån–Fre 08:00–16:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:08-7786050" className="hover:text-white/70 transition-colors">
                  08-778 60 50
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
