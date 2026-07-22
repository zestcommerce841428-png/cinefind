"use client";

import * as React from "react";
import Link from "@/components/common/NextLink";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/people", label: "People" },
  { href: "/trending", label: "Trending" },
  { href: "/blog", label: "Blog" },
];

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
      <Toolbar sx={{ gap: 2 }}>
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
          sx={{ alignItems: "center", textDecoration: "none", color: "inherit" }}
        >
          <LocalMoviesIcon color="primary" />
          <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
            CineFind
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}
        >
          {NAV_LINKS.map((link) => (
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
            width: { xs: "auto", sm: 280 },
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
        </Box>

        <ThemeToggle />

        {isAuthenticated ? (
          <IconButton component={Link} href="/account" aria-label="Account" sx={{ ml: 1 }}>
            <AccountCircleIcon />
          </IconButton>
        ) : (
          <Button
            component="a"
            href="/api/auth/login"
            variant="outlined"
            size="small"
            sx={{ ml: 1, display: { xs: "none", sm: "inline-flex" } }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {NAV_LINKS.map((link) => (
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
