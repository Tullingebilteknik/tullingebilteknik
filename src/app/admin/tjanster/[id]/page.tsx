"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FaqItem {
  question: string;
  answer: string;
}

export default function ServiceLandingEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [content, setContent] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadService() {
    const { data } = await supabase.from("services").select("*").eq("id", id).single();
    if (data) {
      setTitle(data.title);
      setSlug(data.slug);
      setMetaDesc(data.landing_meta_desc || "");
      setContent(data.landing_content || "");
      setHeroImage(data.landing_hero_image || "");
      setFaq(data.landing_faq || []);
    }
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("images").upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      setHeroImage(urlData.publicUrl);
    }
    setUploading(false);
  }

  async function handleInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("images").upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      setContent((prev) => prev + `\n\n![${file.name}](${urlData.publicUrl})\n`);
    }
    setUploading(false);
  }

  function addFaqItem() {
    setFaq([...faq, { question: "", answer: "" }]);
  }

  function updateFaqItem(index: number, field: "question" | "answer", value: string) {
    setFaq(faq.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function removeFaqItem(index: number) {
    setFaq(faq.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setLoading(true);
    setSaved(false);

    const cleanFaq = faq.filter((item) => item.question.trim() && item.answer.trim());

    await supabase
      .from("services")
      .update({
        landing_content: content,
        landing_meta_desc: metaDesc,
        landing_hero_image: heroImage || null,
        landing_faq: cleanFaq,
      })
      .eq("id", id);

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/tjanster"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Landningssida: {title}
            </h1>
            <Link
              href={`/tjanster/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mt-1"
            >
              /tjanster/{slug}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Sparat!</span>}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Sparar..." : "Spara"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meta description */}
        <div className="rounded-xl border bg-white p-6">
          <div className="space-y-2">
            <Label htmlFor="meta_desc">
              Meta description
              <span className="text-xs text-slate-400 ml-2">
                ({metaDesc.length}/155 tecken — visas i sökresultat)
              </span>
            </Label>
            <Textarea
              id="meta_desc"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Kort beskrivning för sökmotorer. Max 155 tecken, inkludera CTA."
              rows={2}
              maxLength={155}
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-xl border bg-white p-6">
          <Label className="mb-3 block">
            Hero-bild
            <span className="text-xs text-slate-400 ml-2">
              Visas i hero-sektionen och i sökresultat. WebP rekommenderas.
            </span>
          </Label>
          {heroImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Hero-bild"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setHeroImage("")}
              >
                Ta bort
              </Button>
            </div>
          ) : (
            <label className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">
                  {uploading ? "Laddar upp..." : "Klicka för att ladda upp hero-bild"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleHeroUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Content */}
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <Label>
              Innehåll (Markdown)
              <span className="text-xs text-slate-400 ml-2">500–800 ord rekommenderas för SEO</span>
            </Label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Infoga bild
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInsertImage}
                  disabled={uploading}
                />
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Redigera" : "Förhandsgranska"}
              </Button>
            </div>
          </div>

          {showPreview ? (
            <div className="prose prose-slate max-w-none min-h-[300px] rounded-lg border p-4 bg-slate-50">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Skriv landningssidans innehåll i Markdown...\n\n## Så går det till\n1. Steg ett\n2. Steg två\n3. Steg tre\n\n## Varför välja oss?\n- USP 1\n- USP 2\n\n## Nära dig i södra Stockholm\nVår verkstad i Tullinge...`}
              rows={15}
              className="font-mono text-sm"
            />
          )}
        </div>

        {/* FAQ */}
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Label>
              Vanliga frågor (FAQ)
              <span className="text-xs text-slate-400 ml-2">3–5 frågor rekommenderas för SEO</span>
            </Label>
            <Button variant="outline" size="sm" onClick={addFaqItem}>
              <Plus className="mr-2 h-4 w-4" />
              Lägg till fråga
            </Button>
          </div>

          {faq.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">
              Inga frågor ännu. Klicka &quot;Lägg till fråga&quot; för att börja.
            </p>
          ) : (
            <div className="space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <Label className="text-xs text-slate-400">Fråga {i + 1}</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => updateFaqItem(i, "question", e.target.value)}
                        placeholder="T.ex. Vad kostar en service?"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500 mt-5"
                      onClick={() => removeFaqItem(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Svar</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(i, "answer", e.target.value)}
                      placeholder="Svara kort och informativt..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
