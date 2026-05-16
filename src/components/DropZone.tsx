"use client";

import { useState } from "react";

export function DropZone({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const [over, setOver] = useState(false);

  function takeFirst(files: FileList | null) {
    if (disabled) return;
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        takeFirst(e.dataTransfer.files);
      }}
      className={[
        "rounded-2xl border-2 border-dashed transition px-8 py-16 text-center",
        over
          ? "border-accent bg-accent-soft"
          : "border-border bg-card hover:bg-accent-soft/40",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    >
      <p className="text-foreground font-medium text-lg">
        Drop a contract PDF here
      </p>
      <p className="mt-1 text-sm text-muted">
        Up to 10 MB and 50 pages. PDF only for now.
      </p>

      <label className="mt-6 inline-block">
        <span className="cursor-pointer rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-soft">
          Or browse to choose a file
        </span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            takeFirst(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
