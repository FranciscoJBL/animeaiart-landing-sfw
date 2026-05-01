import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://creators.anime-ai.art",
  trailingSlash: "always",
  integrations: [tailwind({ applyBaseStyles: false })],
});
