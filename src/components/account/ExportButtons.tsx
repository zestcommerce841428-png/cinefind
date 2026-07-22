import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

export default function ExportButtons({ type }: { type: "favorites" | "watchlist" | "ratings" }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<DownloadIcon />}
        component="a"
        href={`/api/export/${type}?format=csv`}
      >
        Export CSV
      </Button>
      <Button
        size="small"
        variant="outlined"
        startIcon={<DownloadIcon />}
        component="a"
        href={`/api/export/${type}?format=json`}
      >
        Export JSON
      </Button>
    </Stack>
  );
}
