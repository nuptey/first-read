import type { Assessment } from "@/lib/schema";

export function SummaryCard({
  assessment,
  filename,
}: {
  assessment: Assessment;
  filename: string;
}) {
  const formatted = formatDate(assessment.assessed_at);
  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {assessment.contract_type}
        </p>
        <p
          className="truncate text-xs text-muted"
          title={filename}
        >
          {filename}
        </p>
      </div>
      <p className="mt-3 text-base leading-relaxed text-foreground/90">
        {assessment.summary}
      </p>
      {assessment.notes ? (
        <p className="mt-4 rounded-lg bg-accent-soft px-4 py-3 text-sm text-foreground/80">
          <span className="font-medium text-accent">Note: </span>
          {assessment.notes}
        </p>
      ) : null}
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
        <div>
          <dt className="font-medium uppercase tracking-wider text-muted">
            Assessed
          </dt>
          <dd className="mt-1 text-foreground/80">{formatted}</dd>
        </div>
        <div>
          <dt className="font-medium uppercase tracking-wider text-muted">
            Model
          </dt>
          <dd className="mt-1 text-foreground/80">{assessment.model}</dd>
        </div>
      </dl>
    </article>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
