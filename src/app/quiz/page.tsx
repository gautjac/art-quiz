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
import QuizCard from "@/components/QuizCard";
import QuizResults from "@/components/QuizResults";

type QuizState = "loading" | "playing" | "results";

interface AttemptResult {
  question: QuizQuestion;
  artistCorrect: boolean;
  movementCorrect: boolean;
}

const QUIZ_SIZE = 10;

export default function QuizPage() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AttemptResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Curating today's paintings..."
  );

  const loadQuiz = useCallback(async () => {
    setState("loading");
    setCurrentIndex(0);
    setResults([]);

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
      const artists = selectArtistsForQuiz(progress, QUIZ_SIZE + 5); // extra for fallbacks
      const artworkMap = await fetchArtworksForArtists(artists);
      const quizQuestions = generateQuizQuestions(
        artworkMap,
        artists,
        QUIZ_SIZE
      );

      if (quizQuestions.length === 0) {
        setLoadingMessage(
          "Having trouble reaching the museums. Please try again..."
        );
        return;
      }

      setQuestions(quizQuestions);
      setState("playing");
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

  function handleAnswer(artistCorrect: boolean, movementCorrect: boolean) {
    const question = questions[currentIndex];

    // Update progress
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
      // Quiz complete — save results
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

      // Track seen artworks
      for (const r of newResults) {
        if (!progress.seenArtworks.includes(r.question.artwork.id)) {
          progress.seenArtworks.push(r.question.artwork.id);
        }
      }

      saveProgress(progress);
      setState("results");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-cream-dark bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
          <h1 className="text-lg tracking-tight">Galerie</h1>
          <div className="w-12" /> {/* spacer */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {state === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
            {/* Animated loading */}
            <div className="relative">
              <div className="w-32 h-40 loading-painting shimmer rounded painting-frame" />
              <div className="absolute -bottom-2 -right-2 w-28 h-36 loading-painting shimmer rounded painting-frame-sm opacity-60 -rotate-3" />
            </div>
            <p className="text-ink-muted text-sm mt-4">{loadingMessage}</p>
          </div>
        )}

        {state === "playing" && questions[currentIndex] && (
          <QuizCard
            key={`q-${currentIndex}`}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {state === "results" && (
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
