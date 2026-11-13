import "server-only";
import { deleteImages, getImagePublicUrl } from "@/features/image-upload/image-storage.service";
import * as flashcardSetRepository from "./flashcard-set.repository";
import type { FlashcardSetInput } from "./flashcard-set.schema";
import type { FlashcardSetSummary, FlashcardSetView } from "./flashcard-set.types";

export async function listFlashcardSets(): Promise<FlashcardSetSummary[]> {
  const sets = await flashcardSetRepository.findAllSetsWithCover();
  return sets.map((set) => ({
    id: set.id,
    title: set.title,
    description: set.description,
    cardCount: set._count.cards,
    coverImageUrl: set.cards[0] ? getImagePublicUrl(set.cards[0].imageKey) : null,
    updatedAt: set.updatedAt,
  }));
}

export async function getFlashcardSet(setId: string): Promise<FlashcardSetView | null> {
  const set = await flashcardSetRepository.findSetById(setId);
  if (!set) return null;

  return {
    id: set.id,
    title: set.title,
    description: set.description,
    cards: set.cards.map((card) => ({
      id: card.id,
      word: card.word,
      imageKey: card.imageKey,
      imageUrl: getImagePublicUrl(card.imageKey),
    })),
  };
}

export async function createFlashcardSet(input: FlashcardSetInput): Promise<string> {
  const createdSet = await flashcardSetRepository.insertSet(input);
  return createdSet.id;
}

export async function updateFlashcardSet(setId: string, input: FlashcardSetInput): Promise<void> {
  const previousCards = await flashcardSetRepository.findCardsBySetId(setId);
  await flashcardSetRepository.replaceSet(
    setId,
    input,
    previousCards.map((card) => card.id),
  );

  const keptImageKeys = new Set(input.cards.map((card) => card.imageKey));
  const removedImageKeys = previousCards
    .map((card) => card.imageKey)
    .filter((imageKey) => !keptImageKeys.has(imageKey));
  await deleteImagesSafely(removedImageKeys);
}

export async function deleteFlashcardSet(setId: string): Promise<void> {
  const cards = await flashcardSetRepository.findCardsBySetId(setId);
  await flashcardSetRepository.removeSet(setId);
  await deleteImagesSafely(cards.map((card) => card.imageKey));
}

async function deleteImagesSafely(imageKeys: string[]): Promise<void> {
  try {
    await deleteImages(imageKeys);
  } catch (error) {
    // Data is already saved; a leftover image in R2 should not fail the request.
    console.error("Failed to delete images from R2", error);
  }
}
