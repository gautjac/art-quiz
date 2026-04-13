"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  selectArtistsForQuiz,
  fetchArtworksForArtists,
  generateQuizQuestions,
  type QuizQuestion,
} from "@/lib/quiz-engine";
import {
  getProgress,
  saveProgress,
  updateWeightAfterAttempt,
  updateStreak,
  type DailyQuizResult,
  type QuizAttempt,
} from "@/lib/storage";
import QuizResults from "@/components/QuizResults";
import { type Artist, getMovementById } from "@/lib/artists";

type PageState = "loading" | "playing" | "results";
type Phase = "artist" | "movement" | "reveal";

interface AttemptResult {
  question: QuizQuestion;
  artistCorrect: boolean;
  movementCorrect: boolean;
}

const QUIZ_SIZE = 10;

export default function QuizPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AttemptResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Curating today's paintings..."
  );

  // Quiz card state — all managed in parent
  const [phase, setPhase] = useState<Phase>("artist");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [artistCorrect, setArtistCorrect] = useState(false);
  const [movementCorrect, setMovementCorrect] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const question = questions[currentIndex] ?? null;
  const movement = question
    ? getMovementById(question.correctArtist.movement)
    : null;

  const loadQuiz = useCallback(async () => {
    setPageState("loading");
    setCurrentIndex(0);
    setResults([]);
    setPhase("artist");
    setSelectedArtist(null);
    setSelectedMovement(null);
    setArtistCorrect(false);
    setMovementCorrect(false);
    setImageLoaded(false);

    const messages = [
      "Curating today's paintings...",
      "Visiting the museum vaults...",
      "Selecting masterpieces...",
      "Preparing your gallery...",
    ];
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const progress = getProgress();
      const artists = selectArtistsForQuiz(progress, QUIZ_SIZE + 5);
      const artworkMap = await fetchArtworksForArtists(artists);
      const quizQuestions = generateQuizQuestions(
        artworkMap,
        artists,
        QUIZ_SIZE,
        progress.seenArtworks
      );

      if (quizQuestions.length === 0) {
        setLoadingMessage(
          "Having trouble reaching the museums. Please try again..."
        );
        return;
      }

      setQuestions(quizQuestions);
      setPageState("playing");
    } catch (error) {
      console.error("Failed to load quiz:", error);
      setLoadingMessage(
        "Having trouble reaching the museums. Please try again..."
      );
    } finally {
      clearInterval(msgInterval);
    }
  }, []);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  function handleArtistChoice(artist: Artist) {
    if (selectedArtist || !question) return;
    const correct = artist.id === question.correctArtist.id;
    setSelectedArtist(artist.id);
    setArtistCorrect(correct);
    // NO setTimeout — user clicks "Continue" to advance
  }

  function handleMovementChoice(movementId: string) {
    if (selectedMovement || !question) return;
    const correct = movementId === question.correctMovement.id;
    setSelectedMovement(movementId);
    setMovementCorrect(correct);
    // NO setTimeout — user clicks "Continue" to advance
  }

  function advanceToMovement() {
    setPhase("movement");
  }

  function advanceToReveal() {
    setPhase("reveal");
  }

  function advanceToNext() {
    if (!question) return;

    const progress = getProgress();
    updateWeightAfterAttempt(
      progress,
      question.correctArtist.id,
      artistCorrect,
      movementCorrect
    );

    const newResult: AttemptResult = {
      question,
      artistCorrect,
      movementCorrect,
    };
    const newResults = [...results, newResult];
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      updateStreak(progress);
      setStreak(progress.streak);

      const dailyResult: DailyQuizResult = {
        date: new Date().toISOString().split("T")[0],
        totalQuestions: questions.length,
        artistCorrect: newResults.filter((r) => r.artistCorrect).length,
        movementCorrect: newResults.filter((r) => r.movementCorrect).length,
        attempts: newResults.map(
          (r): QuizAttempt => ({
            date: new Date().toISOString(),
            artworkId: r.question.artwork.id,
            artistId: r.question.correctArtist.id,
            artistCorrect: r.artistCorrect,
            movementCorrect: r.movementCorrect,
          })
        ),
      };
      progress.quizHistory.push(dailyResult);

      for (const r of newResults) {
        if (!progress.seenArtworks.includes(r.question.artwork.id)) {
          progress.seenArtworks.push(r.question.artwork.id);
        }
      }

      saveProgress(progress);
      setPageState("results");
    } else {
      // Advance to next question — reset all card state, then change index
      setPhase("artist");
      setSelectedArtist(null);
      setSelectedMovement(null);
      setArtistCorrect(false);
      setMovementCorrect(false);
      setImageLoaded(false);
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-dark bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
          <h1 className="text-lg tracking-tight">Galerie</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {pageState === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            <div className="relative">
              <div className="w-32 h-40 loading-painting shimmer rounded painting-frame" />
              <div className="absolute -bottom-2 -right-2 w-28 h-36 loading-painting shimmer rounded painting-frame-sm opacity-60 -rotate-3" />
            </div>
            <p className="text-ink-muted text-sm mt-4">{loadingMessage}</p>
          </div>
        )}

        {pageState === "playing" && question && (
          <div>
            {/* Progress bar */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-ink-muted font-medium">
                {currentIndex + 1} / {questions.length}
              </span>
              <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Painting — use artwork ID as key to force new img element */}
            <div className="flex justify-center mb-6" key={`img-${question.artwork.id}`}>
              <div className="relative max-w-md w-full">
                {!imageLoaded && (
                  <div className="loading-painting shimmer w-full h-64 rounded" />
                )}
                <img
                  src={question.artwork.imageUrl}
                  alt="Mystery painting"
                  className={`w-full max-h-[45vh] object-contain rounded painting-frame transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23f0ebe3'%3E%3Crect width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%238a8a8a' font-size='16'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                    setImageLoaded(true);
                  }}
                />
                {phase === "reveal" && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-ink-muted italic">
                      {question.artwork.title}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {question.artwork.dateDisplay}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ARTIST PHASE */}
            {phase === "artist" && (
              <div>
                <h2 className="text-xl mb-4 text-center">
                  Who painted this?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {question.artistChoices.map((artist) => {
                    let cls = "choice-btn";
                    if (selectedArtist) {
                      if (artist.id === question.correctArtist.id)
                        cls += " correct";
                      else if (artist.id === selectedArtist) cls += " wrong";
                    }
                    return (
                      <button
                        key={artist.id}
                        className={cls}
                        onClick={() => handleArtistChoice(artist)}
                        disabled={!!selectedArtist}
                      >
                        <span className="font-medium">{artist.name}</span>
                        <span className="block text-xs text-ink-muted mt-0.5">
                          {artist.nationality}, {artist.birthYear}–
                          {artist.deathYear || "present"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedArtist && (
                  <div className="mt-4 text-center">
                    <p
                      className={`text-sm font-medium mb-4 ${
                        artistCorrect ? "text-correct" : "text-wrong"
                      }`}
                    >
                      {artistCorrect
                        ? "Correct!"
                        : `It's ${question.correctArtist.name}`}
                    </p>
                    <button
                      onClick={advanceToMovement}
                      className="px-6 py-2.5 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MOVEMENT PHASE */}
            {phase === "movement" && (
              <div>
                <h2 className="text-xl mb-2 text-center">
                  What movement is{" "}
                  <span className="text-gold-dark">
                    {question.correctArtist.name}
                  </span>{" "}
                  associated with?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {question.movementChoices.map((m) => {
                    let cls = "choice-btn";
                    if (selectedMovement) {
                      if (m.id === question.correctMovement.id)
                        cls += " correct";
                      else if (m.id === selectedMovement) cls += " wrong";
                    }
                    return (
                      <button
                        key={m.id}
                        className={cls}
                        onClick={() => handleMovementChoice(m.id)}
                        disabled={!!selectedMovement}
                      >
                        <span className="font-medium">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedMovement && (
                  <div className="mt-4 text-center">
                    <p
                      className={`text-sm font-medium mb-4 ${
                        movementCorrect ? "text-correct" : "text-wrong"
                      }`}
                    >
                      {movementCorrect
                        ? "Correct!"
                        : `The answer is ${question.correctMovement.name}`}
                    </p>
                    <button
                      onClick={advanceToReveal}
                      className="px-6 py-2.5 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* REVEAL PHASE */}
            {phase === "reveal" && (
              <div className="max-w-xl mx-auto">
                <div className="flex justify-center gap-4 mb-5">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      artistCorrect
                        ? "bg-correct-light text-correct"
                        : "bg-wrong-light text-wrong"
                    }`}
                  >
                    Artist: {artistCorrect ? "Correct" : "Incorrect"}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      movementCorrect
                        ? "bg-correct-light text-correct"
                        : "bg-wrong-light text-wrong"
                    }`}
                  >
                    Movement: {movementCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>

                <div className="museum-card p-5 mb-6">
                  <h3 className="text-lg mb-1">
                    {question.correctArtist.name}
                  </h3>
                  <p className="text-sm text-gold-dark font-medium mb-2">
                    {movement?.name} · {movement?.period}
                  </p>
                  <p className="text-sm text-ink-light leading-relaxed mb-3">
                    {question.correctArtist.bio}
                  </p>
                  {movement && (
                    <div className="pt-3 border-t border-cream-dark">
                      <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                        About {movement.name}
                      </p>
                      <p className="text-sm text-ink-light leading-relaxed">
                        {movement.description}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={advanceToNext}
                  className="w-full py-3.5 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
                >
                  {currentIndex + 1 === questions.length
                    ? "See Results"
                    : "Next Painting"}
                </button>
              </div>
            )}
          </div>
        )}

        {pageState === "results" && (
          <QuizResults
            results={results}
            streak={streak}
            onPlayAgain={loadQuiz}
            onGoHome={() => router.push("/")}
          />
        )}
      </main>
    </div>
  );
}
