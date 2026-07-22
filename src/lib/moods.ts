export interface Mood {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  withGenres: string;
  sortBy?: string;
  voteCountGte?: number;
}

// Genre IDs are TMDB's standard movie genre IDs. "|" = match ANY, "," = match ALL.
export const MOODS: Mood[] = [
  {
    slug: "cozy-sunday",
    label: "Cozy Sunday",
    emoji: "🛋️",
    description: "Warm, easy comfort watches — family and comedy.",
    withGenres: "10751|35",
    sortBy: "popularity.desc",
    voteCountGte: 100,
  },
  {
    slug: "edge-of-your-seat",
    label: "Edge of Your Seat",
    emoji: "😬",
    description: "Tense thrillers and mysteries that keep you guessing.",
    withGenres: "53,9648",
    sortBy: "vote_average.desc",
    voteCountGte: 200,
  },
  {
    slug: "feel-good",
    label: "Feel-Good",
    emoji: "🌤️",
    description: "Comedy and romance to lift your mood.",
    withGenres: "35,10749",
    sortBy: "popularity.desc",
    voteCountGte: 100,
  },
  {
    slug: "mind-bending",
    label: "Mind-Bending",
    emoji: "🧠",
    description: "Sci-fi and mystery that mess with reality.",
    withGenres: "878,9648",
    sortBy: "vote_average.desc",
    voteCountGte: 200,
  },
  {
    slug: "popcorn-action",
    label: "Popcorn Action",
    emoji: "💥",
    description: "Big, loud action and adventure blockbusters.",
    withGenres: "28,12",
    sortBy: "popularity.desc",
    voteCountGte: 200,
  },
  {
    slug: "spooky-night",
    label: "Spooky Night",
    emoji: "🎃",
    description: "Horror and thrillers for a scary movie night.",
    withGenres: "27|53",
    sortBy: "popularity.desc",
    voteCountGte: 150,
  },
  {
    slug: "true-crime",
    label: "True Crime",
    emoji: "🔍",
    description: "Crime dramas and documentaries based on real events.",
    withGenres: "80|99",
    sortBy: "vote_average.desc",
    voteCountGte: 100,
  },
  {
    slug: "epic-adventure",
    label: "Epic Adventure",
    emoji: "🗺️",
    description: "Fantasy and adventure worlds to get lost in.",
    withGenres: "14,12",
    sortBy: "popularity.desc",
    voteCountGte: 150,
  },
];

export function getMood(slug: string) {
  return MOODS.find((m) => m.slug === slug) ?? null;
}
