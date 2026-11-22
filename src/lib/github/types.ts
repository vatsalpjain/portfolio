// Shapes of the GitHub data used by the site (decision 0003, 0007).

export interface Project {
  name: string;
  description: string;
  /** Plain-text summary from the README (or an override). Never HTML. */
  summary: string;
  url: string;
  /** Live demo URL, only if the repo sets one. */
  homepage?: string;
  language?: string;
  stars: number;
  createdAt: string; // ISO date
  pushedAt: string; // ISO date
}

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  /** Total in the last year, including private counts if the profile setting is on. */
  total: number;
  /** How many of `total` came from private repositories. */
  privateCount: number;
  /** Columns of 7 days (Sunday first), oldest week first. */
  weeks: ContributionDay[][];
}

export interface GitHubData {
  projects: Project[];
  calendar: ContributionCalendar;
  /** True when built from local sample data instead of the GitHub API. */
  sample: boolean;
}
