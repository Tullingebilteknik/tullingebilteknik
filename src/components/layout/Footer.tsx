import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500">
                <span className="text-sm font-bold text-slate-900">TB</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">Tullinge</span>
                <span className="text-lg font-bold text-amber-400"> Bilteknik</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Din pålitliga bilverkstad i Tullinge. Vi servar alla bilmärken med kvalitet och
              personlig service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
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
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <a href="tel:0812345678" className="text-sm hover:text-amber-400 transition-colors">
                  08-123 456 78
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <a href="mailto:info@tullingebilteknik.se" className="text-sm hover:text-amber-400 transition-colors">
                  info@tullingebilteknik.se
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="text-sm">
                  Exempelgatan 1<br />
                  146 30 Tullinge
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Öppettider
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <div className="text-sm">
                  <p>Måndag - Fredag</p>
                  <p className="text-white font-medium">07:00 - 17:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 ml-7">
                <div className="text-sm">
                  <p>Lördag</p>
                  <p className="text-white font-medium">09:00 - 14:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 ml-7">
                <div className="text-sm">
                  <p>Söndag</p>
                  <p className="text-white font-medium">Stängt</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Tullinge Bilteknik. Alla rättigheter förbehållna.
            <Link
              href="/admin/login"
              className="text-slate-700 hover:text-slate-500 transition-colors ml-2"
              aria-label="Admin"
            >
              .
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
