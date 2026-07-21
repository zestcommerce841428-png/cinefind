import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AlternativeNamesPage from "@/components/detail/AlternativeNamesPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getNetworkDetails, getNetworkAlternativeNames } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getNetworkDetails(id), getNetworkAlternativeNames(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [network] = data;
  return {
    title: `${network.name} — Alternative Names`,
    alternates: { canonical: `/network/${id}/alternative-names` },
  };
}

export default async function NetworkAlternativeNamesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [network, altNames] = data;

  return (
    <AlternativeNamesPage
      title={network.name}
      backHref={`/network/${id}`}
      names={altNames.results}
    />
  );
}
