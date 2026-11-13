import { z } from "zod";

export const MIN_CARDS_PER_SET = 2;

export const flashcardInputSchema = z.object({
  word: z.string().trim().min(1, "Every card needs a word.").max(200),
  imageKey: z.string().trim().min(1, "Every card needs an image."),
});

export const flashcardSetInputSchema = z.object({
  title: z.string().trim().min(1, "Please enter a title.").max(120),
  description: z.string().trim().max(500).optional(),
  cards: z
    .array(flashcardInputSchema)
    .min(MIN_CARDS_PER_SET, `A set needs at least ${MIN_CARDS_PER_SET} cards.`),
});

export type FlashcardInput = z.infer<typeof flashcardInputSchema>;
export type FlashcardSetInput = z.infer<typeof flashcardSetInputSchema>;
