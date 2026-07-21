import Link from "@/components/common/NextLink";
import Image from "next/image";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tmdbImage } from "@/lib/tmdb/config";
import RatingBadge from "./RatingBadge";

export interface MediaCardProps {
  id: number;
  title: string;
  subtitle?: string;
  posterPath: string | null;
  voteAverage?: number;
  mediaType: "movie" | "tv" | "person";
  priority?: boolean;
}

export default function MediaCard({
  id,
  title,
  subtitle,
  posterPath,
  voteAverage,
  mediaType,
  priority = false,
}: MediaCardProps) {
  const href = `/${mediaType}/${id}`;
  const poster = tmdbImage(posterPath, "w342");

  return (
    <Card
      component={Link}
      href={href}
      elevation={0}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
      }}
    >
      <Box sx={{ position: "relative", aspectRatio: "2 / 3", bgcolor: "action.hover" }}>
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 600px) 45vw, (max-width: 960px) 30vw, 200px"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              px: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="caption">{title}</Typography>
          </Box>
        )}
        {typeof voteAverage === "number" && (
          <Box sx={{ position: "absolute", left: 8, bottom: -20 }}>
            <RatingBadge voteAverage={voteAverage} />
          </Box>
        )}
      </Box>
      <Box sx={{ pt: 3, pb: 1.5, px: 1.5 }}>
        <Typography variant="body2" noWrap title={title} sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
