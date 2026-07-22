"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function subscribeNever() {
  return () => {};
}

function getCanShareSnapshot() {
  return typeof navigator !== "undefined" && "share" in navigator;
}

function getCanShareServerSnapshot() {
  return false;
}

export default function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = React.useState(false);
  const canShare = React.useSyncExternalStore(
    subscribeNever,
    getCanShareSnapshot,
    getCanShareServerSnapshot
  );

  async function handleClick() {
    const url = window.location.href;
    if (canShare) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled the native share sheet, or it failed — fall through
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={canShare ? <ShareIcon /> : <ContentCopyIcon />}
        onClick={handleClick}
      >
        {canShare ? "Share" : "Copy Link"}
      </Button>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Link copied to clipboard"
      />
    </>
  );
}
