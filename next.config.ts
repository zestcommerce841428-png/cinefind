import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is required for MUI's Emotion runtime styles and the
  // JSON-LD/color-scheme init scripts rendered inline in the document.
  // 'unsafe-eval' is only added in dev — React's dev-mode error overlay and
  // Turbopack HMR use eval() for stack-trace reconstruction; production
  // builds never call eval() so it's correctly omitted there.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://image.tmdb.org https://img.youtube.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.themoviedb.org",
  "frame-src https://www.youtube.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // /widget/* is embedded via <iframe> on third-party sites, so it must
        // not inherit the site-wide frame-ancestors/X-Frame-Options lockdown.
        source: "/:path((?!widget).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
