import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/siteData";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/academy",
    "/hangout-2027",
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
      route === "/hangout-2027" ||
      route === "/hybrid" ||
      route === "/next-stitch"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/academy"
        ? 0.95
        : route === "/hangout-2027" ||
          route === "/hybrid" ||
          route === "/next-stitch"
        ? 0.9
        : 0.85,
  }));
}
