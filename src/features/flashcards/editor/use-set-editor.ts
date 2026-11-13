"use client";

import { useState } from "react";
import { uploadImageFromBrowser } from "@/features/image-upload/upload-image.client";
import type { FlashcardSetView } from "../flashcard-set.types";
import type { FlashcardSetInput } from "../flashcard-set.schema";

export type EditorCardRow = {
  rowId: string;
  word: string;
  imageKey: string | null;
  imageUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
};

const STARTING_EMPTY_ROWS = 3;

function createEmptyRow(): EditorCardRow {
  return {
    rowId: crypto.randomUUID(),
    word: "",
    imageKey: null,
    imageUrl: null,
    isUploading: false,
    uploadError: null,
  };
}

/** "red_apple-2.jpg" → "red apple" */
export function wordFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\d+$/, "")
    .trim();
}

function isRowEmpty(row: EditorCardRow): boolean {
  return !row.word.trim() && !row.imageKey && !row.isUploading;
}

export function useSetEditor(initialSet: FlashcardSetView | null) {
  const [title, setTitle] = useState(initialSet?.title ?? "");
  const [description, setDescription] = useState(initialSet?.description ?? "");
  const [rows, setRows] = useState<EditorCardRow[]>(() =>
    initialSet
      ? initialSet.cards.map((card) => ({
          rowId: card.id,
          word: card.word,
          imageKey: card.imageKey,
          imageUrl: card.imageUrl,
          isUploading: false,
          uploadError: null,
        }))
      : Array.from({ length: STARTING_EMPTY_ROWS }, createEmptyRow),
  );

  function updateRow(rowId: string, changes: Partial<EditorCardRow>) {
    setRows((current) => current.map((row) => (row.rowId === rowId ? { ...row, ...changes } : row)));
  }

  function addEmptyRow() {
    setRows((current) => [...current, createEmptyRow()]);
  }

  function removeRow(rowId: string) {
    setRows((current) => current.filter((row) => row.rowId !== rowId));
  }

  function moveRow(rowId: string, direction: -1 | 1) {
    setRows((current) => {
      const index = current.findIndex((row) => row.rowId === rowId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
      return reordered;
    });
  }

  async function uploadImageForRow(rowId: string, file: File) {
    const previewUrl = URL.createObjectURL(file);
    updateRow(rowId, { isUploading: true, uploadError: null, imageUrl: previewUrl, imageKey: null });
    try {
      const uploaded = await uploadImageFromBrowser(file);
      updateRow(rowId, { isUploading: false, imageKey: uploaded.imageKey, imageUrl: uploaded.imageUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      updateRow(rowId, { isUploading: false, uploadError: message, imageUrl: null });
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  }

  function removeImageFromRow(rowId: string) {
    updateRow(rowId, { imageKey: null, imageUrl: null, uploadError: null });
  }

  /** Bulk add: one new card per image, word guessed from the file name. Fills empty rows first. */
  function addCardsFromImages(files: File[]) {
    const emptyRowIds = rows.filter(isRowEmpty).map((row) => row.rowId);
    const newRows: EditorCardRow[] = [];
    const targets = files.map((file, index) => {
      let rowId = emptyRowIds[index];
      if (!rowId) {
        const newRow = createEmptyRow();
        newRows.push(newRow);
        rowId = newRow.rowId;
      }
      return { rowId, file };
    });

    setRows((current) => [...current, ...newRows]);
    for (const { rowId, file } of targets) {
      updateRow(rowId, { word: wordFromFileName(file.name) });
      void uploadImageForRow(rowId, file);
    }
  }

  const isAnyUploading = rows.some((row) => row.isUploading);

  function buildSaveInput(): { input: FlashcardSetInput } | { error: string } {
    const rowMissingImage = rows.findIndex((row) => !isRowEmpty(row) && !row.imageKey);
    if (rowMissingImage >= 0) return { error: `Card ${rowMissingImage + 1} needs an image.` };
    const rowMissingWord = rows.findIndex((row) => !isRowEmpty(row) && !row.word.trim());
    if (rowMissingWord >= 0) return { error: `Card ${rowMissingWord + 1} needs a word.` };

    const filledRows = rows.filter((row) => !isRowEmpty(row));

    return {
      input: {
        title,
        description,
        cards: filledRows.map((row) => ({ word: row.word, imageKey: row.imageKey! })),
      },
    };
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    rows,
    updateRow,
    addEmptyRow,
    removeRow,
    moveRow,
    uploadImageForRow,
    removeImageFromRow,
    addCardsFromImages,
    isAnyUploading,
    buildSaveInput,
  };
}
