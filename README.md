# First Read

AI-assisted triage for commercial contract review. Drop a PDF, get a verdict
against your playbook in under ten seconds.

First Read is a single-page web portal aimed at small in-house legal teams who
are overwhelmed by low-stakes commercial contracts (NDAs, order forms, short
MSAs). It compares each contract to a defined legal playbook and returns one
of three triage recommendations:

- **Auto-approve recommended.** Matches the standard template. No material
  deviations.
- **Light-touch review.** Minor deviations only. A quick human check is enough.
- **Full review required.** Material deviations or out-of-scope content. Send
  to a lawyer.

The recommendation is always a triage decision, never a legal opinion. A
qualified human signs off on every contract.

## How it works

1. The user signs in with a shared password.
2. They drop a contract PDF onto the page and click **Assess**.
3. The PDF is sent to the Anthropic Claude API as a base64 document block,
   together with a system prompt assembled from `playbook.md`.
4. The model returns a structured JSON report.
5. The page renders a colour-coded verdict, a plain-English summary, and one
   card per flagged clause.

No PDF parsing library is used. Claude reads the PDF natively. Temperature is
fixed at 0 for consistent output. Prompt caching is enabled on the system
prompt so repeated assessments within five minutes are cheaper and faster.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Anthropic SDK
- Zod for response validation

## Running locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY, APP_PASSWORD, APP_SECRET.
npm run dev
```

Open <http://localhost:3000>, enter the password, drop a contract PDF.

### Environment variables

| Name                | Required | Description                                                                 |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | yes      | Server-side only. Never exposed to the client.                              |
| `APP_PASSWORD`      | yes      | Shared password the panel uses to access the portal.                        |
| `APP_SECRET`        | yes      | Long random string used to sign the auth cookie. Rotating it signs people out. |
| `MODEL`             | no       | Defaults to `claude-sonnet-4-6`.                                            |

Generate a secret with:

```bash
openssl rand -hex 32
```

## Deploying to Railway

Railway auto-detects Next.js and uses Nixpacks. There is no `railway.toml`
needed.

1. Create a new project on Railway and connect this GitHub repository.
2. In the project settings, set the three required environment variables.
3. Railway will build and deploy on every push to the configured branch.

By default the start command is `npm start`. The build command is `npm run
build`. Both are inferred from `package.json`.

### Notes for production

- The cookie is set with `Secure` whenever `NODE_ENV === "production"`. Railway
  serves HTTPS, so this is the right default.
- Logs on Railway include filename, triage decision, flag count, model,
  timestamp, and latency. Contract contents and full model responses are never
  logged.

## The playbook

`playbook.md` lives at the repo root. The backend reads it fresh on every
request, so swapping the file out does not require a redeploy. The shipped
file is a short placeholder. Replace it with the real playbook before going
live.

## Limits and known gaps

- **PDF only.** `.docx` is a known future requirement. Users get a clear
  message when uploading anything else.
- **10 MB and 50 pages per file.** Limits sit well under the Anthropic
  document block caps. The client side estimates page count via a regex on
  the PDF byte stream and falls back silently when the estimate is unreliable.
- **One file at a time.** The API and UI are shaped so that batching is a
  later UI change only.
- **Shared password.** Not a full identity system. Adequate for an internal
  demo, not for multi-tenant use.

## Tests

There is no automated test suite. The build, type check, and a manual smoke
test on the deployed URL are the verification path for this version.

## Licence

Built as a job application submission. Not licensed for redistribution.
