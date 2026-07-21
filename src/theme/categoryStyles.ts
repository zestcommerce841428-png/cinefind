import type { ThemePreset } from "./presets";

export type ElevationStyle = "flat" | "soft" | "glow";
export type Density = "compact" | "comfortable" | "spacious";

export interface CategoryStyle {
  headingFontFamily: string;
  bodyFontFamily: string;
  radius: number;
  spacingUnit: number; // px per MUI spacing() unit, default 8
  density: Density;
  elevation: ElevationStyle;
  headingLetterSpacing: string;
  headingTransform?: "none" | "uppercase";
}

const SANS = 'var(--font-inter), Roboto, Arial, sans-serif';
const MONO = 'var(--font-mono), "Roboto Mono", ui-monospace, monospace';
const SERIF = 'var(--font-serif), Georgia, "Times New Roman", serif';
const DISPLAY = 'var(--font-display), Impact, "Arial Narrow", sans-serif';
const MODERN = 'var(--font-modern), Inter, Roboto, sans-serif';

export const CATEGORY_STYLES: Record<ThemePreset["category"], CategoryStyle> = {
  classic: {
    headingFontFamily: SANS,
    bodyFontFamily: SANS,
    radius: 12,
    spacingUnit: 8,
    density: "comfortable",
    elevation: "soft",
    headingLetterSpacing: "normal",
  },
  vibrant: {
    headingFontFamily: MODERN,
    bodyFontFamily: SANS,
    radius: 20,
    spacingUnit: 8,
    density: "comfortable",
    elevation: "glow",
    headingLetterSpacing: "-0.01em",
  },
  pastel: {
    headingFontFamily: SANS,
    bodyFontFamily: SANS,
    radius: 22,
    spacingUnit: 9,
    density: "spacious",
    elevation: "soft",
    headingLetterSpacing: "normal",
  },
  dark: {
    headingFontFamily: MONO,
    bodyFontFamily: SANS,
    radius: 8,
    spacingUnit: 7,
    density: "compact",
    elevation: "flat",
    headingLetterSpacing: "-0.02em",
  },
  nature: {
    headingFontFamily: SERIF,
    bodyFontFamily: SANS,
    radius: 14,
    spacingUnit: 9,
    density: "spacious",
    elevation: "soft",
    headingLetterSpacing: "normal",
  },
  cinema: {
    headingFontFamily: DISPLAY,
    bodyFontFamily: SANS,
    radius: 6,
    spacingUnit: 8,
    density: "comfortable",
    elevation: "glow",
    headingLetterSpacing: "0.04em",
    headingTransform: "uppercase",
  },
  mono: {
    headingFontFamily: SANS,
    bodyFontFamily: SANS,
    radius: 4,
    spacingUnit: 7,
    density: "compact",
    elevation: "flat",
    headingLetterSpacing: "normal",
  },
  brand: {
    headingFontFamily: MODERN,
    bodyFontFamily: SANS,
    radius: 24,
    spacingUnit: 8,
    density: "comfortable",
    elevation: "glow",
    headingLetterSpacing: "-0.015em",
  },
};

export function getCategoryStyle(category: ThemePreset["category"]): CategoryStyle {
  return CATEGORY_STYLES[category];
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
