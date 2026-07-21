"use client";

import * as React from "react";
import { useColorScheme } from "@mui/material/styles";
import { useAppSettings } from "@/theme/AppSettingsContext";

export default function AccessibilityEffects() {
  const { a11y } = useAppSettings();
  const { mode, setMode } = useColorScheme();
  const [mouseY, setMouseY] = React.useState(0);

  // Real time-of-day automation: dark 19:00-06:59, light 07:00-18:59, re-checked every 5 min.
  const modeRef = React.useRef(mode);
  React.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  React.useEffect(() => {
    if (!a11y.autoThemeByTime) return;
    function apply() {
      const hour = new Date().getHours();
      const next = hour >= 19 || hour < 7 ? "dark" : "light";
      if (modeRef.current !== next) setMode(next);
    }
    apply();
    const interval = setInterval(apply, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [a11y.autoThemeByTime, setMode]);

  const needsMouse = a11y.readingMask || a11y.readingGuide;
  React.useEffect(() => {
    if (!needsMouse) return;
    function onMove(e: MouseEvent) {
      setMouseY(e.clientY);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [needsMouse]);

  React.useEffect(() => {
    if (!a11y.muteMedia) return;
    function muteAll() {
      document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((el) => {
        el.muted = true;
      });
    }
    muteAll();
    const observer = new MutationObserver(muteAll);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [a11y.muteMedia]);

  const filters: string[] = [];
  if (a11y.colorVisionMode !== "none") filters.push(`url(#a11y-${a11y.colorVisionMode})`);
  if (a11y.invertColors) filters.push("invert(1) hue-rotate(180deg)");
  if (a11y.grayscale) filters.push("grayscale(1)");
  if (a11y.sepia) filters.push("sepia(0.6)");
  if (a11y.saturation !== 100) filters.push(`saturate(${a11y.saturation}%)`);
  if (a11y.brightness !== 100) filters.push(`brightness(${a11y.brightness}%)`);
  if (a11y.contrast !== 100) filters.push(`contrast(${a11y.contrast}%)`);

  const css = `
    html {
      font-size: ${a11y.fontScale * 100}%;
      ${filters.length ? `filter: ${filters.join(" ")};` : ""}
    }
    ${a11y.lineHeightScale !== 1 ? `body, body p, body li { line-height: ${1.5 * a11y.lineHeightScale} !important; }` : ""}
    ${a11y.letterSpacing > 0 ? `body { letter-spacing: ${a11y.letterSpacing}px !important; }` : ""}
    ${a11y.wordSpacing > 0 ? `body { word-spacing: ${a11y.wordSpacing}px !important; }` : ""}
    ${
      a11y.dyslexiaFont
        ? `body, body * { font-family: "Comic Sans MS", "Trebuchet MS", Verdana, sans-serif !important; }`
        : ""
    }
    ${
      a11y.highContrast
        ? `body { --mui-palette-text-secondary: var(--mui-palette-text-primary) !important; }
           body a, body p, body span, body h1, body h2, body h3, body h4, body h5, body h6 { opacity: 1 !important; }`
        : ""
    }
    ${a11y.hideImages ? `img, video, iframe { visibility: hidden !important; }` : ""}
    ${a11y.underlineLinks ? `a { text-decoration: underline !important; }` : ""}
    ${
      a11y.highlightLinks
        ? `a { background: rgba(255, 235, 59, 0.35) !important; outline: 1px solid rgba(255,193,7,0.8); border-radius: 2px; }`
        : ""
    }
    ${
      a11y.highlightHeadings
        ? `h1, h2, h3, h4, h5, h6, .MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3, .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6 { background: rgba(3,169,244,0.18) !important; border-radius: 4px; padding: 0 4px; }`
        : ""
    }
    ${
      a11y.bigCursor
        ? `body, body * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M4 2l16 11h-8l4 8-3 1.5L9 14l-5 5z'/%3E%3C/svg%3E") 4 2, auto !important; }`
        : ""
    }
    ${
      a11y.reduceMotion
        ? `*, *::before, *::after { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; transition-duration: 0.001s !important; scroll-behavior: auto !important; }`
        : ""
    }
    ${
      a11y.bigClickTargets
        ? `button, a, [role="button"], .MuiIconButton-root, .MuiChip-root { min-height: 44px !important; min-width: 44px !important; }`
        : ""
    }
    ${
      a11y.keyboardFocusRing
        ? `:focus-visible { outline: 3px solid #ff9800 !important; outline-offset: 3px !important; }`
        : ""
    }
    ${a11y.textAlign === "left" ? `body p, body h1, body h2, body h3, body li { text-align: left !important; }` : ""}
    ${a11y.textAlign === "center" ? `body p, body h1, body h2, body h3 { text-align: center !important; }` : ""}
    ${a11y.columnWidth === "narrow" ? `main p { max-width: 60ch !important; }` : ""}
    ${
      a11y.focusMode
        ? `header, footer { display: none !important; }
           main { max-width: 900px !important; margin-left: auto !important; margin-right: auto !important; }`
        : ""
    }
  `;

  return (
    <>
      {/* Color-vision-deficiency simulation/correction filters (real feColorMatrix transforms, not a CSS approximation) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="a11y-protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0     0 0
                      0.558 0.442 0     0 0
                      0     0.242 0.758 0 0
                      0     0     0     1 0"
            />
          </filter>
          <filter id="a11y-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0   0 0
                      0.7   0.3   0   0 0
                      0     0.3   0.7 0 0
                      0     0     0   1 0"
            />
          </filter>
          <filter id="a11y-tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95  0.05  0     0 0
                      0     0.433 0.567 0 0
                      0     0.475 0.525 0 0
                      0     0     0     1 0"
            />
          </filter>
          <filter id="a11y-achromatopsia">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0.299 0.587 0.114 0 0
                      0     0     0     1 0"
            />
          </filter>
        </defs>
      </svg>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {a11y.readingMask && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1900,
            pointerEvents: "none",
            background: `linear-gradient(to bottom,
              rgba(0,0,0,0.6) 0,
              rgba(0,0,0,0.6) ${Math.max(mouseY - 60, 0)}px,
              transparent ${Math.max(mouseY - 60, 0)}px,
              transparent ${mouseY + 60}px,
              rgba(0,0,0,0.6) ${mouseY + 60}px)`,
          }}
        />
      )}
      {a11y.readingGuide && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: mouseY + 12,
            height: 8,
            zIndex: 1900,
            pointerEvents: "none",
            background: "rgba(255,193,7,0.85)",
            borderRadius: 4,
            boxShadow: "0 0 8px rgba(0,0,0,0.4)",
          }}
        />
      )}
    </>
  );
}
