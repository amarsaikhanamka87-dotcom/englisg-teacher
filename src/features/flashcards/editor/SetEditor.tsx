"use client";

import { useState, useTransition } from "react";
import { saveFlashcardSetAction } from "../flashcard-set.actions";
import type { FlashcardSetView } from "../flashcard-set.types";
import { BulkImageDropzone } from "./BulkImageDropzone";
import { CardRowEditor } from "./CardRowEditor";
import { useSetEditor } from "./use-set-editor";

type SetEditorProps = {
  initialSet: FlashcardSetView | null;
};

export function SetEditor({ initialSet }: SetEditorProps) {
  const editor = useSetEditor(initialSet);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const isEditing = initialSet !== null;

  function handleSave() {
    setErrorMessage(null);
    const result = editor.buildSaveInput();
    if ("error" in result) {
      setErrorMessage(result.error);
      return;
    }
    startSaving(async () => {
      const saveResult = await saveFlashcardSetAction(initialSet?.id ?? null, result.input);
      if (saveResult?.error) setErrorMessage(saveResult.error);
    });
  }

  const saveButton = (
    <button
      type="button"
      onClick={handleSave}
      disabled={isSaving || editor.isAnyUploading}
      className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {isSaving ? "Saving…" : editor.isAnyUploading ? "Uploading images…" : isEditing ? "Save" : "Create"}
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{isEditing ? "Edit set" : "Create a new flashcard set"}</h1>
        {saveButton}
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <input
          value={editor.title}
          onChange={(event) => editor.setTitle(event.target.value)}
          placeholder='Enter a title, like "Fruits"'
          className="rounded-lg bg-white px-4 py-3 text-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800"
        />
        <textarea
          value={editor.description}
          onChange={(event) => editor.setDescription(event.target.value)}
          placeholder="Add a description…"
          rows={2}
          className="rounded-lg bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800"
        />
      </div>

      <BulkImageDropzone onFilesSelected={editor.addCardsFromImages} />

      <ol className="flex flex-col gap-4">
        {editor.rows.map((row, index) => (
          <CardRowEditor
            key={row.rowId}
            row={row}
            cardNumber={index + 1}
            isFirst={index === 0}
            isLast={index === editor.rows.length - 1}
            onWordChange={(word) => editor.updateRow(row.rowId, { word })}
            onImageSelected={(file) => void editor.uploadImageForRow(row.rowId, file)}
            onImageRemove={() => editor.removeImageFromRow(row.rowId)}
            onMove={(direction) => editor.moveRow(row.rowId, direction)}
            onDelete={() => editor.removeRow(row.rowId)}
          />
        ))}
      </ol>

      <button
        type="button"
        onClick={editor.addEmptyRow}
        className="rounded-xl bg-white py-6 font-semibold tracking-wide text-slate-600 shadow-sm hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300"
      >
        + ADD CARD
      </button>

      <div className="flex justify-end">{saveButton}</div>
    </div>
  );
}
