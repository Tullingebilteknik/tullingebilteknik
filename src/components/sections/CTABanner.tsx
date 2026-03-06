import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Redo att boka din tid?
        </h2>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          Kontakta oss idag för att boka en tid eller få en kostnadsfri offert. Vi finns här för att
          hjälpa dig.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-base px-8 h-12"
          >
            <Link href="/kontakt">
              <Phone className="mr-2 h-5 w-5" />
              Boka tid nu
            </Link>
          </Button>
          <a
            href="tel:0812345678"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            eller ring 08-123 456 78
          </a>
        </div>
      </div>
    </section>
  );
}
