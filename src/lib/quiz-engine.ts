import {
  ARTISTS,
  MOVEMENTS,
  type Artist,
  getMovementById,
} from "./artists";
import {
  type ArtworkRecord,
  type UserProgress,
  getArtistWeight,
} from "./storage";
import { fetchArtworksForArtist } from "./artwork-source";

export interface QuizQuestion {
  artwork: ArtworkRecord;
  artistChoices: Artist[];
  movementChoices: { id: string; name: string }[];
  correctArtist: Artist;
  correctMovement: { id: string; name: string };
}

// Select artists for today's quiz using weighted random selection
export function selectArtistsForQuiz(
  progress: UserProgress,
  count = 10
): Artist[] {
  const weighted = ARTISTS.map((artist) => {
    const w = getArtistWeight(progress, artist.id);
    return { artist, weight: w.weight };
  });

  // Weighted random selection without replacement
  const selected: Artist[] = [];
  const pool = [...weighted];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (let j = 0; j < pool.length; j++) {
      random -= pool[j].weight;
      if (random <= 0) {
        selected.push(pool[j].artist);
        pool.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}

/**
 * Pick an artwork for a quiz question, preferring ones the user hasn't seen.
 * Falls back to any artwork if all have been seen.
 */
function pickArtwork(
  artworks: ArtworkRecord[],
  seenArtworks: Set<string>,
  usedInThisQuiz: Set<string>
): ArtworkRecord | null {
  if (artworks.length === 0) return null;

  // First: unseen AND not used in this quiz
  const fresh = artworks.filter(
    (a) => !seenArtworks.has(a.id) && !usedInThisQuiz.has(a.id)
  );
  if (fresh.length > 0) {
    return fresh[Math.floor(Math.random() * fresh.length)];
  }

  // Second: not used in this quiz (even if seen before)
  const notUsedThisQuiz = artworks.filter((a) => !usedInThisQuiz.has(a.id));
  if (notUsedThisQuiz.length > 0) {
    return notUsedThisQuiz[Math.floor(Math.random() * notUsedThisQuiz.length)];
  }

  // Last resort: any artwork
  return artworks[Math.floor(Math.random() * artworks.length)];
}

// Fetch artworks for selected artists from museum APIs
// Batches requests to avoid overwhelming APIs
async function fetchBatch<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<{ artistId: string; records: ArtworkRecord[] }>
): Promise<{ artistId: string; records: ArtworkRecord[] }[]> {
  const results: { artistId: string; records: ArtworkRecord[] }[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export async function fetchArtworksForArtists(
  artists: Artist[]
): Promise<Map<string, ArtworkRecord[]>> {
  const results = new Map<string, ArtworkRecord[]>();

  // Each artist is sourced via the Wikidata → Met hybrid (one fast Wikidata
  // call for most). Batch concurrently, but bounded to stay gentle on the
  // Wikidata + museum endpoints.
  const fetched = await fetchBatch(artists, 5, async (artist) => {
    try {
      const records = await fetchArtworksForArtist(artist);
      return { artistId: artist.id, records };
    } catch (e) {
      console.error(`Artwork fetch failed for ${artist.name}:`, e);
      return { artistId: artist.id, records: [] };
    }
  });

  for (const result of fetched) {
    if (result.records.length > 0) {
      results.set(result.artistId, result.records);
    }
  }

  return results;
}

// Generate quiz questions from fetched artworks
export function generateQuizQuestions(
  artworkMap: Map<string, ArtworkRecord[]>,
  artists: Artist[],
  count = 10,
  seenArtworkIds: string[] = []
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedArtists = artists.filter((a) => artworkMap.has(a.id));
  const seenSet = new Set(seenArtworkIds);
  const usedInThisQuiz = new Set<string>();
  const usedImageUrls = new Set<string>(); // prevent same painting appearing twice

  for (const artist of usedArtists) {
    if (questions.length >= count) break;

    const artworks = artworkMap.get(artist.id)!;
    // Filter out artworks whose image URL we've already used
    const available = artworks.filter((a) => !usedImageUrls.has(a.imageUrl));
    const artwork = pickArtwork(available, seenSet, usedInThisQuiz);
    if (!artwork) continue;
    usedInThisQuiz.add(artwork.id);
    usedImageUrls.add(artwork.imageUrl);

    const movement = getMovementById(artist.movement);
    if (!movement) continue;

    // Generate wrong artist choices (same century or adjacent, diverse movements)
    const wrongArtists = generateWrongArtistChoices(artist, 3);
    const artistChoices = shuffle([artist, ...wrongArtists]);

    // Generate wrong movement choices
    const wrongMovements = generateWrongMovementChoices(movement.id, 3);
    const movementChoices = shuffle([
      { id: movement.id, name: movement.name },
      ...wrongMovements,
    ]);

    questions.push({
      artwork,
      artistChoices,
      movementChoices,
      correctArtist: artist,
      correctMovement: { id: movement.id, name: movement.name },
    });
  }

  return shuffle(questions).slice(0, count);
}

function generateWrongArtistChoices(
  correctArtist: Artist,
  count: number
): Artist[] {
  // Pick plausible wrong answers: same century or adjacent movements
  const candidates = ARTISTS.filter((a) => a.id !== correctArtist.id);

  // Prefer artists from the same or adjacent century for harder questions
  const sameCentury = candidates.filter(
    (a) => a.century === correctArtist.century
  );
  const sameMovement = candidates.filter(
    (a) => a.movement === correctArtist.movement
  );

  // Mix of same-century and same-movement for plausible wrong answers
  const preferred = [...new Set([...sameCentury, ...sameMovement])];
  const others = candidates.filter((a) => !preferred.includes(a));

  const pool = preferred.length >= count ? preferred : [...preferred, ...others];
  return shuffle(pool).slice(0, count);
}

function generateWrongMovementChoices(
  correctMovementId: string,
  count: number
): { id: string; name: string }[] {
  const wrong = MOVEMENTS.filter((m) => m.id !== correctMovementId);
  return shuffle(wrong)
    .slice(0, count)
    .map((m) => ({ id: m.id, name: m.name }));
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
