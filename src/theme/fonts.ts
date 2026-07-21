import { Roboto_Mono, Playfair_Display, Bebas_Neue, Space_Grotesk } from "next/font/google";

// Loaded once at module scope (required by Next.js font optimization) and exposed
// as CSS custom properties so theme presets can reference them by category —
// this is what gives each preset category a genuinely distinct typographic voice
// instead of only swapping colors.

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "700", "900"],
  display: "swap",
});

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-modern",
  weight: ["500", "700"],
  display: "swap",
});

export const FONT_VARIABLE_CLASS = [
  robotoMono.variable,
  playfairDisplay.variable,
  bebasNeue.variable,
  spaceGrotesk.variable,
].join(" ");
