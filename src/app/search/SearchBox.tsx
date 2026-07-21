"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBox({
  initialQuery,
  basePath = "/search",
  placeholder = "Search movies, TV shows, people...",
}: {
  initialQuery: string;
  basePath?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialQuery);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed && trimmed !== initialQuery) {
        router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
      }
    }, 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      role="search"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        mb: 4,
        borderRadius: 999,
        border: "1px solid",
        borderColor: "divider",
        maxWidth: 480,
      }}
    >
      <SearchIcon />
      <InputBase
        autoFocus
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ "aria-label": "Search query" }}
      />
      <IconButton type="submit" aria-label="Submit search" size="small">
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
