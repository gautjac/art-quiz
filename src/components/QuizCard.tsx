"use client";

import { useState, useEffect, useRef } from "react";
import type { QuizQuestion } from "@/lib/quiz-engine";
import type { Artist } from "@/lib/artists";
import { getMovementById } from "@/lib/artists";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (artistCorrect: boolean, movementCorrect: boolean) => void;
}

type Phase = "artist" | "movement" | "reveal";

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizCardProps) {
  const [phase, setPhase] = useState<Phase>("artist");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [artistCorrect, setArtistCorrect] = useState(false);
  const [movementCorrect, setMovementCorrect] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const movement = getMovementById(question.correctArtist.movement);

  // Reset ALL state when the question changes (belt + suspenders with key)
  const artworkId = question.artwork.id;
  useEffect(() => {
    setPhase("artist");
    setSelectedArtist(null);
    setSelectedMovement(null);
    setArtistCorrect(false);
    setMovementCorrect(false);
    setImageLoaded(false);
    return () => {
      // Clear any pending phase transition timers on unmount/question change
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [artworkId]);

  function handleArtistChoice(artist: Artist) {
    if (selectedArtist) return;
    const correct = artist.id === question.correctArtist.id;
    setSelectedArtist(artist.id);
    setArtistCorrect(correct);

    timerRef.current = setTimeout(() => setPhase("movement"), 1200);
  }

  function handleMovementChoice(movementId: string) {
    if (selectedMovement) return;
    const correct = movementId === question.correctMovement.id;
    setSelectedMovement(movementId);
    setMovementCorrect(correct);

    timerRef.current = setTimeout(() => setPhase("reveal"), 1200);
  }

  function handleNext() {
    onAnswer(artistCorrect, movementCorrect);
  }

  // Use the artwork ID as a unique identifier for the image
  const imageKey = question.artwork.id;

  return (
    <div className="animate-fade-in">
      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-ink-muted font-medium">
          {questionNumber} / {totalQuestions}
        </span>
        <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Painting */}
      <div className="flex justify-center mb-6">
        <div className="relative max-w-md w-full">
          {!imageLoaded && (
            <div className="loading-painting shimmer w-full h-64 rounded" />
          )}
          <img
            key={imageKey}
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
          {/* Title plaque (shown during reveal) */}
          {phase === "reveal" && (
            <div className="mt-4 text-center animate-fade-in">
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

      {/* Questions */}
      {phase === "artist" && (
        <div className="animate-slide-up">
          <h2 className="text-xl mb-4 text-center">Who painted this?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {question.artistChoices.map((artist) => {
              let className = "choice-btn";
              if (selectedArtist) {
                if (artist.id === question.correctArtist.id)
                  className += " correct";
                else if (artist.id === selectedArtist) className += " wrong";
              }
              return (
                <button
                  key={artist.id}
                  className={className}
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
            <div className="mt-4 text-center animate-fade-in">
              <p
                className={`text-sm font-medium ${
                  artistCorrect ? "text-correct" : "text-wrong"
                }`}
              >
                {artistCorrect ? "Correct!" : `It's ${question.correctArtist.name}`}
              </p>
            </div>
          )}
        </div>
      )}

      {phase === "movement" && (
        <div className="animate-slide-up">
          <h2 className="text-xl mb-2 text-center">
            What movement is{" "}
            <span className="text-gold-dark">{question.correctArtist.name}</span>{" "}
            associated with?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {question.movementChoices.map((m) => {
              let className = "choice-btn";
              if (selectedMovement) {
                if (m.id === question.correctMovement.id)
                  className += " correct";
                else if (m.id === selectedMovement) className += " wrong";
              }
              return (
                <button
                  key={m.id}
                  className={className}
                  onClick={() => handleMovementChoice(m.id)}
                  disabled={!!selectedMovement}
                >
                  <span className="font-medium">{m.name}</span>
                </button>
              );
            })}
          </div>
          {selectedMovement && (
            <div className="mt-4 text-center animate-fade-in">
              <p
                className={`text-sm font-medium ${
                  movementCorrect ? "text-correct" : "text-wrong"
                }`}
              >
                {movementCorrect
                  ? "Correct!"
                  : `The answer is ${question.correctMovement.name}`}
              </p>
            </div>
          )}
        </div>
      )}

      {phase === "reveal" && (
        <div className="animate-slide-up max-w-xl mx-auto">
          {/* Score summary */}
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

          {/* Info card */}
          <div className="museum-card p-5 mb-6">
            <h3 className="text-lg mb-1">{question.correctArtist.name}</h3>
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
            onClick={handleNext}
            className="w-full py-3.5 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
          >
            {questionNumber === totalQuestions
              ? "See Results"
              : "Next Painting"}
          </button>
        </div>
      )}
    </div>
  );
}
