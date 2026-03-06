import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTABanner } from "@/components/sections/CTABanner";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) return { title: "Artikel ej funnen" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) notFound();

  return (
    <>
      <Header />
      <main>
        <article className="py-12 sm:py-16 bg-muted">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/artiklar"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Tillbaka till artiklar
            </Link>

            {/* Cover Image */}
            {article.cover_image && (
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Date */}
            <div className="text-sm text-muted-foreground mb-4">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl font-700 text-foreground mb-8">
              {article.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-700 prose-a:text-primary prose-img:rounded-lg prose-strong:text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
