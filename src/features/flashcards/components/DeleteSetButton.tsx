"use client";

import { useTransition } from "react";
import { deleteFlashcardSetAction } from "../flashcard-set.actions";

export function DeleteSetButton({ setId }: { setId: string }) {
  const [isDeleting, startDeleting] = useTransition();

  return (
    <button
      type="button"
      disabled={isDeleting}
      onClick={() => {
        if (!confirm("Delete this set and all its images? This cannot be undone.")) return;
        startDeleting(() => deleteFlashcardSetAction(setId));
      }}
      className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
    >
      {isDeleting ? "Deleting…" : "Delete set"}
    </button>
  );
}
