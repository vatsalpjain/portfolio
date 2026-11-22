// Turns a README into a short, plain-text summary (decision 0007).
// Uses the "## Summary" section if present, otherwise the first prose paragraph.
// Output is always plain text: no HTML, images, badges, or link markup survive.

const MAX_LENGTH = 300;

export function extractSummary(readme: string | undefined | null): string {
  if (!readme) return "";

  const text = readme
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "") // HTML comments
    .replace(/```[\s\S]*?```/g, "") // fenced code blocks
    .replace(/<[^>]+>/g, ""); // any HTML tags

  const section = findSummarySection(text);
  const raw = section ?? firstParagraph(text);
  return truncate(cleanInline(raw), MAX_LENGTH);
}

function findSummarySection(text: string): string | null {
  const match = /^#{1,6}\s*summary\s*#*\s*$/im.exec(text);
  if (!match) return null;
  const rest = text.slice(match.index + match[0].length);
  const next = /^#{1,6}\s/m.exec(rest);
  const body = (next ? rest.slice(0, next.index) : rest).trim();
  return body || null;
}

function firstParagraph(text: string): string {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim());
  for (const block of blocks) {
    if (!block) continue;
    if (/^#{1,6}\s/.test(block)) continue; // heading
    if (/^(\[?!\[)/.test(block)) continue; // images / badges
    if (/^[|>*+-]|^\d+\.\s/.test(block)) continue; // tables, quotes, lists
    const cleaned = cleanInline(block);
    if (cleaned.length < 20) continue; // too short to be a summary
    return block;
  }
  return "";
}

function cleanInline(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1") // reference links → text
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(^|\W)(\*|_)(\S(?:.*?\S)?)\2(?=\W|$)/g, "$1$3") // italic (keeps snake_case intact)
    .replace(/^#{1,6}\s+/gm, "") // stray heading marks
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).replace(/[\s,;:.]+$/, "")}…`;
}
