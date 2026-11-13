"use client";

import { useCallback, useEffect, useState } from "react";
import type { FlashcardView } from "../flashcard-set.types";
import { shuffle } from "../quiz.logic";

type FlipCardsStudyProps = {
  cards: FlashcardView[];
};

export function FlipCardsStudy({ cards }: FlipCardsStudyProps) {
  const [deck, setDeck] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShowingWord, setIsShowingWord] = useState(false);

  const currentCard = deck[currentIndex];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= deck.length) return;
      setCurrentIndex(nextIndex);
      setIsShowingWord(false);
    },
    [deck.length],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight") goTo(currentIndex + 1);
      if (event.key === "ArrowLeft") goTo(currentIndex - 1);
      if (event.key === " ") {
        event.preventDefault();
        setIsShowingWord((showing) => !showing);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goTo]);

  if (!currentCard) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setIsShowingWord((showing) => !showing)}
        className="flex aspect-[4/3] w-full max-w-2xl items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl dark:bg-slate-800"
        aria-label={isShowingWord ? "Show image" : "Show word"}
      >
        {isShowingWord ? (
          <span className="text-5xl font-semibold">{currentCard.word}</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentCard.imageUrl} alt="Flashcard" className="max-h-full max-w-full object-contain" />
        )}
      </button>
      <p className="text-sm text-slate-500">Click the card or press Space to flip · ← → to move</p>

      <div className="flex items-center gap-6">
        <NavButton label="Previous card" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)}>
          ←
        </NavButton>
        <span className="min-w-16 text-center font-semibold">
          {currentIndex + 1} / {deck.length}
        </span>
        <NavButton
          label="Next card"
          disabled={currentIndex === deck.length - 1}
          onClick={() => goTo(currentIndex + 1)}
        >
          →
        </NavButton>
      </div>

      <button
        type="button"
        onClick={() => {
          setDeck(shuffle(cards));
          setCurrentIndex(0);
          setIsShowingWord(false);
        }}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        🔀 Shuffle
      </button>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="h-12 w-12 rounded-full bg-white text-xl shadow hover:bg-slate-50 disabled:opacity-30 dark:bg-slate-800"
    >
      {children}
    </button>
  );
}
