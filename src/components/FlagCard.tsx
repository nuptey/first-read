import type { Flag, Severity } from "@/lib/schema";

const SEVERITY_TONE: Record<
  Severity,
  { label: string; chipBg: string; chipText: string; border: string }
> = {
  standard: {
    label: "Standard",
    chipBg: "bg-triage-approve-soft",
    chipText: "text-triage-approve",
    border: "border-border",
  },
  minor: {
    label: "Minor deviation",
    chipBg: "bg-triage-light-soft",
    chipText: "text-triage-light",
    border: "border-triage-light/30",
  },
  material: {
    label: "Material deviation",
    chipBg: "bg-triage-full-soft",
    chipText: "text-triage-full",
    border: "border-triage-full/30",
  },
};

export function FlagCard({ flag }: { flag: Flag }) {
  const tone = SEVERITY_TONE[flag.severity];
  return (
    <article
      className={`rounded-2xl border ${tone.border} bg-card p-5`}
      data-severity={flag.severity}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          {flag.clause}
        </h3>
        <span
          className={`shrink-0 rounded-full ${tone.chipBg} ${tone.chipText} px-2.5 py-1 text-xs font-medium`}
        >
          {tone.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {flag.issue}
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-muted">
            Playbook
          </dt>
          <dd className="mt-0.5 text-foreground/85">
            {flag.playbook_reference}
          </dd>
        </div>
        {flag.suggested_redline ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              Suggested redline
            </dt>
            <dd className="mt-0.5 italic text-foreground/85">
              &ldquo;{flag.suggested_redline}&rdquo;
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-4 text-xs text-muted">
        Confidence: <span className="font-medium">{flag.confidence}</span>
      </p>
    </article>
  );
}
