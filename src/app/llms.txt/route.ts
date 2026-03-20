import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const [{ data: services }, { data: articles }] = await Promise.all([
    supabase
      .from("services")
      .select("title, slug, landing_content")
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("articles")
      .select("title, slug")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
  ]);

  const lines: string[] = [
    "# Tullinge Bilteknik",
    "",
    "> Professionell bilverkstad i Tullinge, södra Stockholm. Service, reparation och diagnostik av alla bilmärken.",
    "",
  ];

  // Services with landing pages
  const landingServices = (services || []).filter(
    (s) => s.landing_content && s.landing_content.trim()
  );
  if (landingServices.length > 0) {
    lines.push("## Tjänster", "");
    for (const s of landingServices) {
      lines.push(`- [${s.title}](/api/md/tjanster/${s.slug})`);
    }
    lines.push("");
  }

  // Articles
  if (articles && articles.length > 0) {
    lines.push("## Artiklar", "");
    for (const a of articles) {
      lines.push(`- [${a.title}](/api/md/artiklar/${a.slug})`);
    }
    lines.push("");
  }

  lines.push(
    "## Kontakt",
    "",
    "- Telefon: 08-778 60 50",
    "- E-post: info@tullingebilteknik.se",
    "- Adress: Mekanikervägen 3, 146 33 Tullinge",
    "- Öppettider: Mån–Fre 08:00–16:00",
    "- Webb: https://tullingebilteknik.se",
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
