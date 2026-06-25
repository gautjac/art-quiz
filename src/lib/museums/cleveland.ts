// Cleveland Museum of Art — Open Access API
// Docs: https://openaccess-api.clevelandart.org/
//
// CC0 / public-domain works. Unlike the Met, CMA's search returns image URLs
// inline (no per-object round-trips), and the images hotlink cleanly from
// openaccess-cdn.clevelandart.org with no Cloudflare gate. Holdings include
// early public-domain prints by some modern artists (e.g. Picasso's
// Saltimbanques etchings) that no other free source surfaces.

import { type Artist } from "../artists";
import { type ArtworkRecord } from "../storage";
import { isGenuineAttribution } from "./aic";

const CMA_BASE = "https://openaccess-api.clevelandart.org/api/artworks";

interface CmaCreator {
  description?: string;
}
interface CmaImageVariant {
  url?: string;
}
interface CmaArtwork {
  id: number;
  title: string;
  creation_date?: string;
  creators?: CmaCreator[];
  images?: {
    web?: CmaImageVariant;
    print?: CmaImageVariant;
    full?: CmaImageVariant;
  } | null;
}

export async function searchArtworksByArtist(
  artist: Artist,
  limit = 30
): Promise<ArtworkRecord[]> {
  const q = encodeURIComponent(artist.searchTerms[0]);
  const fields = "id,title,creation_date,creators,images";
  const url = `${CMA_BASE}?q=${q}&has_image=1&cc0=1&limit=${limit}&fields=${fields}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CMA error: ${res.status}`);

  const data = await res.json();
  const items: CmaArtwork[] = data?.data ?? [];

  const records: ArtworkRecord[] = [];
  for (const a of items) {
    const image =
      a.images?.web?.url || a.images?.print?.url || a.images?.full?.url;
    if (!image) continue;

    // CMA's keyword search is loose (a related artist can surface under a
    // query), so validate against the creator names the same way we do for the
    // Met — at least one creator must genuinely be this artist.
    const genuine = (a.creators ?? []).some(
      (c) => c.description && isGenuineAttribution(c.description, artist.displayNames)
    );
    if (!genuine) continue;

    records.push({
      id: `cma-${a.id}`,
      title: a.title,
      artistId: artist.id,
      artistName: artist.name,
      imageUrl: image,
      dateDisplay: a.creation_date ?? "",
      museum: "cma",
      museumId: a.id,
    });
  }
  return records;
}
