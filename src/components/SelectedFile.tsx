"use client";

export function SelectedFile({
  file,
  onAssess,
  onClear,
}: {
  file: File;
  onAssess: () => void;
  onClear: () => void;
}) {
  const sizeMb = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Ready to assess
          </p>
          <p
            className="mt-1 truncate font-medium text-foreground"
            title={file.name}
          >
            {file.name}
          </p>
          <p className="mt-0.5 text-sm text-muted">{sizeMb} MB</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
        >
          Remove
        </button>
      </div>
      <button
        type="button"
        onClick={onAssess}
        className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Assess
      </button>
    </div>
  );
}
