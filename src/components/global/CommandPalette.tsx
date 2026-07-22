"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { tmdbImage } from "@/lib/tmdb/config";

interface QuickResult {
  id: number;
  mediaType: "movie" | "tv" | "person";
  title: string;
  year?: string;
  posterPath: string | null;
}

const STATIC_DESTINATIONS = [
  { label: "Trending", href: "/trending" },
  { label: "Discover Movies", href: "/movies/discover" },
  { label: "Discover TV", href: "/tv/discover" },
  { label: "My Watchlist", href: "/account/watchlist" },
  { label: "My Favorites", href: "/account/favorites" },
  { label: "My Ratings", href: "/account/rated" },
  { label: "Release Calendar", href: "/calendar" },
  { label: "Compare Movies", href: "/compare/movie" },
  { label: "Six Degrees of Separation", href: "/six-degrees" },
  { label: "Advanced Search", href: "/search/advanced" },
  { label: "Random Movie", href: "/random/movie" },
  { label: "Developers", href: "/developers" },
  { label: "Hidden Gems", href: "/hidden-gems" },
  { label: "Browse by Mood", href: "/moods" },
  { label: "Marathon Planner", href: "/marathon" },
  { label: "Short Movies (Under 90 min)", href: "/movies/short" },
  { label: "Epic Movies (2.5hrs+)", href: "/movies/epic" },
  { label: "Studio Showdown", href: "/compare/company" },
];

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<QuickResult[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const trimmed = query.trim();
    const handle = setTimeout(async () => {
      if (!trimmed) {
        setResults([]);
        return;
      }
      const res = await fetch(`/api/search/quick?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setActiveIndex(0);
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const filteredDestinations = STATIC_DESTINATIONS.filter((d) =>
    d.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const items: { href: string; label: string; sub?: string; avatar?: string | null }[] = [
    ...filteredDestinations.map((d) => ({ href: d.href, label: d.label })),
    ...results.map((r) => ({
      href: `/${r.mediaType}/${r.id}`,
      label: r.title,
      sub: [r.mediaType, r.year].filter(Boolean).join(" · "),
      avatar: r.posterPath ? tmdbImage(r.posterPath, "w92") : null,
    })),
  ];

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleKeyNav(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && items[activeIndex]) {
      go(items[activeIndex].href);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, overflow: "hidden" } },
        transition: {
          onExited: () => {
            setQuery("");
            setResults([]);
          },
        },
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          placeholder="Search movies, TV, people, or jump to a page…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyNav}
          slotProps={{ input: { disableUnderline: true, sx: { fontSize: 18, px: 1 } } }}
        />
      </Box>
      <List sx={{ maxHeight: 420, overflowY: "auto", py: 0 }}>
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
            {query ? "No matches yet — keep typing." : "Try “trending”, a movie title, or an actor’s name."}
          </Typography>
        )}
        {items.map((item, i) => (
          <ListItemButton key={`${item.href}-${i}`} selected={i === activeIndex} onClick={() => go(item.href)}>
            {"avatar" in item && (
              <ListItemAvatar>
                <Avatar src={item.avatar ?? undefined} variant="rounded">
                  {item.label[0]}
                </Avatar>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={item.label}
              secondary={item.sub}
              slotProps={{ secondary: { sx: { textTransform: "capitalize" } } }}
            />
            {!item.sub && <Chip label="go to" size="small" variant="outlined" />}
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
