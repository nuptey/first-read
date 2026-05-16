import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AssessmentError, assessContract } from "@/lib/anthropic";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, mirrors client-side limit

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  let filename = "unknown.pdf";

  try {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Expected a multipart upload with a 'file' field." },
        { status: 400 },
      );
    }
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file was uploaded. Please attach a PDF." },
        { status: 400 },
      );
    }

    filename = file.name || "unknown.pdf";

    const isPdf =
      file.type === "application/pdf" ||
      filename.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are supported at the moment." },
        { status: 415 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "The PDF is larger than 10 MB. Please split the document." },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfBase64 = buffer.toString("base64");

    const result = await assessContract({ pdfBase64 });

    // Metadata only. Never log contract contents or full model response.
    console.log(
      JSON.stringify({
        event: "assessment",
        filename,
        triage: result.triage,
        flags: result.flags.length,
        model: result.model,
        assessed_at: result.assessed_at,
        latency_ms: Date.now() - startedAt,
      }),
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AssessmentError) {
      console.log(
        JSON.stringify({
          event: "assessment_error",
          filename,
          status: err.status,
          error: err.userMessage,
          latency_ms: Date.now() - startedAt,
        }),
      );
      return NextResponse.json(
        { error: err.userMessage },
        { status: err.status },
      );
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    console.log(
      JSON.stringify({
        event: "assessment_error",
        filename,
        status: 500,
        error: message,
        latency_ms: Date.now() - startedAt,
      }),
    );
    return NextResponse.json(
      { error: "Assessment failed. Please try again." },
      { status: 500 },
    );
  }
}
