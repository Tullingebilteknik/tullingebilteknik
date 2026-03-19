"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/artiklar", label: "Artiklar" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/tb-logo-svart.png"
            alt="Tullinge Bilteknik"
            width={160}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-xs font-500 uppercase tracking-wider text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Phone + Mobile */}
        <div className="flex items-center gap-3">
          {/* Desktop: phone number */}
          <a
            href="tel:087786050"
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-xs text-foreground/50 hover:text-foreground transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            08-778 60 50
          </a>

          <a
            href="#boka"
            className="hidden sm:inline-flex items-center bg-primary text-primary-foreground font-heading font-600 text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px active:scale-[0.97] active:shadow-none"
          >
            Boka service
          </a>

          {/* Mobile: phone icon */}
          <a
            href="tel:087786050"
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/50 hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl w-72 border-l border-border/50">
              <SheetTitle className="sr-only">Meny</SheetTitle>
              <nav className="flex flex-col gap-5 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-500 uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="#boka"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-primary-foreground font-heading font-600 text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)]"
                >
                  Boka service
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
