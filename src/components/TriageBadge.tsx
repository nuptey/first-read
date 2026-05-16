import type { Triage } from "@/lib/schema";

const COPY: Record<
  Triage,
  { label: string; tagline: string; tone: "approve" | "light" | "full" }
> = {
  auto_approve: {
    label: "Auto-approve recommended",
    tagline: "Matches the standard template. No material deviations.",
    tone: "approve",
  },
  light_touch: {
    label: "Light-touch review",
    tagline: "Minor deviations only. A quick human check is enough.",
    tone: "light",
  },
  full_review: {
    label: "Full review required",
    tagline: "Material deviations or out-of-scope content. Send to a lawyer.",
    tone: "full",
  },
};

const TONE: Record<
  "approve" | "light" | "full",
  { border: string; bg: string; text: string; dot: string }
> = {
  approve: {
    border: "border-triage-approve/30",
    bg: "bg-triage-approve-soft",
    text: "text-triage-approve",
    dot: "bg-triage-approve",
  },
  light: {
    border: "border-triage-light/30",
    bg: "bg-triage-light-soft",
    text: "text-triage-light",
    dot: "bg-triage-light",
  },
  full: {
    border: "border-triage-full/30",
    bg: "bg-triage-full-soft",
    text: "text-triage-full",
    dot: "bg-triage-full",
  },
};

export function TriageBadge({ triage }: { triage: Triage }) {
  const copy = COPY[triage];
  const tone = TONE[copy.tone];

  return (
    <div
      className={`rounded-2xl border ${tone.border} ${tone.bg} px-6 py-5`}
      data-triage={triage}
    >
      <div className="flex items-center gap-3">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone.dot}`} />
        <p className={`text-xs font-semibold uppercase tracking-wider ${tone.text}`}>
          Verdict
        </p>
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {copy.label}
      </p>
      <p className="mt-1 text-sm text-foreground/80">{copy.tagline}</p>
    </div>
  );
}
