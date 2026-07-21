"use client";

import * as React from "react";

export interface AccessibilitySettings {
  // Vision
  fontScale: number; // 0.85 - 1.6
  lineHeightScale: number; // 1 - 1.8
  letterSpacing: number; // 0 - 3 px
  wordSpacing: number; // 0 - 8 px
  dyslexiaFont: boolean;
  highContrast: boolean;
  invertColors: boolean;
  grayscale: boolean;
  sepia: boolean;
  saturation: number; // 0 - 200 (%)
  brightness: number; // 50 - 150 (%)
  contrast: number; // 50 - 200 (%)
  hideImages: boolean;
  underlineLinks: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  bigCursor: boolean;
  readingMask: boolean;
  readingGuide: boolean;
  // Motion & interaction
  reduceMotion: boolean;
  pauseCarousels: boolean;
  bigClickTargets: boolean;
  keyboardFocusRing: boolean;
  // Content
  textAlign: "default" | "left" | "center";
  columnWidth: "default" | "narrow";
  tooltipsAlways: boolean;
  // Sound
  muteMedia: boolean;
  // Color vision
  colorVisionMode: "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
  // Layout
  focusMode: boolean;
  // Theme automation
  autoThemeByTime: boolean;
}

export const DEFAULT_A11Y: AccessibilitySettings = {
  fontScale: 1,
  lineHeightScale: 1,
  letterSpacing: 0,
  wordSpacing: 0,
  dyslexiaFont: false,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  sepia: false,
  saturation: 100,
  brightness: 100,
  contrast: 100,
  hideImages: false,
  underlineLinks: false,
  highlightLinks: false,
  highlightHeadings: false,
  bigCursor: false,
  readingMask: false,
  readingGuide: false,
  reduceMotion: false,
  pauseCarousels: false,
  bigClickTargets: false,
  keyboardFocusRing: false,
  textAlign: "default",
  columnWidth: "default",
  tooltipsAlways: false,
  muteMedia: false,
  colorVisionMode: "none",
  focusMode: false,
  autoThemeByTime: false,
};

export const A11Y_PROFILES: { id: string; label: string; description: string; settings: Partial<AccessibilitySettings> }[] = [
  {
    id: "low-vision",
    label: "Low Vision",
    description: "Larger text, higher contrast, underlined links",
    settings: { fontScale: 1.3, highContrast: true, underlineLinks: true, bigClickTargets: true, contrast: 130 },
  },
  {
    id: "dyslexia",
    label: "Dyslexia Friendly",
    description: "Readable font, wider spacing, reading guide",
    settings: { dyslexiaFont: true, letterSpacing: 1.5, wordSpacing: 4, lineHeightScale: 1.4, readingGuide: true },
  },
  {
    id: "adhd",
    label: "ADHD Focus",
    description: "Reading mask, paused animations, muted media, distraction-free layout",
    settings: {
      readingMask: true,
      reduceMotion: true,
      pauseCarousels: true,
      muteMedia: true,
      focusMode: true,
    },
  },
  {
    id: "color-vision",
    label: "Color Vision Deficiency",
    description: "Deuteranopia-corrected palette simulation and stronger link cues",
    settings: { colorVisionMode: "deuteranopia", underlineLinks: true, highlightLinks: true },
  },
  {
    id: "motor",
    label: "Motor Impairment",
    description: "Big targets, big cursor, visible focus ring",
    settings: { bigClickTargets: true, bigCursor: true, keyboardFocusRing: true, reduceMotion: true },
  },
  {
    id: "photosensitive",
    label: "Photosensitive",
    description: "No motion, reduced brightness and saturation",
    settings: { reduceMotion: true, pauseCarousels: true, brightness: 80, saturation: 70 },
  },
  {
    id: "senior",
    label: "Senior Friendly",
    description: "Larger everything, simpler visuals",
    settings: { fontScale: 1.25, bigClickTargets: true, underlineLinks: true, lineHeightScale: 1.3, bigCursor: true },
  },
];

interface AppSettings {
  themePresetId: string;
  setThemePresetId: (id: string) => void;
  a11y: AccessibilitySettings;
  setA11y: (update: Partial<AccessibilitySettings>) => void;
  resetA11y: () => void;
  applyProfile: (profileId: string) => void;
  hydrated: boolean;
}

const AppSettingsContext = React.createContext<AppSettings | null>(null);

const THEME_KEY = "cinefind.theme";
const A11Y_KEY = "cinefind.a11y";

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [themePresetId, setThemePresetIdState] = React.useState("default");
  const [a11y, setA11yState] = React.useState<AccessibilitySettings>(DEFAULT_A11Y);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme) setThemePresetIdState(storedTheme);
        const storedA11y = localStorage.getItem(A11Y_KEY);
        if (storedA11y) setA11yState({ ...DEFAULT_A11Y, ...JSON.parse(storedA11y) });
      } catch {
        // ignore corrupted storage
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const setThemePresetId = React.useCallback((id: string) => {
    setThemePresetIdState(id);
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const setA11y = React.useCallback((update: Partial<AccessibilitySettings>) => {
    setA11yState((prev) => {
      const next = { ...prev, ...update };
      try {
        localStorage.setItem(A11Y_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const resetA11y = React.useCallback(() => {
    setA11yState(DEFAULT_A11Y);
    try {
      localStorage.removeItem(A11Y_KEY);
    } catch {
      // ignore
    }
  }, []);

  const applyProfile = React.useCallback(
    (profileId: string) => {
      const profile = A11Y_PROFILES.find((p) => p.id === profileId);
      if (profile) setA11y({ ...DEFAULT_A11Y, ...profile.settings });
    },
    [setA11y]
  );

  const value = React.useMemo(
    () => ({ themePresetId, setThemePresetId, a11y, setA11y, resetA11y, applyProfile, hydrated }),
    [themePresetId, setThemePresetId, a11y, setA11y, resetA11y, applyProfile, hydrated]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = React.useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used inside AppSettingsProvider");
  return ctx;
}
