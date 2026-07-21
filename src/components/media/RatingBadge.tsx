import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function ratingColor(pct: number) {
  if (pct >= 70) return "#21d07a";
  if (pct >= 40) return "#d2d531";
  return "#db2360";
}

export default function RatingBadge({ voteAverage }: { voteAverage: number }) {
  const pct = Math.round((voteAverage ?? 0) * 10);
  const color = ratingColor(pct);

  return (
    <Box
      sx={{
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        border: `2px solid ${pct === 0 ? "rgba(255,255,255,0.3)" : color}`,
        boxShadow: 2,
      }}
      aria-label={`User rating ${pct}%`}
    >
      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: 12 }}>
        {pct > 0 ? `${pct}%` : "NR"}
      </Typography>
    </Box>
  );
}
