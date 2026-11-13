import "server-only";
import { getPrisma } from "@/lib/prisma";
import type { FlashcardSetInput } from "./flashcard-set.schema";

function toCardRows(cards: FlashcardSetInput["cards"]) {
  return cards.map((card, position) => ({ word: card.word, imageKey: card.imageKey, position }));
}

export function findAllSetsWithCover() {
  return getPrisma().flashcardSet.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { cards: true } },
      cards: { orderBy: { position: "asc" }, take: 1, select: { imageKey: true } },
    },
  });
}

export function findSetById(setId: string) {
  return getPrisma().flashcardSet.findUnique({
    where: { id: setId },
    include: { cards: { orderBy: { position: "asc" } } },
  });
}

export function findCardsBySetId(setId: string) {
  return getPrisma().flashcard.findMany({ where: { setId }, select: { id: true, imageKey: true } });
}

export function insertSet(input: FlashcardSetInput) {
  return getPrisma().flashcardSet.create({
    data: {
      title: input.title,
      description: input.description || null,
      cards: { create: toCardRows(input.cards) },
    },
    select: { id: true },
  });
}

/**
 * D1 has no interactive transactions, so new cards are written first and the old
 * ones deleted after. If something fails midway, no cards are lost.
 */
export async function replaceSet(setId: string, input: FlashcardSetInput, previousCardIds: string[]) {
  const prisma = getPrisma();
  await prisma.flashcardSet.update({
    where: { id: setId },
    data: {
      title: input.title,
      description: input.description || null,
      cards: { create: toCardRows(input.cards) },
    },
  });
  await prisma.flashcard.deleteMany({ where: { id: { in: previousCardIds } } });
}

export function removeSet(setId: string) {
  return getPrisma().flashcardSet.delete({ where: { id: setId } });
}
