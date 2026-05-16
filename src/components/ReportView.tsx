import type { Assessment } from "@/lib/schema";
import { TriageBadge } from "./TriageBadge";
import { SummaryCard } from "./SummaryCard";
import { FlagCard } from "./FlagCard";

export function ReportView({
  assessment,
  filename,
}: {
  assessment: Assessment;
  filename: string;
}) {
  const hasFlags = assessment.flags.length > 0;

  return (
    <section aria-label="Assessment report" className="space-y-4">
      <TriageBadge triage={assessment.triage} />

      <p className="text-sm text-muted">
        Recommendation only. Human sign-off required.
      </p>

      <SummaryCard assessment={assessment} filename={filename} />

      {hasFlags ? (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Flags ({assessment.flags.length})
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {assessment.flags.map((flag, i) => (
              <FlagCard key={`${flag.clause}-${i}`} flag={flag} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-foreground font-medium">
            No flagged clauses.
          </p>
          <p className="mt-1 text-sm text-muted">
            The contract matches the playbook positions without deviation.
          </p>
        </div>
      )}
    </section>
  );
}
