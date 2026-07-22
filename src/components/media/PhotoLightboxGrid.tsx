"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "@/components/common/NextLink";

interface Photo {
  id: number;
  title: string;
  backdropPath: string;
  href: string;
}

export default function PhotoLightboxGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = React.useState<Photo | null>(null);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {photos.map((photo) => (
          <Box
            key={photo.id}
            onClick={() => setActive(photo)}
            role="button"
            tabIndex={0}
            aria-label={`View wallpaper for ${photo.title}`}
            onKeyDown={(e) => e.key === "Enter" && setActive(photo)}
            sx={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              bgcolor: "action.hover",
            }}
          >
            <Image src={photo.backdropPath} alt={photo.title} fill sizes="300px" style={{ objectFit: "cover" }} />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                p: 1,
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)",
              }}
            >
              <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }} noWrap>
                {photo.title}
              </Typography>
            </Box>
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
            <>
              <Box sx={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
                <Image src={active.backdropPath} alt={active.title} fill style={{ objectFit: "contain" }} />
              </Box>
              <Box sx={{ p: 2 }}>
                <Link href={active.href}>View {active.title}</Link>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}
