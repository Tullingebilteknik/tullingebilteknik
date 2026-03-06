"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const services = [
  "Service & underhåll",
  "Bromsar",
  "Däck & hjul",
  "AC-service",
  "Felsökning & diagnostik",
  "Besiktningsförberedelse",
  "Oljebyte",
  "Avgassystem",
  "Koppling & växellåda",
  "Elektronik & elsystem",
  "Övrigt",
];

interface ContactFormProps {
  sourcePage?: string;
  compact?: boolean;
}

export function ContactForm({ sourcePage = "unknown", compact = false }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service_interest: formData.get("service_interest") as string || null,
      message: formData.get("message") as string,
      source_page: sourcePage,
    };

    const supabase = createClient();
    const { error: insertError } = await supabase.from("leads").insert(data);

    setLoading(false);

    if (insertError) {
      setError("Något gick fel. Försök igen eller ring oss direkt.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Tack för din förfrågan!</h3>
        <p className="text-slate-600">Vi återkommer till dig så snart som möjligt.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className="space-y-2">
          <Label htmlFor="name">Namn *</Label>
          <Input id="name" name="name" required placeholder="Ditt namn" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="07X-XXX XX XX" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" name="email" type="email" placeholder="din@email.se" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_interest">Tjänst</Label>
          <Select name="service_interest">
            <SelectTrigger id="service_interest">
              <SelectValue placeholder="Välj tjänst (valfritt)" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Meddelande *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Beskriv ditt ärende..."
          rows={compact ? 3 : 5}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
        size="lg"
      >
        {loading ? (
          "Skickar..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Skicka förfrågan
          </>
        )}
      </Button>
    </form>
  );
}
