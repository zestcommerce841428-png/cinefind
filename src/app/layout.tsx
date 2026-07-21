import type { Metadata } from "next";
import { Inter } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { FONT_VARIABLE_CLASS } from "@/theme/fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import GlobalWidgets from "@/components/global/GlobalWidgets";
import { getSessionId } from "@/lib/session";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CineFind — Discover Movies, TV Shows & People",
    template: "%s | CineFind",
  },
  description:
    "Search and discover movies, TV shows, and people with rich details, trailers, cast, reviews, watch providers and more — powered by TMDB.",
  keywords: ["movies", "tv shows", "actors", "movie search", "tmdb", "streaming", "reviews"],
  openGraph: {
    type: "website",
    siteName: "CineFind",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/blog/rss.xml", title: "CineFind Blog" }],
      "application/opensearchdescription+xml": [{ url: "/opensearch.xml", title: "CineFind" }],
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionId = await getSessionId();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${FONT_VARIABLE_CLASS}`}
      suppressHydrationWarning
    >
      <body>
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>
          <SkipLink />
          <Navbar isAuthenticated={!!sessionId} />
          <main id="main-content" style={{ minHeight: "60vh" }}>
            {children}
          </main>
          <Footer />
          <GlobalWidgets />
        </ThemeRegistry>
      </body>
    </html>
  );
}
