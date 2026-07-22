import { ImageResponse } from "next/og";
import { getMovieDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function MovieOpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id).catch(() => null);

  const title = movie?.title ?? "Movie";
  const year = movie?.release_date?.slice(0, 4) ?? "";
  const rating = movie ? Math.round(movie.vote_average * 10) : 0;
  const poster = tmdbImage(movie?.poster_path, "w500");
  const overview = movie?.overview?.slice(0, 160) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0b0e14 0%, #12161f 100%)",
          padding: 64,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            width={300}
            height={450}
            style={{ borderRadius: 16, marginRight: 48, objectFit: "cover" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 999,
                border: `4px solid ${rating >= 70 ? "#21d07a" : rating >= 40 ? "#d2d531" : "#db2360"}`,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                marginRight: 20,
              }}
            >
              {rating}%
            </div>
            <div style={{ fontSize: 24, opacity: 0.7 }}>{year}</div>
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 24, opacity: 0.8, lineHeight: 1.4 }}>{overview}</div>
          <div style={{ display: "flex", fontSize: 22, opacity: 0.5, marginTop: 32 }}>CineFind</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
