export interface TastePersona {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  weights: Record<string, number>;
}

export const TASTE_PERSONAS: TastePersona[] = [
  {
    slug: "arthouse",
    label: "Arthouse Devotee",
    emoji: "🎞️",
    description: "Drawn to drama, mystery, and stories that linger.",
    weights: { Drama: 3, Mystery: 2, "Foreign": 2, History: 1.5, War: 1 },
  },
  {
    slug: "blockbuster",
    label: "Blockbuster Chaser",
    emoji: "💥",
    description: "Big action, bigger spectacle.",
    weights: { Action: 3, Adventure: 2.5, "Science Fiction": 2, Fantasy: 1.5 },
  },
  {
    slug: "horror-head",
    label: "Horror Head",
    emoji: "🎃",
    description: "Always chasing the next scare.",
    weights: { Horror: 3, Thriller: 2, Mystery: 1 },
  },
  {
    slug: "romantic",
    label: "Hopeless Romantic",
    emoji: "💞",
    description: "Here for the love stories and happy endings.",
    weights: { Romance: 3, Comedy: 1.5, Drama: 1 },
  },
  {
    slug: "comfort-viewer",
    label: "Comfort Viewer",
    emoji: "🛋️",
    description: "Comedy and family favorites on repeat.",
    weights: { Comedy: 3, Family: 2.5, Animation: 1.5 },
  },
  {
    slug: "world-builder",
    label: "World Builder",
    emoji: "🐉",
    description: "Lives for sprawling fantasy and sci-fi universes.",
    weights: { Fantasy: 3, "Science Fiction": 2.5, Adventure: 1.5 },
  },
  {
    slug: "true-crime-junkie",
    label: "True Crime Junkie",
    emoji: "🔍",
    description: "Documentaries, crime dramas, and real-world mysteries.",
    weights: { Crime: 3, Documentary: 2.5, Mystery: 1.5 },
  },
];

export function matchPersonas(
  genreCounts: Map<string, number>,
  topN = 3
): { persona: TastePersona; score: number }[] {
  const scored = TASTE_PERSONAS.map((persona) => {
    let dot = 0;
    let userMag = 0;
    let personaMag = 0;
    const allGenres = new Set([...genreCounts.keys(), ...Object.keys(persona.weights)]);
    for (const genre of allGenres) {
      const u = genreCounts.get(genre) ?? 0;
      const p = persona.weights[genre] ?? 0;
      dot += u * p;
      userMag += u * u;
      personaMag += p * p;
    }
    const score = userMag > 0 && personaMag > 0 ? dot / (Math.sqrt(userMag) * Math.sqrt(personaMag)) : 0;
    return { persona, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}
