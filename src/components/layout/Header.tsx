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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">TB</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-heading text-lg font-semibold text-foreground">Tullinge</span>
            <span className="font-heading text-lg font-semibold text-primary"> Bilteknik</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/kontakt"
            className="hidden sm:inline-flex items-center bg-primary text-white font-heading font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:bg-primary/90 shadow-sm"
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
            <SheetContent side="right" className="bg-white w-72 border-l border-border">
              <SheetTitle className="sr-only">Meny</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center justify-center bg-primary text-white font-heading font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:bg-primary/90"
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
