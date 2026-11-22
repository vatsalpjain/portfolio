// Local sample data so the site runs without a GitHub token (decision 0007).
// Only used in local development. CI refuses to build without real data.

import type { ContributionDay, GitHubData } from "./types";

export function sampleData(): GitHubData {
  return {
    sample: true,
    projects: [
      {
        name: "WhyyTorch",
        description:
          "Wanted to understand the core working of PyTorch, so to remove the abstraction, I built a similar one.",
        summary:
          "Sample summary: a small PyTorch-like library built from scratch, working up from an MLP through bigram, WaveNet, CNN, RNN and LSTM models to a Transformer.",
        url: "https://github.com/vatsalpjain/WhyyTorch",
        language: "Python",
        stars: 0,
        createdAt: "2026-03-01T00:00:00Z",
        pushedAt: "2026-11-01T00:00:00Z",
      },
      {
        name: "sample-project",
        description:
          "Placeholder row shown only in local development without a token.",
        summary:
          "This entry is sample data. It never appears on the live site, which is built from real GitHub data.",
        url: "https://github.com/vatsalpjain",
        stars: 0,
        createdAt: "2025-08-01T00:00:00Z",
        pushedAt: "2026-06-01T00:00:00Z",
      },
    ],
    calendar: sampleCalendar(),
  };
}

/** A deterministic, made-up calendar covering the last 53 weeks. */
function sampleCalendar(): GitHubData["calendar"] {
  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());

  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const weeks: ContributionDay[][] = [];
  let total = 0;
  const d = new Date(start);
  while (d <= today) {
    const week: ContributionDay[] = [];
    for (let i = 0; i < 7 && d <= today; i++) {
      const r = rand();
      const count = r < 0.45 ? 0 : Math.floor(r * r * 9);
      const level = (
        count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4
      ) as ContributionDay["level"];
      week.push({ date: d.toISOString().slice(0, 10), count, level });
      total += count;
      d.setUTCDate(d.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return { total, privateCount: Math.round(total * 0.3), weeks };
}
