@AGENTS.md

# First Read — project notes

Single page web portal for AI-assisted commercial contract triage. Built as a
job application submission for the PortSwigger AI Pioneer role. The product
name is **First Read**.

## Stack

- Next.js 16 (App Router, src dir, TypeScript)
- Tailwind v4
- Anthropic SDK (`@anthropic-ai/sdk`)
- Zod for response validation
- No PDF parsing library — Claude reads the PDF natively as a base64 document
  block

## Key conventions

- **Next.js 16:** middleware is now `proxy.ts` with a `proxy` export, not
  `middleware`. `cookies()` and `headers()` are async.
- **British English** throughout UI copy. Do not use em-dashes as punctuation.
- **Playbook** lives at `/playbook.md` in the repo root. Read fresh from disk
  on every request so swapping it requires no redeploy.
- **Auth:** shared password gate. Cookie value is HMAC(password, APP_SECRET),
  HttpOnly + Secure + SameSite=Lax.
- **Logging:** metadata only (filename, triage decision, model, timestamp,
  latency). Never log contract contents or the full model response.

## Required env vars

`ANTHROPIC_API_KEY`, `APP_PASSWORD`, `APP_SECRET`. Optional: `MODEL` (defaults
to `claude-sonnet-4-6`).
