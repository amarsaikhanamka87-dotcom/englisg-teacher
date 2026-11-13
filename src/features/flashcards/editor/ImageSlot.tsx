"use client";

import { useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES } from "@/features/image-upload/image-upload.schema";

type ImageSlotProps = {
  imageUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
};

export function ImageSlot({ imageUrl, isUploading, uploadError, onFileSelected, onRemove }: ImageSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        role="button"
        tabIndex={0}
        aria-label={imageUrl ? "Replace image" : "Add image (click, drop or paste)"}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
        }}
        onPaste={(event) => handleFiles(event.clipboardData.files)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed text-center text-xs transition ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
            : "border-slate-300 hover:border-indigo-400 dark:border-slate-600"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-slate-500">
            🖼️
            <br />
            Image
          </span>
        )}
        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-slate-700 dark:bg-black/60 dark:text-slate-200">
            Uploading…
          </span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {imageUrl && !isUploading && (
        <button type="button" onClick={onRemove} className="text-xs text-slate-500 hover:text-red-600">
          Remove image
        </button>
      )}
      {uploadError && <p className="max-w-28 text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
