// Unified artwork-image sourcing for an artist.
//
// AIC was the app's original source, but its IIIF image server is now behind
// Cloudflare bot-protection, so its images no longer load in the browser.
// We replace it with a hybrid:
//   1. The Met — pristine, reliable images, but PUBLIC-DOMAIN only.
//   2. Wikidata/Wikimedia Commons — universal coverage (incl. in-copyright
//      modern art the Met cannot serve), hotlinked from upload.wikimedia.org.
//
// Met is tried first for quality; Wikidata fills in when the Met is thin or
// empty (which is the case for most 20th-century artists). Artists for whom
// neither source has a freely-licensed image simply return [] — the quiz and
// gallery skip them gracefully rather than rendering a broken link.

import { type Artist } from "./artists";
import { type ArtworkRecord } from "./storage";
import { getLocalArtworks } from "./local-artworks";
import { isGenuineAttribution } from "./museums/aic";
import { searchArtworksByArtist as searchWikidata } from "./museums/wikidata";
import { searchArtworksByArtist as searchCleveland } from "./museums/cleveland";
import * as met from "./museums/met";

/** Merge record lists in priority order, de-duping by title. */
function mergeByTitle(...lists: ArtworkRecord[][]): ArtworkRecord[] {
  const out: ArtworkRecord[] = [];
  const seen = new Set<string>();
  for (const r of lists.flat()) {
    const key = r.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

// Never let one slow/rate-limited source stall the page: each is raced against
// a timeout that resolves to an empty result.
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function fetchArtworksForArtist(
  artist: Artist
): Promise<ArtworkRecord[]> {
  // User-supplied images come first and are authoritative — the only way to
  // show in-copyright modern art the free APIs can't serve. If there are enough,
  // use them alone (and skip the network entirely).
  const localRecords = getLocalArtworks(artist);
  if (localRecords.length >= 2) return localRecords;

  // Wikidata/Commons next: a single fast query that covers both public-domain
  // and in-copyright modern art, with high-quality museum scans (NGA, Google
  // Art Project). One request per artist (vs. the Met's search-plus-N-object
  // lookups), which keeps a 10-artist quiz fast and avoids rate-limiting.
  const wikidataRecords = await withTimeout(
    searchWikidata(artist, 40).catch(() => []),
    7000,
    [] as ArtworkRecord[]
  );
  if (wikidataRecords.length >= 2) return mergeByTitle(localRecords, wikidataRecords);

  // Thin on Commons — try the public-domain museums in parallel. Cleveland is
  // primary (a clean, fast API with inline images, and early PD prints for some
  // moderns Commons misses, e.g. Picasso); the Met is the secondary fallback,
  // but only for pre-20th-century artists since it holds no open-access images
  // for in-copyright moderns. Artists with nothing free anywhere come back empty
  // and are gracefully skipped.
  const [clevelandRecords, metRecords] = await Promise.all([
    withTimeout(searchCleveland(artist, 30).catch(() => []), 6000, [] as ArtworkRecord[]),
    artist.century === "20th"
      ? Promise.resolve([] as ArtworkRecord[])
      : withTimeout(fetchFromMet(artist).catch(() => []), 6000, [] as ArtworkRecord[]),
  ]);

  // Local first, then Cleveland (cleanest API), then Met, then whatever Commons
  // had.
  return mergeByTitle(
    localRecords,
    clevelandRecords,
    metRecords,
    wikidataRecords
  );
}

async function fetchFromMet(artist: Artist): Promise<ArtworkRecord[]> {
  const ids = await met.searchArtworks(artist.searchTerms[0], 30);
  // Cap object lookups: we only need a handful of genuine public-domain works,
  // and each id is a separate request (keeping the per-page Met volume sane).
  const objects = await met.getArtworksByIds(ids.slice(0, 6), 5);

  const records: ArtworkRecord[] = [];
  for (const a of objects) {
    const image = a.primaryImageSmall || a.primaryImage;
    if (!image) continue;
    if (!isGenuineAttribution(a.artistDisplayName || "", artist.displayNames)) {
      continue;
    }
    records.push({
      id: `met-${a.objectID}`,
      title: a.title,
      artistId: artist.id,
      artistName: artist.name,
      imageUrl: image,
      dateDisplay: a.objectDate,
      museum: "met",
      museumId: a.objectID,
    });
  }
  return records;
}
