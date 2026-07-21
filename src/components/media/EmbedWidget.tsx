"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function EmbedWidget({ mediaType, id }: { mediaType: "movie" | "tv"; id: number }) {
  const [copied, setCopied] = React.useState(false);
  const snippet = `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/widget/${mediaType}/${id}" width="360" height="90" frameborder="0" style="border:none;"></iframe>`;

  function copy() {
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Box component="section">
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Embed
      </Typography>
      <Box
        component="pre"
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "action.hover",
          fontSize: 11,
          overflowX: "auto",
          mb: 1,
        }}
      >
        {snippet}
      </Box>
      <Button size="small" startIcon={<ContentCopyIcon />} onClick={copy} variant="outlined">
        {copied ? "Copied!" : "Copy embed code"}
      </Button>
    </Box>
  );
}
