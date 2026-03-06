import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="hero-dark noise-overlay relative">
      {/* Top border */}
      <div className="h-px bg-white/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/5">
          {/* Brand */}
          <div className="lg:pr-8">
            <span className="font-heading text-lg font-700 tracking-tight text-white block">
              TULLINGE
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-4">
              Bilteknik
            </span>
            <p className="text-sm text-white/50 leading-relaxed">
              Din lokala bilverkstad i Tullinge. Vi servar alla bilmärken med kvalitet och
              personlig service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:px-8">
            <h3 className="font-mono text-[11px] font-500 text-white/40 uppercase tracking-widest mb-5">
              Navigation
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
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:px-8">
            <h3 className="font-mono text-[11px] font-500 text-white/40 uppercase tracking-widest mb-5">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-white/30 shrink-0" />
                <a href="tel:0812345678" className="font-mono text-sm text-white/50 hover:text-white transition-colors">
                  08-123 456 78
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-white/30 shrink-0" />
                <a href="mailto:info@tullingebilteknik.se" className="font-mono text-sm text-white/50 hover:text-white transition-colors">
                  info@tullingebilteknik.se
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-white/30 shrink-0" />
                <span className="font-mono text-sm text-white/50">
                  Exempelgatan 1<br />
                  146 30 Tullinge
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="lg:pl-8">
            <h3 className="font-mono text-[11px] font-500 text-white/40 uppercase tracking-widest mb-5">
              Öppettider
            </h3>
            <div className="font-mono text-xs space-y-0">
              <div className="flex justify-between text-white/50 py-2.5 border-b border-white/5">
                <span>MÅN–FRE</span>
                <span className="text-white font-500">07:00–17:00</span>
              </div>
              <div className="flex justify-between text-white/50 py-2.5 border-b border-white/5">
                <span>LÖRDAG</span>
                <span className="text-white font-500">09:00–14:00</span>
              </div>
              <div className="flex justify-between text-white/50 py-2.5">
                <span>SÖNDAG</span>
                <span className="text-white font-500">Stängt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
          <p className="font-mono text-[11px] text-white/30">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/admin/login"
              className="text-white/30 hover:text-white/50 transition-colors"
            >
              Tullinge Bilteknik
            </Link>
          </p>
          <a href="#" className="font-mono text-[11px] text-white/20 hover:text-white/40 transition-colors">
            &uarr; Till toppen
          </a>
        </div>
      </div>
    </footer>
  );
}
