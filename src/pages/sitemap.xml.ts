import { SITE_URL } from "../data/site";
import { languages, localePath, type PageKey } from "../data/i18n";

const pages: PageKey[] = ["home", "gallery", "prompts", "characters", "pricing", "faq"];
const imageUrls = [
  "creator-digital-mural.webp",
  "creator-storyboard-desk.webp",
  "creator-production-review.webp",
  "creator-sculpting-workbench.webp",
  "creator-kitchen-scene.webp",
  "creator-bike-repair.webp",
  "creator-library-ladder.webp",
  "creator-mage-bridge.webp",
  "creator-mountain-adventure.webp",
  "creator-forest-ranger.webp",
  "creator-alchemy-workshop.webp",
  "creator-spaceship-cockpit.webp",
  "creator-robot-repair.webp",
  "creator-hologram-lab.webp",
  "creator-archery-range.webp",
  "creator-rooftop-parkour.webp",
  "creator-dojo-training.webp",
  "creator-guitar-stage.webp",
  "creator-recording-studio.webp",
  "creator-night-market.webp",
];

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function urlFor(lang: (typeof languages)[number], page: PageKey) {
  return new URL(localePath(lang, page), SITE_URL).toString();
}

export async function GET() {
  const urls = pages.flatMap((page) =>
    languages.map((lang) => {
      const loc = urlFor(lang, page);
      const alternates = languages
        .map((altLang) => `<xhtml:link rel="alternate" hreflang="${altLang}" href="${xmlEscape(urlFor(altLang, page))}" />`)
        .join("\n    ");
      const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(urlFor("en", page))}" />`;
      const images =
        page === "home"
          ? imageUrls.slice(0, 3).map((name) => `<image:image><image:loc>${SITE_URL}/images/creator-gallery/${name}</image:loc></image:image>`).join("\n    ")
          : page === "gallery"
            ? imageUrls.map((name) => `<image:image><image:loc>${SITE_URL}/images/creator-gallery/${name}</image:loc></image:image>`).join("\n    ")
            : "";
      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${alternates}
    ${xDefault}
    <lastmod>2026-05-01</lastmod>
    <changefreq>${page === "home" || page === "gallery" ? "weekly" : "monthly"}</changefreq>
    <priority>${page === "home" ? "1.0" : page === "gallery" ? "0.9" : "0.8"}</priority>
    ${images}
  </url>`;
    }),
  ).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
