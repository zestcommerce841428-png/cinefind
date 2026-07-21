import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { tmdbImage } from "@/lib/tmdb/config";
import type { CastMember, CrewMember } from "@/lib/tmdb/types";

interface FullCastPageProps {
  title: string;
  backHref: string;
  cast: CastMember[];
  crew: CrewMember[];
}

export default function FullCastPage({ title, backHref, cast, crew }: FullCastPageProps) {
  const crewByDept = crew.reduce<Record<string, CrewMember[]>>((acc, member) => {
    (acc[member.department] ??= []).push(member);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Full Cast & Crew</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Cast
      </Typography>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {cast.map((member) => (
          <Grid key={`${member.id}-${member.character}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              component={Link}
              href={`/person/${member.id}`}
              sx={{ display: "flex", gap: 1.5, alignItems: "center", textDecoration: "none", color: "inherit" }}
            >
              <Avatar src={tmdbImage(member.profile_path, "w92") ?? undefined} sx={{ width: 48, height: 48 }}>
                {member.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {member.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {member.character}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Crew
      </Typography>
      {Object.entries(crewByDept).map(([dept, members]) => (
        <Box key={dept} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {dept}
          </Typography>
          <Grid container spacing={2}>
            {members.map((member) => (
              <Grid key={`${member.id}-${member.job}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component={Link}
                  href={`/person/${member.id}`}
                  sx={{ display: "flex", gap: 1.5, alignItems: "center", textDecoration: "none", color: "inherit" }}
                >
                  <Avatar src={tmdbImage(member.profile_path, "w92") ?? undefined} sx={{ width: 48, height: 48 }}>
                    {member.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {member.job}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
}
