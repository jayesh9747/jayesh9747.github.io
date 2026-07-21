import type { MetadataRoute } from "next";
import { publishedCaseStudies } from "@/lib/case-studies";

export const dynamic = "force-static";

const siteUrl = "https://jayesh9747.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...publishedCaseStudies.map((study) => ({
      url: `${siteUrl}/work/${study.slug}/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
