"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Link from "@/components/common/NextLink";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary } from "@/lib/tmdb/types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function DuelBracket({ pool }: { pool: MovieSummary[] }) {
  const [round, setRound] = React.useState<MovieSummary[]>(() => shuffle(pool));
  const [nextRound, setNextRound] = React.useState<MovieSummary[]>([]);
  const [pairIndex, setPairIndex] = React.useState(0);
  const [roundNumber, setRoundNumber] = React.useState(1);

  const totalPairs = Math.floor(round.length / 2);
  const isFinal = round.length === 1;
  const current = isFinal ? null : [round[pairIndex * 2], round[pairIndex * 2 + 1]];

  function pick(winner: MovieSummary) {
    const updatedNext = [...nextRound, winner];
    if (pairIndex + 1 < totalPairs) {
      setNextRound(updatedNext);
      setPairIndex(pairIndex + 1);
    } else {
      const leftover = round.length % 2 === 1 ? [round[round.length - 1]] : [];
      setRound(shuffle([...updatedNext, ...leftover]));
      setNextRound([]);
      setPairIndex(0);
      setRoundNumber((n) => n + 1);
    }
  }

  function restart() {
    setRound(shuffle(pool));
    setNextRound([]);
    setPairIndex(0);
    setRoundNumber(1);
  }

  if (isFinal) {
    const champion = round[0];
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="overline" color="text.secondary">
          Your Winner
        </Typography>
        <Box
          component={Link}
          href={`/movie/${champion.id}`}
          sx={{
            display: "inline-block",
            width: 220,
            borderRadius: 3,
            overflow: "hidden",
            mt: 2,
            boxShadow: 6,
          }}
        >
          {tmdbImage(champion.poster_path, "w500") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tmdbImage(champion.poster_path, "w500") ?? undefined}
              alt={champion.title}
              style={{ width: "100%", display: "block" }}
            />
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
          {champion.title}
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={restart}>
          Play Again
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Chip label={`Round ${roundNumber} · ${pairIndex + 1} / ${totalPairs}`} sx={{ mb: 3 }} />
      <Box sx={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        {current?.map((movie, i) => (
          <React.Fragment key={movie.id}>
            <ButtonBase
              onClick={() => pick(movie)}
              sx={{
                width: 220,
                borderRadius: 3,
                overflow: "hidden",
                display: "block",
                textAlign: "left",
                boxShadow: 3,
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <Box>
                {tmdbImage(movie.poster_path, "w500") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tmdbImage(movie.poster_path, "w500") ?? undefined}
                    alt={movie.title}
                    style={{ width: "100%", display: "block" }}
                  />
                )}
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {movie.release_date?.slice(0, 4)} · ⭐ {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </ButtonBase>
            {i === 0 && (
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 800 }}>
                VS
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
