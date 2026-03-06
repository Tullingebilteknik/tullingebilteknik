import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Läs våra artiklar om bilunderhåll, tips och nyheter. Tullinge Bilteknik delar kunskap om allt som rör din bil.",
};

export const dynamic = "force-dynamic";
export const revalidate = 3600; // ISR: revalidate every hour

export default async function ArtiklarPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3">
              Artiklar & tips
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Kunskap om din bil
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Tips, guider och nyheter från våra mekaniker. Håll dig uppdaterad om allt som rör din
              bil.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/artiklar/${article.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:border-amber-200"
                  >
                    {article.cover_image ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-300">TB</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <CalendarDays className="h-4 w-4" />
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString("sv-SE")
                          : ""}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-slate-600 line-clamp-3">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-slate-500">Inga artiklar publicerade ännu.</p>
                <p className="text-sm text-slate-400 mt-2">Kom tillbaka snart!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
