import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/siteData";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/academy",
    "/hybrid",
    "/next-stitch",
    "/register",
    "/pay",
    "/couture",
    "/about",
    "/contact",
  ];
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_CONFIG.domain}${route}`,
    lastModified: now,
    changeFrequency:
      route === "" ||
      route === "/academy" ||
      route === "/hybrid" ||
      route === "/next-stitch"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/academy"
        ? 0.95
        : route === "/hybrid" || route === "/next-stitch"
        ? 0.9
        : 0.85,
  }));
}
