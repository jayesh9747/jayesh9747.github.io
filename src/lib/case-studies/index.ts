import { rizzl } from "./rizzl";
import { eduteck } from "./eduteck";
import { sarthi } from "./sarthi";
import type { CaseStudy } from "./types";

export * from "./types";

/** Homepage order. Locked studies render as teasers and get no detail route. */
export const caseStudies: CaseStudy[] = [rizzl, eduteck, sarthi];

/** Only these get a /work/<slug> page and a sitemap entry. */
export const publishedCaseStudies = caseStudies.filter((c) => !c.locked);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return publishedCaseStudies.find((c) => c.slug === slug);
}
