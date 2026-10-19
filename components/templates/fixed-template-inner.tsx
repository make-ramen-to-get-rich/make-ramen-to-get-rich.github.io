import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { guideNav, renderSeoSections } from "./fixed-template-sections";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function articleInner(page: SeoPageDefinition): string {
  const related = getRelatedPages(page);
  const nav = visibleCorePages.map(item => ({ label: item.navLabel, slug: item.slug }));
  const official = siteConfig.game.officialUrl
    ? `<p><a class="guide-official-cta" href="${esc(siteConfig.game.officialUrl)}" rel="noopener noreferrer" target="_blank">Open the official Roblox game ↗</a></p>`
    : "";
  const faq = page.faq?.length
    ? `<section class="guide-section" id="faq"><h2>Frequently Asked Questions</h2>${page.faq.map(item => `<div class="guide-subsection"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></div>`).join("")}</section>`
    : "";
  const relatedHtml = related.length
    ? `<section class="guide-section" id="related"><h2>Related Guides</h2><ul class="guide-related-links">${related.map(item => `<li><a href="${esc(routePath(item.slug))}">${esc(item.navLabel)}</a></li>`).join("")}</ul></section>`
    : "";
  return `<div class="template-seo-content"><p class="guide-intro">${esc(page.hero.lead)}</p>${official}${guideNav(nav)}${renderSeoSections(page.sections)}${faq}${relatedHtml}</div>`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: skin === "arcade-play" ? assetPath("/") : "/",
    logoUrl: skin === "arcade-play" ? assetPath(siteConfig.assets.logo) : null,
    ...(skin === "arcade-play" ? { legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: assetPath(routePath(item.slug)) })) } : {}),
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
