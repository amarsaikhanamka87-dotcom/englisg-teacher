import type { FlashcardView } from "./flashcard-set.types";

export const MAX_CHOICES = 4;

export type QuizQuestion = {
  card: FlashcardView;
  choices: string[];
};

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function buildQuizQuestions(
  cardsToAsk: FlashcardView[],
  allCards: FlashcardView[],
): QuizQuestion[] {
  return shuffle(cardsToAsk).map((card) => {
    const wrongWords = shuffle(
      [...new Set(allCards.map((other) => other.word))].filter(
        (word) => !isSameWord(word, card.word),
      ),
    ).slice(0, MAX_CHOICES - 1);

    return { card, choices: shuffle([card.word, ...wrongWords]) };
  });
}

export function normalizeWord(word: string): string {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isSameWord(answer: string, correctWord: string): boolean {
  return normalizeWord(answer) === normalizeWord(correctWord);
}
