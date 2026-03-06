"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
        {/* Typographic Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-heading text-lg font-700 tracking-tight text-foreground">
            TULLINGE
          </span>
          <span className="font-heading text-[10px] font-500 tracking-[0.25em] uppercase text-muted-foreground">
            Bilteknik
          </span>
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

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/kontakt"
            className="hidden sm:inline-flex items-center bg-primary text-primary-foreground font-heading font-600 text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)] hover:-translate-y-px active:scale-[0.97] active:shadow-none"
          >
            Boka tid
          </Link>

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
                <Link
                  href="/kontakt"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-primary-foreground font-heading font-600 text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_4px_16px_oklch(0.72_0.12_75/25%)]"
                >
                  Boka tid
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
