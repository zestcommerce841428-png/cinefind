export interface ThemePreset {
  id: string;
  name: string;
  category: "classic" | "vibrant" | "pastel" | "dark" | "nature" | "cinema" | "mono" | "brand";
  primary: string;
  secondary: string;
  darkBg: string;
  darkPaper: string;
  lightBg: string;
  lightPaper: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  // Classic
  { id: "default", name: "CineFind Blue", category: "classic", primary: "#0d6efd", secondary: "#f5c518", darkBg: "#0b0e14", darkPaper: "#12161f", lightBg: "#f7f8fa", lightPaper: "#ffffff" },
  { id: "royal-indigo", name: "Royal Indigo", category: "classic", primary: "#3f51b5", secondary: "#ff4081", darkBg: "#0e0f1a", darkPaper: "#171a2b", lightBg: "#f5f6fb", lightPaper: "#ffffff" },
  { id: "crimson", name: "Crimson", category: "classic", primary: "#d32f2f", secondary: "#ffc107", darkBg: "#140b0b", darkPaper: "#1f1212", lightBg: "#fbf5f5", lightPaper: "#ffffff" },
  { id: "emerald", name: "Emerald", category: "classic", primary: "#2e7d32", secondary: "#ffb300", darkBg: "#0b140d", darkPaper: "#122016", lightBg: "#f4faf5", lightPaper: "#ffffff" },
  { id: "amber-gold", name: "Amber Gold", category: "classic", primary: "#ff8f00", secondary: "#3949ab", darkBg: "#14100b", darkPaper: "#201a12", lightBg: "#fdf9f2", lightPaper: "#ffffff" },
  { id: "teal-classic", name: "Teal", category: "classic", primary: "#00897b", secondary: "#ff7043", darkBg: "#0a1413", darkPaper: "#11201e", lightBg: "#f2faf9", lightPaper: "#ffffff" },
  { id: "plum", name: "Plum", category: "classic", primary: "#8e24aa", secondary: "#00bcd4", darkBg: "#120b14", darkPaper: "#1d1220", lightBg: "#f9f4fb", lightPaper: "#ffffff" },
  { id: "steel", name: "Steel Blue", category: "classic", primary: "#546e7a", secondary: "#ffab40", darkBg: "#0d1113", darkPaper: "#161d20", lightBg: "#f5f7f8", lightPaper: "#ffffff" },
  { id: "cobalt", name: "Cobalt", category: "classic", primary: "#1565c0", secondary: "#ffd54f", darkBg: "#0a0f16", darkPaper: "#111a25", lightBg: "#f4f7fb", lightPaper: "#ffffff" },

  // Vibrant
  { id: "electric-violet", name: "Electric Violet", category: "vibrant", primary: "#7c4dff", secondary: "#00e5ff", darkBg: "#0e0a1a", darkPaper: "#171129", lightBg: "#f7f4ff", lightPaper: "#ffffff" },
  { id: "hot-pink", name: "Hot Pink", category: "vibrant", primary: "#f50057", secondary: "#00e676", darkBg: "#170a10", darkPaper: "#231019", lightBg: "#fdf3f7", lightPaper: "#ffffff" },
  { id: "cyber-lime", name: "Cyber Lime", category: "vibrant", primary: "#aeea00", secondary: "#651fff", darkBg: "#0f120a", darkPaper: "#181d10", lightBg: "#fafcf0", lightPaper: "#ffffff" },
  { id: "tangerine", name: "Tangerine", category: "vibrant", primary: "#ff5722", secondary: "#03a9f4", darkBg: "#160d09", darkPaper: "#221510", lightBg: "#fdf6f3", lightPaper: "#ffffff" },
  { id: "aqua-splash", name: "Aqua Splash", category: "vibrant", primary: "#00b8d4", secondary: "#ff6e40", darkBg: "#081316", darkPaper: "#0e1e23", lightBg: "#f0fafc", lightPaper: "#ffffff" },
  { id: "magenta-burst", name: "Magenta Burst", category: "vibrant", primary: "#d500f9", secondary: "#76ff03", darkBg: "#130817", darkPaper: "#1e0e24", lightBg: "#fbf2fd", lightPaper: "#ffffff" },
  { id: "sunset-orange", name: "Sunset Orange", category: "vibrant", primary: "#ff3d00", secondary: "#ffea00", darkBg: "#160b08", darkPaper: "#22110d", lightBg: "#fdf5f2", lightPaper: "#ffffff" },
  { id: "laser-blue", name: "Laser Blue", category: "vibrant", primary: "#2979ff", secondary: "#f50057", darkBg: "#080e18", darkPaper: "#0e1726", lightBg: "#f2f6ff", lightPaper: "#ffffff" },
  { id: "toxic-green", name: "Toxic Green", category: "vibrant", primary: "#00e676", secondary: "#aa00ff", darkBg: "#08140e", darkPaper: "#0e2016", lightBg: "#f0fcf5", lightPaper: "#ffffff" },

  // Pastel
  { id: "lavender-mist", name: "Lavender Mist", category: "pastel", primary: "#9575cd", secondary: "#4db6ac", darkBg: "#100e16", darkPaper: "#191622", lightBg: "#f8f6fc", lightPaper: "#ffffff" },
  { id: "blush", name: "Blush", category: "pastel", primary: "#f06292", secondary: "#81c784", darkBg: "#160f12", darkPaper: "#22171c", lightBg: "#fdf6f8", lightPaper: "#ffffff" },
  { id: "mint-cream", name: "Mint Cream", category: "pastel", primary: "#4db6ac", secondary: "#ffb74d", darkBg: "#0c1414", darkPaper: "#132020", lightBg: "#f2fbfa", lightPaper: "#ffffff" },
  { id: "peach-sorbet", name: "Peach Sorbet", category: "pastel", primary: "#ffab91", secondary: "#7986cb", darkBg: "#161009", darkPaper: "#221a12", lightBg: "#fdf8f5", lightPaper: "#ffffff" },
  { id: "sky-soft", name: "Soft Sky", category: "pastel", primary: "#64b5f6", secondary: "#f48fb1", darkBg: "#0b1015", darkPaper: "#121b23", lightBg: "#f4f9fe", lightPaper: "#ffffff" },
  { id: "lilac-dream", name: "Lilac Dream", category: "pastel", primary: "#ba68c8", secondary: "#aed581", darkBg: "#130f15", darkPaper: "#1e1721", lightBg: "#faf5fb", lightPaper: "#ffffff" },
  { id: "buttercup", name: "Buttercup", category: "pastel", primary: "#ffd54f", secondary: "#4fc3f7", darkBg: "#14120a", darkPaper: "#201d11", lightBg: "#fdfbf0", lightPaper: "#ffffff" },
  { id: "rose-quartz", name: "Rose Quartz", category: "pastel", primary: "#f8bbd0", secondary: "#80cbc4", darkBg: "#161013", darkPaper: "#22181d", lightBg: "#fdf7f9", lightPaper: "#ffffff" },
  { id: "sage", name: "Sage", category: "pastel", primary: "#a5d6a7", secondary: "#ce93d8", darkBg: "#0e130e", darkPaper: "#161f16", lightBg: "#f5faf5", lightPaper: "#ffffff" },

  // Dark-first
  { id: "midnight-oled", name: "Midnight OLED", category: "dark", primary: "#82b1ff", secondary: "#b388ff", darkBg: "#000000", darkPaper: "#0a0a0a", lightBg: "#f5f5f7", lightPaper: "#ffffff" },
  { id: "dracula", name: "Dracula", category: "dark", primary: "#bd93f9", secondary: "#50fa7b", darkBg: "#282a36", darkPaper: "#343746", lightBg: "#f8f8f2", lightPaper: "#ffffff" },
  { id: "nord", name: "Nord", category: "dark", primary: "#88c0d0", secondary: "#a3be8c", darkBg: "#2e3440", darkPaper: "#3b4252", lightBg: "#eceff4", lightPaper: "#ffffff" },
  { id: "gruvbox", name: "Gruvbox", category: "dark", primary: "#fabd2f", secondary: "#83a598", darkBg: "#282828", darkPaper: "#32302f", lightBg: "#fbf1c7", lightPaper: "#f9f5d7" },
  { id: "tokyo-night", name: "Tokyo Night", category: "dark", primary: "#7aa2f7", secondary: "#bb9af7", darkBg: "#1a1b26", darkPaper: "#24283b", lightBg: "#e1e2e7", lightPaper: "#ffffff" },
  { id: "one-dark", name: "One Dark", category: "dark", primary: "#61afef", secondary: "#c678dd", darkBg: "#282c34", darkPaper: "#31353f", lightBg: "#fafafa", lightPaper: "#ffffff" },
  { id: "monokai", name: "Monokai", category: "dark", primary: "#a6e22e", secondary: "#f92672", darkBg: "#272822", darkPaper: "#32332b", lightBg: "#fafaf5", lightPaper: "#ffffff" },
  { id: "solarized-dark", name: "Solarized", category: "dark", primary: "#268bd2", secondary: "#b58900", darkBg: "#002b36", darkPaper: "#073642", lightBg: "#fdf6e3", lightPaper: "#eee8d5" },
  { id: "catppuccin", name: "Catppuccin", category: "dark", primary: "#cba6f7", secondary: "#94e2d5", darkBg: "#1e1e2e", darkPaper: "#28283d", lightBg: "#eff1f5", lightPaper: "#ffffff" },

  // Nature
  { id: "forest", name: "Deep Forest", category: "nature", primary: "#33691e", secondary: "#ff8f00", darkBg: "#0a1207", darkPaper: "#101c0c", lightBg: "#f4f8f1", lightPaper: "#ffffff" },
  { id: "ocean-depth", name: "Ocean Depth", category: "nature", primary: "#006064", secondary: "#ffab00", darkBg: "#06110f", darkPaper: "#0b1c1a", lightBg: "#f0f8f8", lightPaper: "#ffffff" },
  { id: "desert-dune", name: "Desert Dune", category: "nature", primary: "#bf360c", secondary: "#00838f", darkBg: "#130c08", darkPaper: "#1e130d", lightBg: "#fbf6f2", lightPaper: "#ffffff" },
  { id: "cherry-blossom", name: "Cherry Blossom", category: "nature", primary: "#ec407a", secondary: "#66bb6a", darkBg: "#150d10", darkPaper: "#211419", lightBg: "#fdf5f8", lightPaper: "#ffffff" },
  { id: "arctic", name: "Arctic Ice", category: "nature", primary: "#0288d1", secondary: "#b0bec5", darkBg: "#091015", darkPaper: "#0f1a22", lightBg: "#f2f8fc", lightPaper: "#ffffff" },
  { id: "volcanic", name: "Volcanic", category: "nature", primary: "#ff6f00", secondary: "#616161", darkBg: "#120c07", darkPaper: "#1d130c", lightBg: "#fbf7f2", lightPaper: "#ffffff" },
  { id: "meadow", name: "Meadow", category: "nature", primary: "#7cb342", secondary: "#ab47bc", darkBg: "#0d1208", darkPaper: "#141d0e", lightBg: "#f6faf1", lightPaper: "#ffffff" },
  { id: "autumn", name: "Autumn Leaves", category: "nature", primary: "#e65100", secondary: "#6d4c41", darkBg: "#130d07", darkPaper: "#1e150c", lightBg: "#fbf6f1", lightPaper: "#ffffff" },
  { id: "twilight", name: "Twilight", category: "nature", primary: "#5e35b1", secondary: "#ff7043", darkBg: "#0e0a16", darkPaper: "#161022", lightBg: "#f6f4fb", lightPaper: "#ffffff" },

  // Cinema
  { id: "noir", name: "Film Noir", category: "cinema", primary: "#9e9e9e", secondary: "#e53935", darkBg: "#0a0a0a", darkPaper: "#141414", lightBg: "#f5f5f5", lightPaper: "#ffffff" },
  { id: "technicolor", name: "Technicolor", category: "cinema", primary: "#e91e63", secondary: "#00bcd4", darkBg: "#110a0e", darkPaper: "#1b1017", lightBg: "#fcf4f7", lightPaper: "#ffffff" },
  { id: "silver-screen", name: "Silver Screen", category: "cinema", primary: "#78909c", secondary: "#ffd740", darkBg: "#0d1012", darkPaper: "#151a1e", lightBg: "#f4f6f7", lightPaper: "#ffffff" },
  { id: "red-carpet", name: "Red Carpet", category: "cinema", primary: "#c62828", secondary: "#ffd700", darkBg: "#130808", darkPaper: "#1e0e0e", lightBg: "#fbf4f4", lightPaper: "#ffffff" },
  { id: "matinee", name: "Matinee", category: "cinema", primary: "#ef6c00", secondary: "#1e88e5", darkBg: "#120d07", darkPaper: "#1d150c", lightBg: "#fcf7f0", lightPaper: "#ffffff" },
  { id: "projector", name: "Projector Glow", category: "cinema", primary: "#fdd835", secondary: "#5c6bc0", darkBg: "#121107", darkPaper: "#1d1b0c", lightBg: "#fdfcf0", lightPaper: "#ffffff" },
  { id: "vhs", name: "VHS Retro", category: "cinema", primary: "#ff4081", secondary: "#18ffff", darkBg: "#0f0a14", darkPaper: "#181020", lightBg: "#faf4fc", lightPaper: "#ffffff" },
  { id: "imax", name: "IMAX Blue", category: "cinema", primary: "#01579b", secondary: "#ffca28", darkBg: "#070e14", darkPaper: "#0c1720", lightBg: "#f1f7fc", lightPaper: "#ffffff" },
  { id: "drive-in", name: "Drive-In Night", category: "cinema", primary: "#7e57c2", secondary: "#ffca28", darkBg: "#0d0a13", darkPaper: "#15101f", lightBg: "#f7f5fb", lightPaper: "#ffffff" },

  // Monochrome
  { id: "graphite", name: "Graphite", category: "mono", primary: "#616161", secondary: "#9e9e9e", darkBg: "#0e0e0e", darkPaper: "#181818", lightBg: "#f6f6f6", lightPaper: "#ffffff" },
  { id: "ink", name: "Ink & Paper", category: "mono", primary: "#212121", secondary: "#757575", darkBg: "#0a0a0a", darkPaper: "#151515", lightBg: "#fafafa", lightPaper: "#ffffff" },
  { id: "slate-mono", name: "Slate", category: "mono", primary: "#607d8b", secondary: "#90a4ae", darkBg: "#0d1114", darkPaper: "#161c20", lightBg: "#f4f6f8", lightPaper: "#ffffff" },
  { id: "espresso", name: "Espresso", category: "mono", primary: "#6d4c41", secondary: "#a1887f", darkBg: "#0f0c0a", darkPaper: "#191411", lightBg: "#f9f6f4", lightPaper: "#ffffff" },
  { id: "navy-mono", name: "Navy Mono", category: "mono", primary: "#37474f", secondary: "#78909c", darkBg: "#0b0f11", darkPaper: "#12181b", lightBg: "#f4f6f7", lightPaper: "#ffffff" },
  { id: "sepia-tone", name: "Sepia Tone", category: "mono", primary: "#8d6e63", secondary: "#bcaaa4", darkBg: "#100d0b", darkPaper: "#1a1512", lightBg: "#faf7f5", lightPaper: "#fffdf9" },
  { id: "gunmetal", name: "Gunmetal", category: "mono", primary: "#455a64", secondary: "#ffab40", darkBg: "#0c1013", darkPaper: "#141a1e", lightBg: "#f4f6f7", lightPaper: "#ffffff" },
  { id: "porcelain", name: "Porcelain", category: "mono", primary: "#90a4ae", secondary: "#546e7a", darkBg: "#0f1214", darkPaper: "#181d20", lightBg: "#f8fafb", lightPaper: "#ffffff" },
  { id: "charcoal-red", name: "Charcoal Red", category: "mono", primary: "#424242", secondary: "#ef5350", darkBg: "#0c0c0c", darkPaper: "#161616", lightBg: "#f6f6f6", lightPaper: "#ffffff" },

  // Brand-inspired
  { id: "flix-red", name: "Flix Red", category: "brand", primary: "#e50914", secondary: "#b3b3b3", darkBg: "#0b0b0b", darkPaper: "#161616", lightBg: "#faf5f5", lightPaper: "#ffffff" },
  { id: "prime-blue", name: "Prime Blue", category: "brand", primary: "#00a8e1", secondary: "#ff9900", darkBg: "#0a1118", darkPaper: "#101b26", lightBg: "#f2f8fc", lightPaper: "#ffffff" },
  { id: "mouse-plus", name: "Magic Plus", category: "brand", primary: "#113ccf", secondary: "#8ecdf9", darkBg: "#090c17", darkPaper: "#0f1425", lightBg: "#f3f5fc", lightPaper: "#ffffff" },
  { id: "hu-green", name: "Stream Green", category: "brand", primary: "#1ce783", secondary: "#040405", darkBg: "#0b140f", darkPaper: "#121f17", lightBg: "#f1fcf6", lightPaper: "#ffffff" },
  { id: "max-purple", name: "Max Purple", category: "brand", primary: "#991eeb", secondary: "#00c2ff", darkBg: "#0f0916", darkPaper: "#180f22", lightBg: "#f8f3fc", lightPaper: "#ffffff" },
  { id: "peacock-multi", name: "Peacock", category: "brand", primary: "#05ac3f", secondary: "#fccc12", darkBg: "#0a130d", darkPaper: "#101e15", lightBg: "#f2faf4", lightPaper: "#ffffff" },
  { id: "criterion", name: "Criterion", category: "brand", primary: "#1a1a1a", secondary: "#c5a253", darkBg: "#0a0a0a", darkPaper: "#141414", lightBg: "#f8f8f6", lightPaper: "#ffffff" },
  { id: "mubi-blue", name: "Curator Blue", category: "brand", primary: "#001fb8", secondary: "#ff2f6c", darkBg: "#080a14", darkPaper: "#0e1120", lightBg: "#f3f4fb", lightPaper: "#ffffff" },
  { id: "letterboxd", name: "Boxd", category: "brand", primary: "#00b021", secondary: "#40bcf4", darkBg: "#14181c", darkPaper: "#1d232a", lightBg: "#f4f7f9", lightPaper: "#ffffff" },
];

export const THEME_CATEGORIES: { id: ThemePreset["category"]; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "vibrant", label: "Vibrant" },
  { id: "pastel", label: "Pastel" },
  { id: "dark", label: "Dark Editor" },
  { id: "nature", label: "Nature" },
  { id: "cinema", label: "Cinema" },
  { id: "mono", label: "Monochrome" },
  { id: "brand", label: "Streaming" },
];

export function getPreset(id: string): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}
