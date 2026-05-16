"use client";

import { useState } from "react";
import { DropZone } from "@/components/DropZone";
import { SelectedFile } from "@/components/SelectedFile";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { ReportView } from "@/components/ReportView";
import { validatePdf } from "@/lib/pdf-validate";
import { AssessmentSchema, type Assessment } from "@/lib/schema";

type State =
  | { kind: "idle" }
  | { kind: "selected"; file: File }
  | { kind: "assessing"; file: File }
  | { kind: "result"; file: File; assessment: Assessment }
  | { kind: "error"; file?: File; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onFileSelected(file: File) {
    const v = await validatePdf(file);
    if (!v.ok) {
      setState({ kind: "error", message: v.message });
      return;
    }
    setState({ kind: "selected", file });
  }

  async function runAssessment(file: File) {
    setState({ kind: "assessing", file });
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/assess", { method: "POST", body: form });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          (data && typeof data.error === "string" && data.error) ||
          "Assessment failed. Please try again.";
        setState({ kind: "error", file, message });
        return;
      }

      const parsed = AssessmentSchema.safeParse(data);
      if (!parsed.success) {
        setState({
          kind: "error",
          file,
          message: "The server returned an unexpected response.",
        });
        return;
      }
      setState({ kind: "result", file, assessment: parsed.data });
    } catch {
      setState({
        kind: "error",
        file,
        message: "Could not reach the server. Please try again.",
      });
    }
  }

  function reset() {
    setState({ kind: "idle" });
  }

  function onRetry() {
    if (state.kind === "error" && state.file) {
      runAssessment(state.file);
    } else {
      reset();
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 pt-10 pb-6 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-accent">
            First Read
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            AI-assisted triage for commercial contracts
          </h1>
          <p className="mt-2 text-muted">
            Drop a contract. Get a verdict against your playbook in under ten
            seconds.
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="mx-auto max-w-3xl space-y-6">
          {state.kind === "idle" ? (
            <DropZone onFileSelected={onFileSelected} />
          ) : null}

          {state.kind === "selected" ? (
            <SelectedFile
              file={state.file}
              onAssess={() => runAssessment(state.file)}
              onClear={reset}
            />
          ) : null}

          {state.kind === "assessing" ? (
            <LoadingState filename={state.file.name} />
          ) : null}

          {state.kind === "result" ? (
            <>
              <ReportView
                assessment={state.assessment}
                filename={state.file.name}
              />
              <div className="pt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-soft"
                >
                  Assess another contract
                </button>
              </div>
            </>
          ) : null}

          {state.kind === "error" ? (
            <ErrorState message={state.message} onRetry={onRetry} />
          ) : null}
        </div>
      </main>

      <footer className="border-t border-border bg-card/40 px-6 py-5 text-center text-xs text-muted">
        First Read provides a triage recommendation only. A qualified human
        must always sign off.
      </footer>
    </div>
  );
}
