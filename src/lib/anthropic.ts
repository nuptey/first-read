import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { ModelOutputSchema, type Assessment } from "./schema";
import { readPlaybook } from "./playbook";
import { buildSystemPrompt } from "./prompt";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 8192;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set.");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export class AssessmentError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly status: number,
    cause?: unknown,
  ) {
    super(userMessage);
    this.name = "AssessmentError";
    if (cause instanceof Error) this.cause = cause;
  }
}

export async function assessContract(args: {
  pdfBase64: string;
}): Promise<Assessment> {
  const playbook = await readPlaybook();
  const model = process.env.MODEL || DEFAULT_MODEL;
  const system = buildSystemPrompt(playbook);

  let response;
  try {
    response = await getClient().messages.create({
      model,
      max_tokens: MAX_TOKENS,
      temperature: 0,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: args.pdfBase64,
              },
            },
            {
              type: "text",
              text: "Triage this contract against the playbook. Return JSON only.",
            },
          ],
        },
      ],
    });
  } catch (err) {
    throw mapAnthropicError(err);
  }

  const textPart = response.content.find((c) => c.type === "text");
  if (!textPart || textPart.type !== "text") {
    throw new AssessmentError(
      "The model returned no readable output. Please try again.",
      502,
    );
  }

  const cleaned = stripFences(textPart.text.trim());

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AssessmentError(
      "The model returned malformed output. Please try again.",
      502,
    );
  }

  const validated = ModelOutputSchema.safeParse(parsed);
  if (!validated.success) {
    throw new AssessmentError(
      "The model output did not match the expected schema. Please try again.",
      502,
      validated.error,
    );
  }

  return {
    ...validated.data,
    model,
    assessed_at: new Date().toISOString(),
  };
}

function stripFences(s: string): string {
  if (!s.startsWith("```")) return s;
  return s
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function mapAnthropicError(err: unknown): AssessmentError {
  if (!(err instanceof APIError)) {
    return new AssessmentError(
      "Could not reach the assessment service. Please try again.",
      502,
      err,
    );
  }
  if (err.status === 401 || err.status === 403) {
    return new AssessmentError(
      "The portal is not configured correctly. Contact the administrator.",
      500,
      err,
    );
  }
  if (err.status === 429) {
    return new AssessmentError(
      "The assessment service is busy. Please try again in a moment.",
      429,
      err,
    );
  }
  if (err.status === 400) {
    const msg = err.message ?? "";
    if (/page/i.test(msg) || /document/i.test(msg)) {
      return new AssessmentError(
        "The PDF could not be processed. It may be too long, encrypted, or unreadable.",
        400,
        err,
      );
    }
    return new AssessmentError(
      "The request was rejected by the assessment service.",
      400,
      err,
    );
  }
  return new AssessmentError(
    "The assessment service returned an unexpected error. Please try again.",
    502,
    err,
  );
}
