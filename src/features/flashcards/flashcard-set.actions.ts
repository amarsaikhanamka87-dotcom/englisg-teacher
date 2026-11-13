"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flashcardSetInputSchema, type FlashcardSetInput } from "./flashcard-set.schema";
import * as flashcardSetService from "./flashcard-set.service";

export type SaveFlashcardSetResult = { error: string } | undefined;

export async function saveFlashcardSetAction(
  setId: string | null,
  input: FlashcardSetInput,
): Promise<SaveFlashcardSetResult> {
  const parsed = flashcardSetInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid flashcard set." };
  }

  let savedSetId: string;
  if (setId) {
    await flashcardSetService.updateFlashcardSet(setId, parsed.data);
    savedSetId = setId;
  } else {
    savedSetId = await flashcardSetService.createFlashcardSet(parsed.data);
  }

  revalidatePath("/");
  revalidatePath(`/sets/${savedSetId}`, "layout");
  redirect(`/sets/${savedSetId}`);
}

export async function deleteFlashcardSetAction(setId: string): Promise<void> {
  await flashcardSetService.deleteFlashcardSet(setId);
  revalidatePath("/");
  redirect("/");
}
