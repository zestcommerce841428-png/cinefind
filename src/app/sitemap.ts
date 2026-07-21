import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog";
import { getPopularMovies, getPopularTv } from "@/lib/tmdb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/movies",
    "/movies/discover",
    "/movies/popular",
    "/movies/top-rated",
    "/movies/now-playing",
    "/movies/upcoming",
    "/tv",
    "/tv/discover",
    "/tv/popular",
    "/tv/top-rated",
    "/tv/airing-today",
    "/tv/on-the-air",
    "/people",
    "/genres",
    "/collections",
    "/companies",
    "/networks",
    "/watch-providers",
    "/new-releases",
    "/movies/rated",
    "/compare/movie",
    "/compare/tv",
    "/trending",
    "/find",
    "/search/advanced",
    "/reference/languages",
    "/reference/countries",
    "/reference/certifications",
    "/blog",
    "/about",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  let movieRoutes: MetadataRoute.Sitemap = [];
  let tvRoutes: MetadataRoute.Sitemap = [];
  try {
    const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTv()]);
    movieRoutes = movies.results.map((m) => ({
      url: `${SITE_URL}/movie/${m.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    tvRoutes = tv.results.map((t) => ({
      url: `${SITE_URL}/tv/${t.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // TMDB unavailable at build time; fall back to static routes only
  }

  return [...staticRoutes, ...blogRoutes, ...movieRoutes, ...tvRoutes];
}
