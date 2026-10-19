import type { PageSection, DataTable, InternalLink } from "@/config/types";
import { esc } from "@/lib/fixed-template/render";
import { routePath } from "@/lib/urls";

function tableHtml(table: DataTable): string {
  const head = table.columns.map(label => `<th scope="col">${esc(label)}</th>`).join("");
  const rows = table.rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join("")}</tr>`).join("");
  return `<div class="guide-table-wrap"><table><caption>${esc(table.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function linksHtml(links: InternalLink[]): string {
  return `<ul class="guide-related-links">${links.map(item => `<li><a href="${esc(routePath(item.slug))}"><strong>${esc(item.label)}</strong>${item.description ? `<span>${esc(item.description)}</span>` : ""}</a></li>`).join("")}</ul>`;
}
export function renderSeoSections(sections: PageSection[]): string {
  return sections.map(section => {
    const paragraphs = (section.paragraphs ?? []).map(line => `<p>${esc(line)}</p>`).join("");
    const intro = section.intro ? `<p class="guide-intro">${esc(section.intro)}</p>` : "";
    const subsections = (section.subsections ?? []).map(part =>
      `<div class="guide-subsection"><h3>${esc(part.heading)}</h3>${part.paragraphs.map(line => `<p>${esc(line)}</p>`).join("")}${part.bullets?.length ? `<ul>${part.bullets.map(line => `<li>${esc(line)}</li>`).join("")}</ul>` : ""}${part.table ? tableHtml(part.table) : ""}</div>`
    ).join("");
    const steps = section.steps?.length
      ? `<ol class="guide-steps">${section.steps.map(step => `<li><strong>${esc(step.heading)}</strong><p>${esc(step.description)}</p></li>`).join("")}</ol>`
      : "";
    return `<section class="guide-section" id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${subsections}${steps}${section.table ? tableHtml(section.table) : ""}${section.links?.length ? linksHtml(section.links) : ""}</section>`;
  }).join("");
}
export function guideNav(links: InternalLink[]): string {
  return `<nav class="guide-mobile-navigation" aria-label="All guides"><span>Explore guides</span><div>${links.map(item => `<a href="${esc(routePath(item.slug))}">${esc(item.label)}</a>`).join("")}</div></nav>`;
}
