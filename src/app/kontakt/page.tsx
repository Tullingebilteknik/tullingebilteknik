import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakta Tullinge Bilteknik för att boka tid eller få en offert. Ring, maila eller fyll i formuläret. Bilverkstad i Tullinge.",
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-dark noise-overlay relative py-20 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.16_0.015_260),transparent)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/30">
              Kontakta oss
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white mt-4">
              Vi finns här för dig
            </h1>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              Fyll i formuläret nedan, ring oss eller skicka ett mail. Vi återkommer så snart vi kan.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <h2 className="font-heading text-2xl font-700 text-foreground mb-8">
                  Skicka en förfrågan
                </h2>
                <ContactForm sourcePage="kontakt" />
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="font-heading text-xl font-700 text-foreground mb-6">
                    Kontaktuppgifter
                  </h2>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">Telefon</p>
                        <a
                          href="tel:0812345678"
                          className="text-foreground font-500 hover:text-primary transition-colors"
                        >
                          08-123 456 78
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">E-post</p>
                        <a
                          href="mailto:info@tullingebilteknik.se"
                          className="text-foreground font-500 hover:text-primary transition-colors"
                        >
                          info@tullingebilteknik.se
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">Adress</p>
                        <p className="text-foreground font-500">
                          Exempelgatan 1<br />
                          146 30 Tullinge
                        </p>
                      </div>
                    </li>
                    <li className="pt-4 border-t border-border/50">
                      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">Öppettider</p>
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>MÅN–FRE</span>
                          <span className="text-foreground font-500">07:00–17:00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>LÖRDAG</span>
                          <span className="text-foreground font-500">09:00–14:00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>SÖNDAG</span>
                          <span className="text-foreground font-500">Stängt</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-border/50">
                  <iframe
                    title="Tullinge Bilteknik karta"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8175.5!2d17.9!3d59.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTullinge!5e0!3m2!1ssv!2sse!4v1600000000000"
                    className="w-full h-64"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
