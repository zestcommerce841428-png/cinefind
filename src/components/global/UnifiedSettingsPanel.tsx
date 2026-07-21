"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputBase from "@mui/material/InputBase";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useColorScheme } from "@mui/material/styles";
import FullPageReader from "./FullPageReader";
import { THEME_PRESETS, THEME_CATEGORIES, type ThemePreset } from "@/theme/presets";
import {
  useAppSettings,
  A11Y_PROFILES,
  type AccessibilitySettings,
} from "@/theme/AppSettingsContext";

/* ---------- shared control rows ---------- */

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        py: 0.75,
        px: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: checked ? "primary.main" : "divider",
        bgcolor: checked ? "action.selected" : "transparent",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        slotProps={{ input: { "aria-label": label } }}
        size="small"
      />
    </Stack>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
          {format ? format(value) : value}
        </Typography>
      </Stack>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, v) => onChange(v as number)}
        size="small"
        aria-label={label}
      />
    </Box>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ display: "block", fontWeight: 800, letterSpacing: 1, color: "text.secondary", mt: 1 }}
    >
      {children}
    </Typography>
  );
}

/* ---------- theme preset card (reference style) ---------- */

function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: ThemePreset;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={`Apply theme ${preset.name}`}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      sx={{
        position: "relative",
        borderRadius: 2.5,
        px: 1.75,
        py: 1.5,
        cursor: "pointer",
        bgcolor: preset.darkPaper,
        border: "2px solid",
        borderColor: selected ? preset.primary : "transparent",
        outlineOffset: 2,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
      }}
    >
      <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
        {preset.name}
      </Typography>
      <Stack direction="row" sx={{ gap: 0.75, alignItems: "center" }}>
        <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: preset.primary }} />
        <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: preset.secondary }} />
      </Stack>
      {selected && (
        <CheckCircleIcon
          sx={{ position: "absolute", top: 8, right: 8, fontSize: 18, color: preset.primary }}
        />
      )}
    </Box>
  );
}

/* ---------- tab panels ---------- */

