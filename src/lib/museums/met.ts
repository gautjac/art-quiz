// Metropolitan Museum of Art API
// Docs: https://metmuseum.github.io/

export interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  primaryImage: string;
  primaryImageSmall: string;
  medium: string;
  dimensions: string;
  creditLine: string;
  department: string;
  isPublicDomain: boolean;
}

const MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

export async function searchArtworks(
  query: string,
  limit = 20
): Promise<number[]> {
  const url = `${MET_BASE}/search?hasImages=true&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Met API error: ${res.status}`);
  const data = await res.json();
  const ids: number[] = data.objectIDs || [];
  // Shuffle to get variety instead of always the same top results
  for (let i = Math.min(ids.length, 50) - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, limit);
}

export async function getArtworkById(
  id: number
): Promise<MetObject | null> {
  const url = `${MET_BASE}/objects/${id}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: MetObject = await res.json();
  // Only return if it has an image and is public domain
  if (!data.primaryImage || !data.isPublicDomain) return null;
  return data;
}

export async function getArtworksByIds(
  ids: number[],
  maxConcurrent = 5
): Promise<MetObject[]> {
  const results: MetObject[] = [];
  for (let i = 0; i < ids.length; i += maxConcurrent) {
    const batch = ids.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch.map(getArtworkById));
    for (const r of batchResults) {
      if (r) results.push(r);
    }
  }
  return results;
}
