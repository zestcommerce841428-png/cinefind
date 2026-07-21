"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EmotionRegistry from "./EmotionRegistry";
import { AppSettingsProvider, useAppSettings } from "./AppSettingsContext";
import { getPreset } from "./presets";
import { getCategoryStyle, hexToRgba } from "./categoryStyles";

function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { themePresetId } = useAppSettings();
  const preset = getPreset(themePresetId);
  const style = getCategoryStyle(preset.category);

  const theme = React.useMemo(() => {
    const glow = style.elevation === "glow";
    const flat = style.elevation === "flat";
    const glowShadow = `0 0 0 1px ${hexToRgba(preset.primary, 0.25)}, 0 8px 28px ${hexToRgba(preset.primary, 0.28)}`;

    return createTheme({
      colorSchemes: {
        light: {
          palette: {
            primary: { main: preset.primary },
            secondary: { main: preset.secondary },
            background: { default: preset.lightBg, paper: preset.lightPaper },
          },
        },
        dark: {
          palette: {
            primary: { main: preset.primary },
            secondary: { main: preset.secondary },
            background: { default: preset.darkBg, paper: preset.darkPaper },
          },
        },
      },
      cssVariables: { colorSchemeSelector: "class" },
      shape: { borderRadius: style.radius },
      spacing: style.spacingUnit,
      typography: {
        fontFamily: style.bodyFontFamily,
        h1: {
          fontWeight: 800,
          fontFamily: style.headingFontFamily,
          letterSpacing: style.headingLetterSpacing,
          textTransform: style.headingTransform,
        },
        h2: {
          fontWeight: 800,
          fontFamily: style.headingFontFamily,
          letterSpacing: style.headingLetterSpacing,
          textTransform: style.headingTransform,
        },
        h3: {
          fontWeight: 700,
          fontFamily: style.headingFontFamily,
          letterSpacing: style.headingLetterSpacing,
          textTransform: style.headingTransform,
        },
        h4: {
          fontWeight: 700,
          fontFamily: style.headingFontFamily,
          letterSpacing: style.headingLetterSpacing,
          textTransform: style.headingTransform,
        },
        h5: { fontWeight: 700, fontFamily: style.headingFontFamily },
        h6: { fontWeight: 700, fontFamily: style.headingFontFamily },
        button: { textTransform: "none", fontWeight: 600 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: style.radius >= 16 ? 999 : style.radius,
              transition: "transform 0.15s ease, box-shadow 0.2s ease",
            },
            contained: glow
              ? {
                  boxShadow: "none",
                  "&:hover": { boxShadow: glowShadow, transform: "translateY(-1px)" },
                }
              : undefined,
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              ...(flat
                ? { boxShadow: "none", border: "1px solid var(--mui-palette-divider)" }
                : {}),
              ...(glow
                ? { transition: "box-shadow 0.2s ease, transform 0.2s ease" }
                : {}),
            },
          },
        },
        MuiAppBar: { styleOverrides: { root: { backgroundImage: "none" } } },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: style.radius >= 16 ? 999 : Math.max(style.radius - 2, 4) },
          },
        },
      },
    });
  }, [preset, style]);

  return (
    <ThemeProvider theme={theme} defaultMode="dark" noSsr>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <AppSettingsProvider>
        <DynamicThemeProvider>{children}</DynamicThemeProvider>
      </AppSettingsProvider>
    </EmotionRegistry>
  );
}
