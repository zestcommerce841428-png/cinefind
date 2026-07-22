"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SHORTCUTS = [
  { keys: ["/"], label: "Focus the search bar" },
  { keys: ["⌘", "K"], label: "Open the command palette (search + jump to any page)" },
  { keys: ["Esc"], label: "Close any open dialog or the command palette" },
  { keys: ["?"], label: "Show this shortcuts list" },
];

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export default function KeyboardShortcutsDialog() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Keyboard Shortcuts
        <IconButton onClick={() => setOpen(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ pb: 2 }}>
          {SHORTCUTS.map((s) => (
            <Stack key={s.label} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Stack direction="row" spacing={0.5} sx={{ minWidth: 72 }}>
                {s.keys.map((k) => (
                  <Chip key={k} label={k} size="small" sx={{ fontFamily: "var(--font-mono)", fontWeight: 700 }} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
