"use client";

import * as React from "react";
import Link from "@/components/common/NextLink";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThemeToggle from "./ThemeToggle";
import VoiceSearchButton from "./VoiceSearchButton";

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Discover",
    links: [
      { href: "/discover", label: "Discover Feed" },
      { href: "/movies", label: "Movies" },
      { href: "/tv", label: "TV Shows" },
      { href: "/people", label: "People" },
      { href: "/genres", label: "Genres" },
      { href: "/moods", label: "Browse by Mood" },
      { href: "/trending", label: "Trending" },
      { href: "/hidden-gems", label: "Hidden Gems" },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/compare", label: "Compare Anything" },
      { href: "/six-degrees", label: "Six Degrees of Separation" },
      { href: "/reunions", label: "Cast Reunions" },
      { href: "/box-office", label: "Box Office Leaderboard" },
      { href: "/keywords", label: "Keywords Explorer" },
      { href: "/marathon", label: "Marathon Planner" },
      { href: "/watch-party", label: "Watch Party Picker" },
      { href: "/duel", label: "Movie Duel" },
    ],
  },
];

const DIRECT_LINKS: NavLink[] = [{ href: "/blog", label: "Blog" }];

function NavMenu({ group }: { group: NavGroup }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        color="inherit"
        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {group.label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { minWidth: 220 } } }}>
        {group.links.map((link) => (
          <MenuItem key={link.href} component={Link} href={link.href} onClick={() => setAnchorEl(null)}>
            {link.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: (t) =>
          t.palette.mode === "dark" ? "rgba(11,14,20,0.75)" : "rgba(247,248,250,0.85)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: { xs: 1, md: 2 }, py: 1 }}>
        <IconButton
          edge="start"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </IconButton>

        <Stack
          direction="row"
          spacing={1}
          component={Link}
          href="/"
          sx={{ alignItems: "center", textDecoration: "none", color: "inherit", flexShrink: 0 }}
        >
          <LocalMoviesIcon color="primary" />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 900,
              letterSpacing: -0.5,
              background: "linear-gradient(90deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CineFind
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" }, ml: 1 }}>
          {NAV_GROUPS.map((group) => (
            <NavMenu key={group.label} group={group} />
          ))}
          {DIRECT_LINKS.map((link) => (
            <Button key={link.href} component={Link} href={link.href} color="inherit">
              {link.label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          component="form"
          onSubmit={handleSearch}
          role="search"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            border: "1px solid",
            borderColor: "divider",
            width: { xs: "auto", sm: 240, md: 300 },
            transition: "width 0.15s ease, border-color 0.15s ease",
            "&:focus-within": { borderColor: "primary.main" },
          }}
        >
          <SearchIcon fontSize="small" />
          <InputBase
            inputRef={searchInputRef}
            placeholder="Search... (press /)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            inputProps={{ "aria-label": "Search movies, TV shows, and people" }}
          />
          <VoiceSearchButton
            onResult={(text) => {
              setQuery(text);
              router.push(`/search?q=${encodeURIComponent(text)}`);
            }}
          />
        </Box>

        <Chip
          label="⌘K"
          size="small"
          variant="outlined"
          onClick={() => window.dispatchEvent(new Event("cinefind:open-command-palette"))}
          sx={{ display: { xs: "none", lg: "inline-flex" }, fontWeight: 700, cursor: "pointer" }}
        />

        <ThemeToggle />

        {isAuthenticated ? (
          <IconButton component={Link} href="/account" aria-label="Account" sx={{ ml: 0.5 }}>
            <AccountCircleIcon />
          </IconButton>
        ) : (
          <Button
            component="a"
            href="/api/auth/login"
            variant="contained"
            size="small"
            sx={{ ml: 0.5, display: { xs: "none", sm: "inline-flex" } }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          {NAV_GROUPS.map((group, i) => (
            <List
              key={group.label}
              subheader={
                <ListSubheader component="div" sx={{ fontWeight: 700 }}>
                  {group.label}
                </ListSubheader>
              }
            >
              {group.links.map((link) => (
                <ListItemButton key={link.href} component={Link} href={link.href}>
                  {link.label}
                </ListItemButton>
              ))}
              {i < NAV_GROUPS.length - 1 && <Divider sx={{ my: 1 }} />}
            </List>
          ))}
          <Divider sx={{ my: 1 }} />
          <List>
            {DIRECT_LINKS.map((link) => (
              <ListItemButton key={link.href} component={Link} href={link.href}>
                {link.label}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
