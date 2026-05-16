import { z } from "zod";

export const TriageSchema = z.enum([
  "auto_approve",
  "light_touch",
  "full_review",
]);
export type Triage = z.infer<typeof TriageSchema>;

export const SeveritySchema = z.enum(["standard", "minor", "material"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const FlagSchema = z.object({
  clause: z.string().min(1),
  severity: SeveritySchema,
  confidence: ConfidenceSchema,
  issue: z.string().min(1),
  playbook_reference: z.string().min(1),
  suggested_redline: z.string().nullable(),
});
export type Flag = z.infer<typeof FlagSchema>;

// What the model is asked to return.
export const ModelOutputSchema = z.object({
  triage: TriageSchema,
  contract_type: z.string().min(1),
  summary: z.string().min(1),
  flags: z.array(FlagSchema),
  notes: z.string().nullable(),
});
export type ModelOutput = z.infer<typeof ModelOutputSchema>;

// What the API returns to the client (model output plus server-stamped fields).
export const AssessmentSchema = ModelOutputSchema.extend({
  assessed_at: z.string(),
  model: z.string(),
});
export type Assessment = z.infer<typeof AssessmentSchema>;
