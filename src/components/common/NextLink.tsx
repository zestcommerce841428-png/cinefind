"use client";

// Client-boundary re-export of next/link.
// Server components must import Link from here (not "next/link") when passing it
// as a `component` prop to MUI components — otherwise React rejects the raw
// function crossing the server/client boundary.
import Link from "next/link";

export default Link;
