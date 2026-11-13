"use client";

import { useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES } from "@/features/image-upload/image-upload.schema";

type BulkImageDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

export function BulkImageDropzone({ onFilesSelected }: BulkImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    if (files.length > 0) onFilesSelected(files);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
        isDragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-slate-300 dark:border-slate-600"
      }`}
    >
      <p className="font-medium">Drop many images here to make a card for each</p>
      <p className="mt-1 text-sm text-slate-500">
        The file name becomes the word — <code>red_apple.jpg</code> → “red apple”
      </p>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        Choose images
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
