"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/admin/reset-password` }
    );

    if (resetError) {
      setError("Något gick fel. Försök igen.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 mb-4">
            <span className="text-lg font-bold text-amber-400">TB</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Glömt lösenord</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ange din e-post så skickar vi en återställningslänk
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-800">
                Om kontot finns skickas ett mejl med en återställningslänk till{" "}
                <strong>{email}</strong>.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="text-sm text-slate-500 hover:text-amber-600 transition-colors"
            >
              Tillbaka till inloggning
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="din@epost.se"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Skickar..." : "Skicka återställningslänk"}
            </Button>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm text-slate-500 hover:text-amber-600 transition-colors"
              >
                Tillbaka till inloggning
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
