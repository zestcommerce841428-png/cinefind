"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

function getReadableChunks(): string[] {
  const main = document.querySelector("main");
  if (!main) return [];
  const nodes = main.querySelectorAll("h1, h2, h3, h4, p, li");
  const chunks: string[] = [];
  nodes.forEach((node) => {
    const text = node.textContent?.trim();
    if (text && text.length > 1) chunks.push(text);
  });
  return chunks.length ? chunks : [document.title];
}

export default function FullPageReader() {
  const [status, setStatus] = React.useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = React.useState(1);
  const [index, setIndex] = React.useState(0);
  const chunksRef = React.useRef<string[]>([]);
  const speakRef = React.useRef<(fromIndex: number) => void>(() => {});

  const speak = React.useCallback(
    (fromIndex: number) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const chunks = chunksRef.current;
      if (fromIndex >= chunks.length) {
        setStatus("idle");
        setIndex(0);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[fromIndex]);
      utterance.rate = rate;
      utterance.onend = () => {
        setIndex((i) => {
          const next = i + 1;
          speakRef.current(next);
          return next;
        });
      };
      window.speechSynthesis.speak(utterance);
    },
    [rate]
  );

  React.useEffect(() => {
    speakRef.current = speak;
  }, [speak]);

  function play() {
    chunksRef.current = getReadableChunks();
    setStatus("playing");
    speak(index);
  }

  function pause() {
    window.speechSynthesis?.pause();
    setStatus("paused");
  }

  function resume() {
    window.speechSynthesis?.resume();
    setStatus("playing");
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setStatus("idle");
    setIndex(0);
  }

  function skip(delta: number) {
    const chunks = chunksRef.current.length ? chunksRef.current : getReadableChunks();
    chunksRef.current = chunks;
    const nextIndex = Math.min(Math.max(index + delta, 0), chunks.length - 1);
    setIndex(nextIndex);
    if (status !== "idle") speak(nextIndex);
  }

  React.useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <Box sx={{ px: 1.5, py: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Read Full Page Aloud
      </Typography>
      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5, mb: 1 }}>
        <IconButton size="small" onClick={() => skip(-1)} aria-label="Previous section">
          <SkipPreviousIcon fontSize="small" />
        </IconButton>
        {status === "playing" ? (
          <Button size="small" variant="contained" startIcon={<PauseIcon />} onClick={pause}>
            Pause
          </Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={status === "paused" ? resume : play}
          >
            {status === "paused" ? "Resume" : "Play Page"}
          </Button>
        )}
        <Button size="small" variant="outlined" startIcon={<StopIcon />} onClick={stop} disabled={status === "idle"}>
          Stop
        </Button>
        <IconButton size="small" onClick={() => skip(1)} aria-label="Next section">
          <SkipNextIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Speed
        </Typography>
        <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
          {rate.toFixed(1)}×
        </Typography>
      </Stack>
      <Slider
        value={rate}
        min={0.5}
        max={2}
        step={0.1}
        onChange={(_, v) => setRate(v as number)}
        size="small"
        aria-label="Reading speed"
      />
    </Box>
  );
}
