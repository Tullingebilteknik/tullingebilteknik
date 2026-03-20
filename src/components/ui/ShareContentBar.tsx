"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareContentBarProps {
  markdown: string;
  pageUrl: string;
}

export function ShareContentBar({ markdown, pageUrl }: ShareContentBarProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://tullingebilteknik.se${pageUrl}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleChatGPT() {
    const prompt = `Analysera denna sida och ge förbättringsförslag för SEO och konvertering:\n\nURL: ${fullUrl}\n\n${markdown}`;
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank"
    );
  }

  function handleGemini() {
    const prompt = `Analysera denna sida och ge förbättringsförslag för SEO och konvertering:\n\nURL: ${fullUrl}\n\n${markdown}`;
    navigator.clipboard.writeText(prompt);
    window.open("https://gemini.google.com/app", "_blank");
  }

  return (
    <div className="flex items-center justify-end gap-1 mb-6 pb-4 border-b border-border/30">
      <span className="text-[11px] text-muted-foreground/40 mr-auto font-mono uppercase tracking-wider">
        Dela
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="text-muted-foreground/40 hover:text-foreground h-7 px-2 text-[11px] gap-1.5 rounded-lg"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
        {copied ? "Kopierat!" : "Markdown"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleChatGPT}
        className="text-muted-foreground/40 hover:text-foreground h-7 px-2 text-[11px] gap-1.5 rounded-lg"
      >
        <MessageCircle className="h-3 w-3" />
        ChatGPT
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleGemini}
        className="text-muted-foreground/40 hover:text-foreground h-7 px-2 text-[11px] gap-1.5 rounded-lg"
      >
        <Sparkles className="h-3 w-3" />
        Gemini
      </Button>
    </div>
  );
}
