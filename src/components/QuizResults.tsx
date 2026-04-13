"use client";

import ProgressRing from "./ProgressRing";
import type { QuizQuestion } from "@/lib/quiz-engine";

interface AttemptResult {
  question: QuizQuestion;
  artistCorrect: boolean;
  movementCorrect: boolean;
}

interface QuizResultsProps {
  results: AttemptResult[];
  streak: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function QuizResults({
  results,
  streak,
  onPlayAgain,
  onGoHome,
}: QuizResultsProps) {
  const totalArtist = results.filter((r) => r.artistCorrect).length;
  const totalMovement = results.filter((r) => r.movementCorrect).length;
  const totalPerfect = results.filter(
    (r) => r.artistCorrect && r.movementCorrect
  ).length;
  const total = results.length;

  const overallPercent = Math.round(
    ((totalArtist + totalMovement) / (total * 2)) * 100
  );
  const artistPercent = Math.round((totalArtist / total) * 100);
  const movementPercent = Math.round((totalMovement / total) * 100);

  // Encouragement message
  let message = "";
  if (overallPercent >= 90) message = "Museum curator material!";
  else if (overallPercent >= 70) message = "Impressive eye for art!";
  else if (overallPercent >= 50) message = "Getting the hang of it!";
  else message = "Every master was once a beginner.";

  return (
    <div className="animate-fade-in-scale max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2">Quiz Complete</h1>
        <p className="text-ink-muted">{message}</p>
        {streak > 1 && (
          <p className="mt-2 text-gold-dark font-medium">
            <span className="streak-flame">&#128293;</span> {streak} day streak!
          </p>
        )}
      </div>

      {/* Score rings */}
      <div className="flex justify-center gap-8 mb-8">
        <ProgressRing
          progress={artistPercent}
          label="Artists"
          sublabel={`${totalArtist}/${total}`}
        />
        <ProgressRing
          progress={movementPercent}
          label="Movements"
          sublabel={`${totalMovement}/${total}`}
        />
      </div>

      {/* Perfect answers */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-cream-dark">
          <span className="text-gold text-lg">&#9733;</span>
          <span className="text-sm text-ink-light">
            <strong>{totalPerfect}</strong> perfect answers out of {total}
          </span>
        </div>
      </div>

      {/* Results breakdown */}
      <div className="museum-card p-4 mb-6">
        <h3 className="text-sm font-medium text-ink-muted uppercase tracking-wide mb-3">
          Breakdown
        </h3>
        <div className="space-y-2">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-cream-dark last:border-0"
            >
              <img
                src={result.question.artwork.imageUrl}
                alt=""
                className="w-10 h-10 object-cover rounded painting-frame-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {result.question.correctArtist.name}
                </p>
                <p className="text-xs text-ink-muted truncate">
                  {result.question.artwork.title}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    result.artistCorrect
                      ? "bg-correct-light text-correct"
                      : "bg-wrong-light text-wrong"
                  }`}
                  title={
                    result.artistCorrect
                      ? "Artist correct"
                      : "Artist incorrect"
                  }
                >
                  {result.artistCorrect ? "\u2713" : "\u2717"}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    result.movementCorrect
                      ? "bg-correct-light text-correct"
                      : "bg-wrong-light text-wrong"
                  }`}
                  title={
                    result.movementCorrect
                      ? "Movement correct"
                      : "Movement incorrect"
                  }
                >
                  {result.movementCorrect ? "\u2713" : "\u2717"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onGoHome}
          className="flex-1 py-3.5 bg-white border-2 border-cream-dark text-ink rounded-lg font-medium hover:border-gold transition-colors cursor-pointer"
        >
          Home
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3.5 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
