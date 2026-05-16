"use client";

export function ErrorState({
  message,
  onRetry,
  retryLabel = "Try again",
}: {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-triage-full/40 bg-triage-full-soft p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-triage-full">
        Something went wrong
      </p>
      <p className="mt-2 text-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-triage-full/40 bg-white px-4 py-2 text-sm font-medium text-triage-full transition hover:bg-white/60"
      >
        {retryLabel}
      </button>
    </div>
  );
}
