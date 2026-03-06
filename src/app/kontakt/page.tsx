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
        <section className="scanlines relative bg-background py-16 sm:py-20">
          <div className="tech-grid absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
              Kontakta oss
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 uppercase text-foreground">
              Vi finns här för dig
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Fyll i formuläret nedan, ring oss eller skicka ett mail. Vi återkommer så snart vi
              kan.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="glass-panel rounded-sm p-8">
                  <h2 className="font-heading text-2xl font-700 uppercase text-foreground mb-6">
                    Skicka en förfrågan
                  </h2>
                  <ContactForm sourcePage="kontakt" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel rounded-sm p-8">
                  <h2 className="font-heading text-xl font-700 uppercase text-foreground mb-6">
                    Kontaktuppgifter
                  </h2>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Telefon</p>
                        <a
                          href="tel:0812345678"
                          className="text-foreground font-medium hover:text-primary transition-colors"
                        >
                          08-123 456 78
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">E-post</p>
                        <a
                          href="mailto:info@tullingebilteknik.se"
                          className="text-foreground font-medium hover:text-primary transition-colors"
                        >
                          info@tullingebilteknik.se
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Adress</p>
                        <p className="text-foreground font-medium">
                          Exempelgatan 1<br />
                          146 30 Tullinge
                        </p>
                      </div>
                    </li>
                    <li className="pt-4 border-t border-border">
                      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">Öppettider</p>
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>MÅN–FRE</span>
                          <span className="text-foreground font-medium">07:00–17:00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>LÖRDAG</span>
                          <span className="text-foreground font-medium">09:00–14:00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>SÖNDAG</span>
                          <span className="text-foreground font-medium">Stängt</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Map */}
                <div className="glass-panel rounded-sm overflow-hidden">
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
