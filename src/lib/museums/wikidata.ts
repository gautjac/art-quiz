// Wikidata Query Service + Wikimedia Commons
// Universal artwork-image source, including in-copyright modern art that the
// Met cannot serve. We match the artist by their exact English label, require
// the artist to be human (P31 Q5) and the work to be a visual artwork
// (P31/P279* Q4502142) created by them (P170) with a depicting image (P18).
// P170 guarantees authorship, so every result is genuinely BY the artist.
//
// WDQS sends permissive CORS headers, so this runs directly from the browser.
// Commons images hotlink cleanly from upload.wikimedia.org — no Cloudflare gate.

import { type Artist } from "../artists";
import { type ArtworkRecord } from "../storage";

const ENDPOINT = "https://query.wikidata.org/sparql";

interface SparqlBinding {
  work: { value: string };
  workLabel?: { value: string };
  image: { value: string };
  yr?: { value: string };
}

function escapeSparqlLiteral(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Lowercase + strip diacritics for accent-insensitive matching ("Miró" → "miro").
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Commons filename fragments that signal a photo/reproduction/3-D object rather
// than a scan of the artwork itself. P170 guarantees the work is BY the artist,
// but its image can still be a street mural, a museum installation shot, a
// postage stamp, etc. Checked against the space-preserving filename.
const NON_ARTWORK_TOKENS = [
  "mural", "art photo", "installation", "exhibition", "exposic", "exposition",
  "graffiti", "grafiti", "street art", "mosaic", "replica", "reproduction",
  "statue", "sculpt", "monument", "memorial", "plaque", "postage", "stamp",
  "banknote", "tapestry", "tapis", "figurine", "panorama", "signature",
  "tomb", "grave", "outside",
];

/**
 * Decide whether a Commons image genuinely depicts the artist's own 2-D work.
 *
 * The strong signal is the filename containing the artist's surname — real
 * artwork scans are overwhelmingly named like "Claude Monet - Water Lilies" or
 * "GeorgesBraqueTreesAtEstaque", whereas the noise (a Picasso public sculpture,
 * a mislabelled image from another artist, a town's tiled reproduction) is not.
 * Combined with the non-artwork blocklist, this keeps quiz images both correct
 * (truly by the artist) and appropriate (a painting/print, not a photo of a
 * statue) — at the cost of skipping the occasional oddly-named real work.
 */
function isUsableArtworkImage(p18Url: string, surnameKey: string): boolean {
  const file = decodeURIComponent(p18Url.split("/").pop() || "");
  const spaced = normalize(file);
  if (NON_ARTWORK_TOKENS.some((t) => spaced.includes(t))) return false;
  const compact = spaced.replace(/[^a-z0-9]/g, "");
  return compact.includes(surnameKey);
}

/** The artist's surname, normalized and stripped to [a-z0-9] for matching. */
function surnameKey(artist: Artist): string {
  const parts = artist.name.trim().split(/\s+/);
  return normalize(parts[parts.length - 1]).replace(/[^a-z0-9]/g, "");
}

/**
 * Turn a Wikidata P18 value (a Commons Special:FilePath URL) into an https,
 * width-bounded thumbnail URL so we don't pull multi-megabyte originals.
 */
function toCommonsThumb(p18Url: string, width = 800): string {
  const url = p18Url.replace(/^http:\/\//, "https://");
  return url + (url.includes("?") ? "&" : "?") + `width=${width}`;
}

export async function searchArtworksByArtist(
  artist: Artist,
  limit = 40
): Promise<ArtworkRecord[]> {
  const name = escapeSparqlLiteral(artist.name);
  // Works created (P170) by the human artist that are visual artworks
  // (paintings, prints, posters, drawings) with a depicting image — explicitly
  // excluding sculpture, since famous modern artists' free Commons images are
  // dominated by photos of their public sculptures.
  const query = `SELECT ?work ?workLabel ?image (YEAR(?inception) AS ?yr) WHERE {
  ?creator rdfs:label "${name}"@en ; wdt:P31 wd:Q5 .
  ?work wdt:P170 ?creator ; wdt:P31/wdt:P279* wd:Q4502142 ; wdt:P18 ?image .
  MINUS { ?work wdt:P31/wdt:P279* wd:Q860861 }
  OPTIONAL { ?work wdt:P571 ?inception . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT ${limit}`;

  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/sparql-results+json" },
  });
  if (!res.ok) throw new Error(`WDQS error: ${res.status}`);

  const data = await res.json();
  const bindings: SparqlBinding[] = data?.results?.bindings ?? [];

  const key = surnameKey(artist);
  const seen = new Set<string>();
  const records: ArtworkRecord[] = [];
  for (const b of bindings) {
    const qid = b.work.value.split("/").pop() || "";
    const label = b.workLabel?.value ?? "";
    // Skip works with no real English label (WDQS falls back to the Q-id),
    // de-dupe, and keep only genuine, appropriately-attributed artwork scans.
    if (!label || /^Q\d+$/.test(label)) continue;
    if (seen.has(qid)) continue;
    if (!isUsableArtworkImage(b.image.value, key)) continue;
    seen.add(qid);

    records.push({
      id: `wd-${qid}`,
      title: label,
      artistId: artist.id,
      artistName: artist.name,
      imageUrl: toCommonsThumb(b.image.value),
      dateDisplay: b.yr?.value ?? "",
      museum: "commons",
      museumId: qid,
    });
  }
  return records;
}
