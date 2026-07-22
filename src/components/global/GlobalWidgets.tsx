"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import ScrollButtons from "./ScrollButtons";
import AccessibilityEffects from "./AccessibilityEffects";
import UnifiedSettingsPanel from "./UnifiedSettingsPanel";
import WebVitals from "./WebVitals";
import CommandPalette from "./CommandPalette";

export default function GlobalWidgets() {
  const [panelOpen, setPanelOpen] = React.useState(false);

  return (
    <>
      <WebVitals />
      <AccessibilityEffects />
      <ScrollButtons />
      <CommandPalette />

      <Box
        data-print-hide
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 24 },
          left: { xs: 16, sm: 24 },
          zIndex: (t) => t.zIndex.speedDial,
        }}
      >
        <Tooltip title="Accessibility & Style Panel" placement="right">
          <Fab
            color="primary"
            onClick={() => setPanelOpen(true)}
            aria-label="Open accessibility and style panel"
            sx={{
              transition: "transform 0.2s ease",
              "&:hover": { transform: "rotate(45deg) scale(1.05)" },
            }}
          >
            <SettingsIcon />
          </Fab>
        </Tooltip>
      </Box>

      <UnifiedSettingsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
