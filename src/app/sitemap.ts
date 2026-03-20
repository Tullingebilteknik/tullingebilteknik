import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tullingebilteknik.se";
  const supabase = createAdminClient();

  const [{ data: articles }, { data: services }] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("is_published", true),
    supabase
      .from("services")
      .select("slug, updated_at, landing_content")
      .eq("is_visible", true),
  ]);

  const articleUrls: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const serviceUrls: MetadataRoute.Sitemap = (services || [])
    .filter((s) => s.landing_content && s.landing_content.trim())
    .map((service) => ({
      url: `${baseUrl}/tjanster/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tjanster`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artiklar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...serviceUrls,
    ...articleUrls,
  ];
}
