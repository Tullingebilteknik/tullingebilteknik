"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "ny";
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadArticle() {
    const { data } = await supabase.from("articles").select("*").eq("id", id).single();
    if (data) {
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCoverImage(data.cover_image || "");
      setIsPublished(data.is_published);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("images").upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      setCoverImage(urlData.publicUrl);
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

  async function handleSave() {
    setLoading(true);

    const articleData = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      cover_image: coverImage || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    if (isNew) {
      const { data, error } = await supabase
        .from("articles")
        .insert(articleData)
        .select()
        .single();
      if (!error && data) {
        router.push(`/admin/artiklar/${data.id}`);
      }
    } else {
      await supabase.from("articles").update(articleData).eq("id", id);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/artiklar"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isNew ? "Ny artikel" : "Redigera artikel"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
            <Label htmlFor="published" className="text-sm">
              {isPublished ? "Publicerad" : "Utkast"}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={loading || !title}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Sparar..." : "Spara"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title & Slug */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew) setSlug(slugify(e.target.value));
              }}
              placeholder="Artikelns rubrik"
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL-slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="artikelns-url-slug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Sammanfattning</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="En kort sammanfattning av artikeln..."
              rows={2}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-xl border bg-white p-6">
          <Label className="mb-3 block">Omslagsbild</Label>
          {coverImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Omslagsbild"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setCoverImage("")}
              >
                Ta bort
              </Button>
            </div>
          ) : (
            <label className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">
                  {uploading ? "Laddar upp..." : "Klicka för att ladda upp"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Content */}
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <Label>Innehåll (Markdown)</Label>
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
              placeholder="Skriv din artikel i Markdown..."
              rows={15}
              className="font-mono text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
