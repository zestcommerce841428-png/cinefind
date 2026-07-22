"use client";

import * as React from "react";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary } from "@/lib/tmdb/types";
import { useAppSettings } from "@/theme/AppSettingsContext";
import TrailerPlayButton from "./TrailerPlayButton";

export default function HeroCarousel({ items }: { items: MovieSummary[] }) {
  const [index, setIndex] = React.useState(0);
  const slides = items.slice(0, 6);
  const { a11y } = useAppSettings();
  const paused = a11y.pauseCarousels || a11y.reduceMotion;

  React.useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const current = slides[index];
  const backdrop = tmdbImage(current.backdrop_path, "original");

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 380, md: 520 },
        borderRadius: { xs: 0, md: 4 },
        overflow: "hidden",
        mb: 5,
      }}
    >
      {backdrop && (
        <Image
          key={current.id}
          src={backdrop}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2) 60%), linear-gradient(to right, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Box sx={{ pointerEvents: "auto", position: "relative" }}>
          <TrailerPlayButton mediaType="movie" mediaId={current.id} size={80} />
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          p: { xs: 3, md: 6 },
          maxWidth: 640,
          color: "#fff",
        }}
      >
        <Chip label="Trending Now" size="small" color="secondary" sx={{ mb: 1.5, fontWeight: 700 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 42 } }} gutterBottom>
          {current.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.85,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {current.overview}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            href={`/movie/${current.id}`}
            variant="contained"
            startIcon={<PlayArrowIcon />}
          >
            View Details
          </Button>
          <Button
            component={Link}
            href={`/movie/${current.id}#overview`}
            variant="outlined"
            color="inherit"
            startIcon={<InfoOutlinedIcon />}
          >
            More Info
          </Button>
        </Stack>
      </Box>

      {slides.length > 1 && (
        <>
          <IconButton
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#fff" }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#fff" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
          <Stack direction="row" spacing={1} sx={{ position: "absolute", bottom: 12, right: 16 }}>
            {slides.map((s, i) => (
              <Box
                key={s.id}
                onClick={() => setIndex(i)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: i === index ? "secondary.main" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
