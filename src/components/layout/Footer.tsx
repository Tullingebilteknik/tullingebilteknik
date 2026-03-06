import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-heading text-base font-600 uppercase tracking-widest text-primary">
                Tullinge
              </span>
              <span className="font-heading text-base font-600 uppercase tracking-widest text-foreground">
                Bilteknik
              </span>
            </div>
            <p className="font-mono text-xs text-primary/50 tracking-wider mb-4">
              PRECISION. DIAGNOSTIK. RESULTAT.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Din lokala bilverkstad i Tullinge. Vi servar alla bilmärken med kvalitet och
              personlig service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary/50 shrink-0" />
                <a href="tel:0812345678" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  08-123 456 78
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary/50 shrink-0" />
                <a href="mailto:info@tullingebilteknik.se" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@tullingebilteknik.se
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary/50 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Exempelgatan 1<br />
                  146 30 Tullinge
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Öppettider
            </h3>
            <div className="space-y-2 font-mono text-xs">
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
          </div>
        </div>

        <div className="line-gradient mt-12" />
        <div className="pt-6 text-center">
          <p className="font-mono text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/admin/login"
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
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
