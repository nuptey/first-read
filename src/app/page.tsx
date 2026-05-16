export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-accent">
          First Read
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          AI-assisted triage for commercial contracts
        </h1>
        <p className="mt-4 text-muted">
          Drop a contract. Get a verdict. A clean recommendation against your
          playbook so the legal team only spends time on what matters.
        </p>
      </div>
    </main>
  );
}
