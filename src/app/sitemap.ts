import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/siteData";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/academy", "/register", "/couture", "/about", "/contact"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_CONFIG.domain}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/academy" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/academy" ? 0.95 : 0.85,
  }));
}
