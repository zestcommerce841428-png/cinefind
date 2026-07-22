import { NextResponse } from "next/server";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

interface Participant {
  name: string;
  genreIds: number[][];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { participants?: Participant[] } | null;
  const participants = body?.participants?.filter((p) => p.genreIds.length > 0) ?? [];

  if (participants.length < 2) {
    return NextResponse.json({ error: "Need at least two participants with picks." }, { status: 400 });
  }

  const genreScores = new Map<number, number>();
  for (const participant of participants) {
    const genresForParticipant = new Set<number>();
    for (const idsForMovie of participant.genreIds) {
      for (const gid of idsForMovie) genresForParticipant.add(gid);
    }
    for (const gid of genresForParticipant) {
      genreScores.set(gid, (genreScores.get(gid) ?? 0) + 1);
    }
  }

  const genreList = await getMovieGenres();
  const genreMap = new Map(genreList.genres.map((g) => [g.id, g.name]));

  const rankedGenres = Array.from(genreScores.entries()).sort((a, b) => b[1] - a[1]);
  const sharedByAll = rankedGenres.filter(([, count]) => count === participants.length).map(([id]) => id);
  const topGenreIds = (sharedByAll.length > 0 ? sharedByAll : rankedGenres.map(([id]) => id)).slice(0, 3);

  if (topGenreIds.length === 0) {
    return NextResponse.json({ error: "Couldn't find common ground." }, { status: 200 });
  }

  const recommendations = await discoverMovies({
    with_genres: topGenreIds.join("|"),
    sort_by: "vote_average.desc",
    "vote_count.gte": 300,
  });

  return NextResponse.json({
    commonGenres: topGenreIds.map((id) => genreMap.get(id)).filter(Boolean),
    everyoneAgrees: sharedByAll.length > 0,
    results: recommendations.results.slice(0, 12),
  });
}
