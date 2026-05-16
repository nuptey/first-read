export const MAX_BYTES = 10 * 1024 * 1024;
export const MAX_PAGES = 50;

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export async function validatePdf(file: File): Promise<ValidationResult> {
  const looksLikePdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!looksLikePdf) {
    return {
      ok: false,
      message: "First Read accepts PDF files only at the moment.",
    };
  }

  if (file.size === 0) {
    return { ok: false, message: "The file appears to be empty." };
  }

  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      message: `The file is ${mb} MB. The limit is 10 MB. Please split the document.`,
    };
  }

  const buffer = await file.arrayBuffer();

  const headerBytes = new Uint8Array(buffer.slice(0, 8));
  const header = new TextDecoder("ascii").decode(headerBytes);
  if (!header.startsWith("%PDF-")) {
    return {
      ok: false,
      message: "The file does not appear to be a valid PDF.",
    };
  }

  const pageCount = countPages(buffer);
  if (pageCount !== null && pageCount > MAX_PAGES) {
    return {
      ok: false,
      message: `The document is ${pageCount} pages. The limit is ${MAX_PAGES} pages. Please split the document.`,
    };
  }

  return { ok: true };
}

// Best-effort page count by scanning the PDF byte stream for `/Type /Page`
// entries. Returns null when the count is implausible (zero or absurdly high),
// in which case the server-side limit acts as the safety net.
function countPages(buffer: ArrayBuffer): number | null {
  const text = new TextDecoder("latin1").decode(buffer);
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  if (!matches) return null;
  const count = matches.length;
  if (count === 0 || count > 10_000) return null;
  return count;
}
