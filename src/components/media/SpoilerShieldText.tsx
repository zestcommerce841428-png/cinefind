"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SPOILER_PATTERN = /spoiler/i;

export default function SpoilerShieldText({ content }: { content: string }) {
  const flagged = SPOILER_PATTERN.test(content);
  const [revealed, setRevealed] = React.useState(!flagged);

  return (
    <Box sx={{ position: "relative" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          filter: revealed ? "none" : "blur(6px)",
          userSelect: revealed ? "auto" : "none",
          transition: "filter 0.2s ease",
        }}
      >
        {content}
      </Typography>
      {!revealed && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="warning"
            startIcon={<VisibilityOffIcon />}
            onClick={() => setRevealed(true)}
          >
            Possible spoiler — reveal review
          </Button>
        </Box>
      )}
    </Box>
  );
}
