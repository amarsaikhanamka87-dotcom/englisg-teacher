export type FlashcardView = {
  id: string;
  word: string;
  imageKey: string;
  imageUrl: string;
};

export type FlashcardSetView = {
  id: string;
  title: string;
  description: string | null;
  cards: FlashcardView[];
};

export type FlashcardSetSummary = {
  id: string;
  title: string;
  description: string | null;
  cardCount: number;
  coverImageUrl: string | null;
  updatedAt: Date;
};
