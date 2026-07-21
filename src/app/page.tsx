import { Hero } from "@/components/sections/Hero";
import { Proof } from "@/components/sections/Proof";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Lab } from "@/components/sections/Lab";
import { Experience } from "@/components/sections/Experience";
import { Closing } from "@/components/sections/Closing";
import { profile, stackBands } from "@/lib/data";
import { publishedCaseStudies } from "@/lib/case-studies";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.tagline,
    email: profile.email,
    url: "https://jayesh9747.github.io",
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    sameAs: profile.socials
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
    knowsAbout: stackBands.flatMap((b) => b.items),
    subjectOf: publishedCaseStudies.map((c) => ({
      "@type": "CreativeWork",
      name: c.name,
      url: `https://jayesh9747.github.io/work/${c.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Proof />
      <SelectedWork />
      <Lab />
      <Experience />
      <Closing />
    </>
  );
}
