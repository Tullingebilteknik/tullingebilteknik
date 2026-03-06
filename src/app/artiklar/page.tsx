import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Artiklar",
  description:
    "Läs våra artiklar om bilunderhåll, tips och nyheter. Tullinge Bilteknik delar kunskap om allt som rör din bil.",
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

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
        <section className="hero-dark relative py-16 sm:py-20">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold tracking-wide text-white/80 uppercase mb-3">
              Artiklar & tips
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-700 text-white">
              Kunskap om din bil
            </h1>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Tips, guider och nyheter från våra mekaniker. Håll dig uppdaterad om allt som rör din
              bil.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/artiklar/${article.slug}`}
                    className="premium-card group rounded-lg overflow-hidden transition-all"
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
                      <div className="h-48 bg-gradient-to-br from-muted to-white flex items-center justify-center">
                        <span className="font-heading text-3xl text-primary/20">TB</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-xs text-muted-foreground mb-3">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString("sv-SE")
                          : ""}
                      </div>
                      <h2 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Inga artiklar publicerade ännu.</p>
                <p className="text-sm text-muted-foreground/50 mt-2">Kom tillbaka snart!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
