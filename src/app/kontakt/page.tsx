import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Kontakta oss
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Vi finns här för dig
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Fyll i formuläret nedan, ring oss eller skicka ett mail. Vi återkommer så snart vi
              kan.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Skicka en förfrågan</h2>
                  <ContactForm sourcePage="kontakt" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Kontaktuppgifter</h2>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Telefon</p>
                        <a
                          href="tel:0812345678"
                          className="text-base font-semibold text-slate-900 hover:text-amber-600"
                        >
                          08-123 456 78
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">E-post</p>
                        <a
                          href="mailto:info@tullingebilteknik.se"
                          className="text-base font-semibold text-slate-900 hover:text-amber-600"
                        >
                          info@tullingebilteknik.se
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Adress</p>
                        <p className="text-base font-semibold text-slate-900">
                          Exempelgatan 1<br />
                          146 30 Tullinge
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Öppettider</p>
                        <div className="text-sm text-slate-700 space-y-1 mt-1">
                          <p>
                            <span className="font-medium">Mån-Fre:</span> 07:00 - 17:00
                          </p>
                          <p>
                            <span className="font-medium">Lördag:</span> 09:00 - 14:00
                          </p>
                          <p>
                            <span className="font-medium">Söndag:</span> Stängt
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Map placeholder */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
