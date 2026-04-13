// Local storage wrapper for quiz progress and spaced repetition

export interface ArtworkRecord {
  id: string; // "aic-{id}" or "met-{id}"
  title: string;
  artistId: string;
  artistName: string;
  imageUrl: string;
  dateDisplay: string;
  museum: "aic" | "met";
  museumId: number;
}

export interface QuizAttempt {
  date: string; // ISO date string
  artworkId: string;
  artistId: string;
  artistCorrect: boolean;
  movementCorrect: boolean;
}

export interface DailyQuizResult {
  date: string;
  totalQuestions: number;
  artistCorrect: number;
  movementCorrect: number;
  attempts: QuizAttempt[];
}

export interface ArtistWeight {
  artistId: string;
  weight: number; // higher = more likely to appear (needs practice)
  timesShown: number;
  timesArtistCorrect: number;
  timesMovementCorrect: number;
  lastShown: string | null;
}

export interface UserProgress {
  streak: number;
  lastQuizDate: string | null;
  totalQuizzes: number;
  artistWeights: Record<string, ArtistWeight>;
  quizHistory: DailyQuizResult[];
  seenArtworks: string[]; // artwork IDs the user has seen
}

const STORAGE_KEY = "art-quiz-progress";
const CACHE_KEY = "art-quiz-artwork-cache";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProgress(): UserProgress {
  if (!isBrowser()) return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw);
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function defaultProgress(): UserProgress {
  return {
    streak: 0,
    lastQuizDate: null,
    totalQuizzes: 0,
    artistWeights: {},
    quizHistory: [],
    seenArtworks: [],
  };
}

export function getArtistWeight(
  progress: UserProgress,
  artistId: string
): ArtistWeight {
  return (
    progress.artistWeights[artistId] || {
      artistId,
      weight: 5, // default weight for unseen artists
      timesShown: 0,
      timesArtistCorrect: 0,
      timesMovementCorrect: 0,
      lastShown: null,
    }
  );
}

export function updateWeightAfterAttempt(
  progress: UserProgress,
  artistId: string,
  artistCorrect: boolean,
  movementCorrect: boolean
): void {
  const w = getArtistWeight(progress, artistId);
  w.timesShown++;
  if (artistCorrect) w.timesArtistCorrect++;
  if (movementCorrect) w.timesMovementCorrect++;
  w.lastShown = new Date().toISOString();

  // Spaced repetition: wrong answers increase weight, correct answers decrease
  if (artistCorrect && movementCorrect) {
    w.weight = Math.max(1, w.weight - 1);
  } else if (!artistCorrect && !movementCorrect) {
    w.weight = Math.min(10, w.weight + 2);
  } else {
    w.weight = Math.min(10, w.weight + 1);
  }

  progress.artistWeights[artistId] = w;
}

export function updateStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastQuizDate === today) return; // already quizzed today

  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];
  if (progress.lastQuizDate === yesterday) {
    progress.streak++;
  } else {
    progress.streak = 1;
  }
  progress.lastQuizDate = today;
  progress.totalQuizzes++;
}

export function hasQuizzedToday(progress: UserProgress): boolean {
  const today = new Date().toISOString().split("T")[0];
  return progress.lastQuizDate === today;
}

// Artwork cache for quick quiz loading
export interface ArtworkCache {
  lastUpdated: string;
  artworks: Record<string, ArtworkRecord[]>; // keyed by artistId
}

export function getArtworkCache(): ArtworkCache {
  if (!isBrowser()) return { lastUpdated: "", artworks: {} };
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { lastUpdated: "", artworks: {} };
    return JSON.parse(raw);
  } catch {
    return { lastUpdated: "", artworks: {} };
  }
}

export function saveArtworkCache(cache: ArtworkCache): void {
  if (!isBrowser()) return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// Stats helpers
export function getAccuracyByMovement(
  progress: UserProgress
): Record<string, { correct: number; total: number }> {
  const stats: Record<string, { correct: number; total: number }> = {};
  for (const quiz of progress.quizHistory) {
    for (const attempt of quiz.attempts) {
      // We'll look up the artist's movement at display time
      if (!stats[attempt.artistId]) {
        stats[attempt.artistId] = { correct: 0, total: 0 };
      }
      stats[attempt.artistId].total++;
      if (attempt.movementCorrect) stats[attempt.artistId].correct++;
    }
  }
  return stats;
}
