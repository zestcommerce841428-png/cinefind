import { ImageResponse } from "next/og";
import { getTrending } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary } from "@/lib/tmdb/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function HomeOpenGraphImage() {
  const trending = await getTrending("movie", "day", 1).catch(() => null);
  const posters = ((trending?.results as MovieSummary[]) ?? [])
    .filter((m) => m.poster_path)
    .slice(0, 6)
    .map((m) => tmdbImage(m.poster_path, "w500"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b0e14 0%, #12161f 100%)",
          padding: 56,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {posters.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={p!}
              alt=""
              width={150}
              height={225}
              style={{ borderRadius: 12, objectFit: "cover", opacity: 0.9 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>CineFind</div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.8, marginTop: 12, maxWidth: 900 }}>
          Find your next watch, not just a search result.
        </div>
      </div>
    ),
    { ...size }
  );
}
