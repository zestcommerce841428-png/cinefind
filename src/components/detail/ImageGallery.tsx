"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { tmdbImage } from "@/lib/tmdb/config";
import type { Image as TmdbImage } from "@/lib/tmdb/types";

interface ImageGalleryProps {
  title: string;
  backHref: string;
  backdrops: TmdbImage[];
  posters: TmdbImage[];
  logos?: TmdbImage[];
}

export default function ImageGallery({ title, backHref, backdrops, posters, logos = [] }: ImageGalleryProps) {
  const [tab, setTab] = React.useState<"backdrops" | "posters" | "logos">(
    backdrops.length ? "backdrops" : posters.length ? "posters" : "logos"
  );
  const [active, setActive] = React.useState<string | null>(null);

  const groups = { backdrops, posters, logos };
  const active_images = groups[tab];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Images</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Images
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="backdrops" label={`Backdrops (${backdrops.length})`} disabled={!backdrops.length} />
        <Tab value="posters" label={`Posters (${posters.length})`} disabled={!posters.length} />
        <Tab value="logos" label={`Logos (${logos.length})`} disabled={!logos.length} />
      </Tabs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            tab === "posters" ? "repeat(auto-fill, minmax(160px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {active_images.map((img) => (
          <Box
            key={img.file_path}
            onClick={() => setActive(img.file_path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActive(img.file_path)}
            sx={{
              position: "relative",
              aspectRatio: tab === "posters" ? "2 / 3" : "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "action.hover",
            }}
          >
            <Image
              src={tmdbImage(img.file_path, tab === "posters" ? "w342" : "w780")!}
              alt={title}
              fill
              sizes="(max-width: 600px) 45vw, 300px"
              style={{ objectFit: tab === "logos" ? "contain" : "cover" }}
            />
          </Box>
        ))}
      </Box>

      <Dialog open={!!active} onClose={() => setActive(null)} maxWidth="lg" fullWidth>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setActive(null)}
            aria-label="Close"
            sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, color: "#fff", bgcolor: "rgba(0,0,0,0.4)" }}
          >
            <CloseIcon />
          </IconButton>
          {active && (
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
              <Image src={tmdbImage(active, "original")!} alt={title} fill style={{ objectFit: "contain" }} />
            </Box>
          )}
        </Box>
      </Dialog>
    </Container>
  );
}
