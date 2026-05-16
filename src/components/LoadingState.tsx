import { Spinner } from "./Spinner";

export function LoadingState({ filename }: { filename: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <div className="inline-flex items-center gap-3">
        <Spinner />
        <p className="font-medium text-foreground">
          Assessing <span className="font-semibold">{filename}</span>
        </p>
      </div>
      <p className="mt-3 text-sm text-muted">
        Reading the contract and comparing it to the playbook. This usually
        takes around five to ten seconds.
      </p>
    </div>
  );
}
