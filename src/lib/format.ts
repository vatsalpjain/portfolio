// Date formatting in one place, always in UTC so builds are reproducible.

const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatMonthYear = (d: Date) => monthYear.format(d);
export const formatDate = (d: Date) => fullDate.format(d);
export const formatShortDate = (d: Date) => shortDate.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Rough reading time at ~220 words per minute. */
export function readingTime(text: string | undefined): string {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
