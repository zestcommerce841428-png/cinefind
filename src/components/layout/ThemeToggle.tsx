"use client";

import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorScheme } from "@mui/material/styles";

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      aria-label="Toggle light and dark theme"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
