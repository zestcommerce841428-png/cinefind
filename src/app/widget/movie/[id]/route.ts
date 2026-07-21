import { getMovieDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { renderWidgetHtml } from "@/lib/widget";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    const html = renderWidgetHtml({
      title: movie.title,
      subtitle: movie.release_date?.slice(0, 4) ?? "",
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      poster: tmdbImage(movie.poster_path, "w185"),
      href: `${new URL(request.url).origin}/movie/${id}`,
    });
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}
