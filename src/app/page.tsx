"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProgress, hasQuizzedToday, type UserProgress } from "@/lib/storage";
import { ARTISTS, MOVEMENTS, getMovementById } from "@/lib/artists";
import ProgressRing from "@/components/ProgressRing";

export default function HomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-16 h-20 shimmer rounded" />
      </div>
    );
  }

  const quizzedToday = progress ? hasQuizzedToday(progress) : false;
  const totalArtists = ARTISTS.length;
  const seenArtists = progress
    ? new Set(
        progress.quizHistory.flatMap((q) =>
          q.attempts.map((a) => a.artistId)
        )
      ).size
    : 0;
  const totalQuizzes = progress?.totalQuizzes || 0;

  // Overall accuracy
  const totalAttempts = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.attempts.length, 0)
    : 0;
  const totalCorrectArtist = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.artistCorrect, 0)
    : 0;
  const totalCorrectMovement = progress
    ? progress.quizHistory.reduce((sum, q) => sum + q.movementCorrect, 0)
    : 0;
  const overallAccuracy =
    totalAttempts > 0
      ? Math.round(
          ((totalCorrectArtist + totalCorrectMovement) /
            (totalAttempts * 2)) *
            100
        )
      : 0;

  // Recent quiz for quick stats
  const lastQuiz =
    progress && progress.quizHistory.length > 0
      ? progress.quizHistory[progress.quizHistory.length - 1]
      : null;

  // Movement mastery
  const movementStats: Record<string, { correct: number; total: number }> = {};
  if (progress) {
    for (const quiz of progress.quizHistory) {
      for (const attempt of quiz.attempts) {
        const artist = ARTISTS.find((a) => a.id === attempt.artistId);
        if (!artist) continue;
        if (!movementStats[artist.movement]) {
          movementStats[artist.movement] = { correct: 0, total: 0 };
        }
        movementStats[artist.movement].total++;
        if (attempt.movementCorrect)
          movementStats[artist.movement].correct++;
      }
    }
  }

  const movementEntries = Object.entries(movementStats)
    .map(([id, stats]) => ({
      movement: getMovementById(id),
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      total: stats.total,
    }))
    .filter((e) => e.movement)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gallery-wall text-cream">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.2em] font-medium">
              Daily Art Quiz
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl mb-3 text-cream">
            Galerie
          </h1>
          <p className="text-cream/70 max-w-md text-base leading-relaxed">
            Train your eye to recognize the great masters. From Botticelli to
            Warhol — six centuries of painting, one question at a time.
          </p>

          {/* Streak */}
          {progress && progress.streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
              <span className="streak-flame">&#128293;</span>
              <span className="text-sm text-cream/90 font-medium">
                {progress.streak} day streak
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Daily Quiz Card */}
        <div
          className="museum-card p-6 cursor-pointer group"
          onClick={() => router.push("/quiz")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {quizzedToday && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-correct-light text-correct font-medium">
                    Completed
                  </span>
                )}
              </div>
              <h2 className="text-2xl mb-1 group-hover:text-gold-dark transition-colors">
                {quizzedToday ? "Play Again" : "Today's Quiz"}
              </h2>
              <p className="text-ink-muted text-sm">
                10 paintings &middot; ~5 minutes &middot; Artist + Movement
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center group-hover:bg-gallery-wall transition-colors flex-shrink-0">
              <svg
                className="w-6 h-6 text-cream"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {totalQuizzes > 0 && (
          <div>
            <h2 className="text-xl mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="museum-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">{totalQuizzes}</p>
                <p className="text-xs text-ink-muted mt-1">Quizzes Taken</p>
              </div>
              <div className="museum-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {seenArtists}/{totalArtists}
                </p>
                <p className="text-xs text-ink-muted mt-1">Artists Seen</p>
              </div>
              <div className="museum-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {overallAccuracy}%
                </p>
                <p className="text-xs text-ink-muted mt-1">Accuracy</p>
              </div>
              <div className="museum-card p-4 text-center">
                <p className="text-2xl font-semibold text-ink">
                  {progress?.seenArtworks.length || 0}
                </p>
                <p className="text-xs text-ink-muted mt-1">Paintings Seen</p>
              </div>
            </div>
          </div>
        )}

        {/* Last quiz recap */}
        {lastQuiz && (
          <div>
            <h2 className="text-xl mb-4">Last Quiz</h2>
            <div className="museum-card p-5">
              <div className="flex items-center gap-6">
                <ProgressRing
                  progress={Math.round(
                    ((lastQuiz.artistCorrect + lastQuiz.movementCorrect) /
                      (lastQuiz.totalQuestions * 2)) *
                      100
                  )}
                  size={80}
                  strokeWidth={6}
                />
                <div className="flex-1">
                  <p className="text-sm text-ink-light">
                    <strong className="text-ink">
                      {lastQuiz.artistCorrect}/{lastQuiz.totalQuestions}
                    </strong>{" "}
                    artists correct
                  </p>
                  <p className="text-sm text-ink-light">
                    <strong className="text-ink">
                      {lastQuiz.movementCorrect}/{lastQuiz.totalQuestions}
                    </strong>{" "}
                    movements correct
                  </p>
                  <p className="text-xs text-ink-muted mt-1">{lastQuiz.date}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movement mastery */}
        {movementEntries.length > 0 && (
          <div>
            <h2 className="text-xl mb-4">Movement Mastery</h2>
            <div className="museum-card p-4">
              <div className="space-y-3">
                {movementEntries.map((entry) => (
                  <div key={entry.movement!.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">
                          {entry.movement!.name}
                        </span>
                        <span className="text-xs text-ink-muted ml-2 flex-shrink-0">
                          {entry.accuracy}% ({entry.total} seen)
                        </span>
                      </div>
                      <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${entry.accuracy}%`,
                            backgroundColor:
                              entry.accuracy >= 70
                                ? "#2d8a56"
                                : entry.accuracy >= 40
                                  ? "#c9a959"
                                  : "#c44536",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* What you'll learn (first time) */}
        {totalQuizzes === 0 && (
          <div>
            <h2 className="text-xl mb-4">What You'll Learn</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOVEMENTS.slice(0, 9).map((m) => (
                <div key={m.id} className="museum-card p-3">
                  <p className="text-sm font-medium mb-0.5">{m.name}</p>
                  <p className="text-xs text-ink-muted">{m.period}</p>
                </div>
              ))}
              <div className="museum-card p-3 flex items-center justify-center">
                <p className="text-sm text-ink-muted">
                  + {MOVEMENTS.length - 9} more
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-cream-dark">
          <p className="text-xs text-ink-muted">
            Artworks courtesy of the Art Institute of Chicago &amp; the
            Metropolitan Museum of Art
          </p>
          <p className="text-xs text-ink-muted mt-1">
            {totalArtists} artists &middot; {MOVEMENTS.length} movements
            &middot; 15th–20th century
          </p>
        </footer>
      </main>
    </div>
  );
}
