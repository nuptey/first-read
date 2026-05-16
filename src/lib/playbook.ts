import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readPlaybook(): Promise<string> {
  const playbookPath = path.join(process.cwd(), "playbook.md");
  let content: string;
  try {
    content = await readFile(playbookPath, "utf-8");
  } catch {
    throw new Error(
      "playbook.md was not found at the repo root. The portal cannot run without it.",
    );
  }
  if (!content.trim()) {
    throw new Error("playbook.md is empty.");
  }
  return content;
}