function ThemeEngineTab() {
  const { themePresetId, setThemePresetId, a11y, setA11y } = useAppSettings();
  const { mode, setMode } = useColorScheme();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const filtered = THEME_PRESETS.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Stack spacing={2}>
      <Box>
        <SectionLabel>Core Mode Toggler</SectionLabel>
        <Button
          fullWidth
          variant="contained"
          startIcon={mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          disabled={a11y.autoThemeByTime}
          sx={{ borderRadius: 2.5, py: 1.25, fontWeight: 700 }}
        >
          {mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
        <Box sx={{ mt: 1.5 }}>
          <ToggleRow
            label="Auto dark/light by time of day"
            hint="Dark from 7pm–7am, light the rest of the day — re-checked every 5 min"
            checked={a11y.autoThemeByTime}
            onChange={(v) => setA11y({ autoThemeByTime: v })}
          />
        </Box>
      </Box>

      <Box>
        <SectionLabel>Select Theme Preset ({THEME_PRESETS.length} available)</SectionLabel>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            my: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SearchIcon fontSize="small" />
          <InputBase
            placeholder="Search presets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            inputProps={{ "aria-label": "Search theme presets" }}
          />
        </Box>

        <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", mb: 1.5 }}>
          <Chip
            label="All"
            size="small"
            color={category === "all" ? "primary" : "default"}
            onClick={() => setCategory("all")}
          />
          {THEME_CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              size="small"
              color={category === c.id ? "primary" : "default"}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.25 }}>
          {filtered.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={themePresetId === preset.id}
              onSelect={() => setThemePresetId(preset.id)}
            />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No presets match &ldquo;{search}&rdquo;.
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function TextTab() {
  const { a11y, setA11y } = useAppSettings();
  function set<K extends keyof AccessibilitySettings>(key: K) {
    return (value: AccessibilitySettings[K]) => setA11y({ [key]: value });
  }

  return (
    <Stack spacing={1.25}>
      <SectionLabel>Typography Scale</SectionLabel>
      <SliderRow label="Text size" value={a11y.fontScale} min={0.85} max={1.6} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={set("fontScale")} />
      <SliderRow label="Line height" value={a11y.lineHeightScale} min={1} max={1.8} step={0.1} format={(v) => `${v.toFixed(1)}×`} onChange={set("lineHeightScale")} />
      <SliderRow label="Letter spacing" value={a11y.letterSpacing} min={0} max={3} step={0.5} format={(v) => `${v}px`} onChange={set("letterSpacing")} />
      <SliderRow label="Word spacing" value={a11y.wordSpacing} min={0} max={8} step={1} format={(v) => `${v}px`} onChange={set("wordSpacing")} />

      <SectionLabel>Reading Aids</SectionLabel>
      <ToggleRow label="Dyslexia-friendly font" checked={a11y.dyslexiaFont} onChange={set("dyslexiaFont")} />
      <ToggleRow label="Reading mask" hint="Dims everything except the line under your cursor" checked={a11y.readingMask} onChange={set("readingMask")} />
      <ToggleRow label="Reading guide" hint="A guide bar follows your cursor" checked={a11y.readingGuide} onChange={set("readingGuide")} />
      <ToggleRow label="Narrow reading column" checked={a11y.columnWidth === "narrow"} onChange={(v) => setA11y({ columnWidth: v ? "narrow" : "default" })} />

      <SectionLabel>Alignment</SectionLabel>
      <ToggleButtonGroup
        value={a11y.textAlign}
        exclusive
        fullWidth
        size="small"
        onChange={(_, v) => v && setA11y({ textAlign: v })}
      >
        <ToggleButton value="default">Default</ToggleButton>
        <ToggleButton value="left">Left</ToggleButton>
        <ToggleButton value="center">Center</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}

function VisualsTab() {
  const { a11y, setA11y } = useAppSettings();
  function set<K extends keyof AccessibilitySettings>(key: K) {
    return (value: AccessibilitySettings[K]) => setA11y({ [key]: value });
  }

  return (
    <Stack spacing={1.25}>
      <SectionLabel>Color Vision Deficiency Support</SectionLabel>
      <Typography variant="caption" color="text.secondary">
        Applies a real feColorMatrix simulation/correction filter across the whole page.
      </Typography>
      <ToggleButtonGroup
        value={a11y.colorVisionMode}
        exclusive
        fullWidth
        size="small"
        onChange={(_, v) => v && setA11y({ colorVisionMode: v })}
        sx={{ flexWrap: "wrap" }}
      >
        <ToggleButton value="none">None</ToggleButton>
        <ToggleButton value="protanopia">Protanopia</ToggleButton>
        <ToggleButton value="deuteranopia">Deuteranopia</ToggleButton>
        <ToggleButton value="tritanopia">Tritanopia</ToggleButton>
        <ToggleButton value="achromatopsia">Achromatopsia</ToggleButton>
      </ToggleButtonGroup>

      <SectionLabel>Color Filters</SectionLabel>
      <ToggleRow label="High contrast text" checked={a11y.highContrast} onChange={set("highContrast")} />
      <ToggleRow label="Invert colors" checked={a11y.invertColors} onChange={set("invertColors")} />
      <ToggleRow label="Grayscale" checked={a11y.grayscale} onChange={set("grayscale")} />
      <ToggleRow label="Sepia tint" checked={a11y.sepia} onChange={set("sepia")} />

      <SectionLabel>Fine Tuning</SectionLabel>
      <SliderRow label="Saturation" value={a11y.saturation} min={0} max={200} step={10} format={(v) => `${v}%`} onChange={set("saturation")} />
      <SliderRow label="Brightness" value={a11y.brightness} min={50} max={150} step={5} format={(v) => `${v}%`} onChange={set("brightness")} />
      <SliderRow label="Contrast" value={a11y.contrast} min={50} max={200} step={10} format={(v) => `${v}%`} onChange={set("contrast")} />

      <SectionLabel>Content</SectionLabel>
      <ToggleRow label="Hide images & videos" checked={a11y.hideImages} onChange={set("hideImages")} />
      <ToggleRow label="Underline all links" checked={a11y.underlineLinks} onChange={set("underlineLinks")} />
      <ToggleRow label="Highlight links" checked={a11y.highlightLinks} onChange={set("highlightLinks")} />
      <ToggleRow label="Highlight headings" checked={a11y.highlightHeadings} onChange={set("highlightHeadings")} />
    </Stack>
  );
}

function InteractionTab() {
  const { a11y, setA11y } = useAppSettings();
  const [speaking, setSpeaking] = React.useState(false);
  function set<K extends keyof AccessibilitySettings>(key: K) {
    return (value: AccessibilitySettings[K]) => setA11y({ [key]: value });
  }

  function speakSelection() {
    const text = window.getSelection()?.toString() || document.title;
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  return (
    <Stack spacing={1.25}>
      <SectionLabel>Layout</SectionLabel>
      <ToggleRow
        label="Focus mode"
        hint="Hides the navbar and footer and narrows the page to a single reading column"
        checked={a11y.focusMode}
        onChange={set("focusMode")}
      />

      <SectionLabel>Motion</SectionLabel>
      <ToggleRow label="Reduce motion & animations" checked={a11y.reduceMotion} onChange={set("reduceMotion")} />
      <ToggleRow label="Pause auto-playing carousels" checked={a11y.pauseCarousels} onChange={set("pauseCarousels")} />

      <SectionLabel>Pointer & Keyboard</SectionLabel>
      <ToggleRow label="Large click targets" hint="Minimum 44×44px touch areas" checked={a11y.bigClickTargets} onChange={set("bigClickTargets")} />
      <ToggleRow label="Big cursor" checked={a11y.bigCursor} onChange={set("bigCursor")} />
      <ToggleRow label="Strong keyboard focus ring" checked={a11y.keyboardFocusRing} onChange={set("keyboardFocusRing")} />

      <SectionLabel>Sound & Speech</SectionLabel>
      <ToggleRow label="Mute all media" checked={a11y.muteMedia} onChange={set("muteMedia")} />
      <FullPageReader />
      <Button
        variant="outlined"
        startIcon={speaking ? <StopCircleIcon /> : <RecordVoiceOverIcon />}
        onClick={speaking ? stopSpeaking : speakSelection}
        sx={{ borderRadius: 2.5 }}
      >
        {speaking ? "Stop Reading" : "Read Selected Text Aloud"}
      </Button>
    </Stack>
  );
}

function ProfilesTab() {
  const { applyProfile, resetA11y } = useAppSettings();

  return (
    <Stack spacing={1.25}>
      <SectionLabel>One-Click Profiles</SectionLabel>
      <Typography variant="caption" color="text.secondary">
        Each profile applies a curated bundle of settings. You can fine-tune afterwards in the
        other tabs.
      </Typography>
      {A11Y_PROFILES.map((profile) => (
        <Box
          key={profile.id}
          role="button"
          tabIndex={0}
          onClick={() => applyProfile(profile.id)}
          onKeyDown={(e) => e.key === "Enter" && applyProfile(profile.id)}
          sx={{
            px: 1.75,
            py: 1.25,
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "divider",
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {profile.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {profile.description}
          </Typography>
        </Box>
      ))}
      <Button variant="outlined" color="inherit" startIcon={<RestartAltIcon />} onClick={resetA11y} sx={{ borderRadius: 2.5 }}>
        Clear Active Profile
      </Button>
    </Stack>
  );
}

/* ---------- main panel ---------- */

const TABS = [
  { id: "theme", label: "Theme Engine" },
  { id: "text", label: "Text" },
  { id: "visuals", label: "Visuals" },
  { id: "interaction", label: "Interaction" },
  { id: "profiles", label: "Profiles" },
] as const;

export default function UnifiedSettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>("theme");
  const { resetA11y, setThemePresetId } = useAppSettings();
  const { setMode } = useColorScheme();

  function resetAll() {
    resetA11y();
    setThemePresetId("default");
    setMode("dark");
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 420 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="dialog"
        aria-label="Accessibility and style panel"
      >
        <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Accessibility &amp; Style Panel
            </Typography>
            <IconButton onClick={onClose} aria-label="Close settings panel">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ px: 1, borderBottom: "1px solid", borderColor: "divider" }}
        >
          {TABS.map((t) => (
            <Tab key={t.id} value={t.id} label={t.label} sx={{ fontWeight: 700 }} />
          ))}
        </Tabs>

        <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
          {tab === "theme" && <ThemeEngineTab />}
          {tab === "text" && <TextTab />}
          {tab === "visuals" && <VisualsTab />}
          {tab === "interaction" && <InteractionTab />}
          {tab === "profiles" && <ProfilesTab />}
        </Box>

        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={resetAll}
            sx={{ borderRadius: 2.5, fontWeight: 700 }}
          >
            Reset All Preferences
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
