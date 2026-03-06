import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="hero-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-heading text-lg font-semibold text-white mb-3 block">
              Tullinge Bilteknik
            </span>
            <p className="text-sm text-white/50 mb-4">
              Kvalitet. Precision. Förtroende.
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              Din lokala bilverkstad i Tullinge. Vi servar alla bilmärken med kvalitet och
              personlig service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Snabblänkar
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Hem" },
                { href: "/tjanster", label: "Tjänster" },
                { href: "/artiklar", label: "Artiklar" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-white/40 shrink-0" />
                <a href="tel:0812345678" className="text-sm text-white/60 hover:text-white transition-colors">
                  08-123 456 78
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-white/40 shrink-0" />
                <a href="mailto:info@tullingebilteknik.se" className="text-sm text-white/60 hover:text-white transition-colors">
                  info@tullingebilteknik.se
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-white/40 shrink-0" />
                <span className="text-sm text-white/60">
                  Exempelgatan 1<br />
                  146 30 Tullinge
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Öppettider
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-white/60">
                <span>MÅN–FRE</span>
                <span className="text-white font-medium">07:00–17:00</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>LÖRDAG</span>
                <span className="text-white font-medium">09:00–14:00</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>SÖNDAG</span>
                <span className="text-white font-medium">Stängt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/admin/login"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              Tullinge Bilteknik
            </Link>
            . Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
