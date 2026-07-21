import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/work/CaseStudyView";
import { getCaseStudy, publishedCaseStudies } from "@/lib/case-studies";
import { profile } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

/** Locked studies are excluded, so nothing half-written gets a URL. */
export function generateStaticParams() {
  return publishedCaseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const title = `${study.name} — ${study.role}`;
  const description = study.hook;
  const url = `https://jayesh9747.github.io/work/${study.slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: profile.os,
      images: study.shot ? [study.shot] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: study.shot ? [study.shot] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.name,
    abstract: study.hook,
    author: { "@type": "Person", name: profile.name },
    dateCreated: study.year,
    about: study.stack.flatMap((s) => s.items),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyView study={study} />
    </>
  );
}
