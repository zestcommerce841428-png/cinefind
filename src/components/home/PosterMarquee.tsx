import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary } from "@/lib/tmdb/types";

export default function PosterMarquee({ posters }: { posters: MovieSummary[] }) {
  if (posters.length === 0) return null;

  const track = [...posters, ...posters];

  return (
    <Box
      sx={{
        overflow: "hidden",
        py: 2.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "max-content",
          animation: "cinefind-marquee 60s linear infinite",
          "@keyframes cinefind-marquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          "&:hover": { animationPlayState: "paused" },
        }}
      >
        {track.map((m, i) => {
          const poster = tmdbImage(m.poster_path, "w185");
          return (
            <Box
              key={`${m.id}-${i}`}
              component={Link}
              href={`/movie/${m.id}`}
              sx={{
                position: "relative",
                width: 92,
                aspectRatio: "2 / 3",
                borderRadius: 1.5,
                overflow: "hidden",
                flexShrink: 0,
                opacity: 0.85,
                transition: "opacity 0.15s ease, transform 0.15s ease",
                "&:hover": { opacity: 1, transform: "scale(1.04)" },
              }}
            >
              {poster && <Image src={poster} alt={m.title} fill sizes="92px" style={{ objectFit: "cover" }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
