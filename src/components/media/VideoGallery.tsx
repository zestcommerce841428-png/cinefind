"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import type { Video } from "@/lib/tmdb/types";

const CATEGORY_ORDER = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes", "Bloopers"] as const;

function categoryLabel(type: string) {
  return type === "Featurette" ? "Featurettes" : `${type}s`;
}

export default function VideoGallery({ videos, seeAllHref }: { videos: Video[]; seeAllHref?: string }) {
  const [active, setActive] = React.useState<Video | null>(null);
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  const categories = CATEGORY_ORDER.filter((type) => youtubeVideos.some((v) => v.type === type));
  const otherVideos = youtubeVideos.filter((v) => !CATEGORY_ORDER.includes(v.type as (typeof CATEGORY_ORDER)[number]));
  if (otherVideos.length > 0) categories.push("Other" as (typeof CATEGORY_ORDER)[number]);

  const [tab, setTab] = React.useState<string>(categories[0] ?? "");

  if (!youtubeVideos.length) return null;

  const activeVideos = (tab === "Other" ? otherVideos : youtubeVideos.filter((v) => v.type === tab)).slice(0, 8);

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Videos &amp; Clips
        </Typography>
        {seeAllHref && (
          <Button component={Link} href={seeAllHref} size="small">
            See all
          </Button>
        )}
      </Stack>

      {categories.length > 1 && (
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, minHeight: 36 }}
        >
          {categories.map((cat) => (
            <Tab key={cat} value={cat} label={categoryLabel(cat)} sx={{ minHeight: 36, py: 0.5 }} />
          ))}
        </Tabs>
      )}

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {activeVideos.map((video) => (
          <Box
            key={video.id}
            onClick={() => setActive(video)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${video.name}`}
            onKeyDown={(e) => e.key === "Enter" && setActive(video)}
            sx={{
              flex: "0 0 auto",
              width: 260,
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "action.hover",
            }}
          >
            <Image
              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
              alt={video.name}
              fill
              sizes="260px"
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.35)",
              }}
            >
              <PlayCircleIcon sx={{ fontSize: 48, color: "#fff" }} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 8,
                right: 8,
                color: "#fff",
                fontWeight: 600,
              }}
              noWrap
            >
              {video.name}
            </Typography>
          </Box>
        ))}
      </Box>

      <Dialog open={!!active} onClose={() => setActive(null)} maxWidth="md" fullWidth>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setActive(null)}
            aria-label="Close video"
            sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
          {active && (
            <Box sx={{ position: "relative", aspectRatio: "16 / 9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${active.key}?autoplay=1`}
                title={active.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
