import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/flashcards/flashcard-set.service";

export const loadSetOrNotFound = cache(async (setId: string) => {
  const set = await getFlashcardSet(setId);
  if (!set) notFound();
  return set;
});
