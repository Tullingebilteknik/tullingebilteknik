import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  // Expected paths: ["tjanster", "slug"] or ["artiklar", "slug"]
  if (path.length !== 2) {
    return new Response("Not found", { status: 404 });
  }

  const [type, slug] = path;
  const supabase = createAdminClient();

  if (type === "tjanster") {
    const { data: service } = await supabase
      .from("services")
      .select("title, description, landing_content, landing_faq")
      .eq("slug", slug)
      .eq("is_visible", true)
      .single();

    if (!service || !service.landing_content?.trim()) {
      return new Response("Not found", { status: 404 });
    }

    const faq = (service.landing_faq || []) as { question: string; answer: string }[];

    const lines: string[] = [
      `# ${service.title} i Tullinge`,
      "",
      service.description,
      "",
      "---",
      "",
      service.landing_content,
    ];

    if (faq.length > 0) {
      lines.push("", "## Vanliga frågor", "");
      for (const item of faq) {
        lines.push(`### ${item.question}`, "", item.answer, "");
      }
    }

    lines.push(
      "---",
      "",
      "Tullinge Bilteknik | Mekanikervägen 3, 146 33 Tullinge | 08-778 60 50 | info@tullingebilteknik.se",
      ""
    );

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (type === "artiklar") {
    const { data: article } = await supabase
      .from("articles")
      .select("title, content, published_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!article) {
      return new Response("Not found", { status: 404 });
    }

    const date = article.published_at
      ? new Date(article.published_at).toLocaleDateString("sv-SE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const lines: string[] = [
      `# ${article.title}`,
      "",
      article.content,
      "",
      "---",
      "",
      ...(date ? [`Publicerad: ${date}`, ""] : []),
      "Tullinge Bilteknik | tullingebilteknik.se",
      "",
    ];

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return new Response("Not found", { status: 404 });
}
