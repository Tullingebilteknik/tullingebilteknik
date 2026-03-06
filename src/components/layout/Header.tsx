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
    <header className="glass-panel sticky top-0 z-50 w-full border-b-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="font-mono text-sm font-medium text-primary">TB</span>
          <div className="hidden sm:flex items-baseline gap-1">
            <span className="font-heading text-base font-600 uppercase tracking-widest text-primary">
              Tullinge
            </span>
            <span className="font-heading text-base font-600 uppercase tracking-widest text-foreground">
              Bilteknik
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/kontakt"
            className="hidden sm:inline-flex items-center border border-primary/30 px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary/10 hover:border-primary/50 rounded-sm"
          >
            Boka tid
          </Link>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-panel w-72 border-l border-border">
              <SheetTitle className="sr-only">Meny</SheetTitle>
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center justify-center border border-primary/30 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary/10 rounded-sm"
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
