"use client";

import type { EditorCardRow } from "./use-set-editor";
import { ImageSlot } from "./ImageSlot";

type CardRowEditorProps = {
  row: EditorCardRow;
  cardNumber: number;
  isFirst: boolean;
  isLast: boolean;
  onWordChange: (word: string) => void;
  onImageSelected: (file: File) => void;
  onImageRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
};

export function CardRowEditor({
  row,
  cardNumber,
  isFirst,
  isLast,
  onWordChange,
  onImageSelected,
  onImageRemove,
  onMove,
  onDelete,
}: CardRowEditorProps) {
  return (
    <li className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-sm text-slate-500 dark:border-slate-700">
        <span className="font-semibold">{cardNumber}</span>
        <div className="flex gap-1">
          <IconButton label="Move up" disabled={isFirst} onClick={() => onMove(-1)}>↑</IconButton>
          <IconButton label="Move down" disabled={isLast} onClick={() => onMove(1)}>↓</IconButton>
          <IconButton label="Delete card" onClick={onDelete}>🗑</IconButton>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        <ImageSlot
          imageUrl={row.imageUrl}
          isUploading={row.isUploading}
          uploadError={row.uploadError}
          onFileSelected={onImageSelected}
          onRemove={onImageRemove}
        />
        <label className="flex flex-1 flex-col gap-1">
          <input
            value={row.word}
            onChange={(event) => onWordChange(event.target.value)}
            placeholder="Enter word"
            className="border-b-2 border-slate-300 bg-transparent py-2 text-lg outline-none focus:border-indigo-500 dark:border-slate-600"
          />
          <span className="text-xs uppercase tracking-wide text-slate-500">Word</span>
        </label>
      </div>
    </li>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
    >
      {children}
    </button>
  );
}
