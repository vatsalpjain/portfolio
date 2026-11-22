// Fetches everything the site needs from GitHub in ONE GraphQL request, once per build.
// Decisions 0003 (projects), 0004 (no backend), 0007 (pipeline & failure behaviour).

import { readFile } from "node:fs/promises";
import { parse as parseYaml } from "yaml";
import { getToken, graphql } from "./client";
import { sampleData } from "./sample";
import { extractSummary } from "./summary";
import type {
  ContributionCalendar,
  ContributionDay,
  GitHubData,
  Project,
} from "./types";

const QUERY = /* GraphQL */ `
  query PortfolioData($login: String!, $search: String!) {
    user(login: $login) {
      contributionsCollection {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
    search(query: $search, type: REPOSITORY, first: 100) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          stargazerCount
          createdAt
          pushedAt
          isPrivate
          isFork
          primaryLanguage {
            name
          }
          readmeUpper: object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
          readmeLower: object(expression: "HEAD:readme.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;

interface QueryResult {
  user: {
    contributionsCollection: {
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            date: string;
            contributionCount: number;
            contributionLevel:
              | "NONE"
              | "FIRST_QUARTILE"
              | "SECOND_QUARTILE"
              | "THIRD_QUARTILE"
              | "FOURTH_QUARTILE";
          }[];
        }[];
      };
    };
  } | null;
  search: {
    nodes: (RepoNode | Record<string, never>)[];
  };
}

interface RepoNode {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  createdAt: string;
  pushedAt: string;
  isPrivate: boolean;
  isFork: boolean;
  primaryLanguage: { name: string } | null;
  readmeUpper: { text: string | null } | null;
  readmeLower: { text: string | null } | null;
}

interface Override {
  name: string;
  hide?: boolean;
  description?: string;
  summary?: string;
}

const LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

let cached: Promise<GitHubData> | undefined;

/** Memoised: both content loaders share a single API call per build. */
export function getGitHubData(
  login: string,
  topic: string,
  log: (msg: string) => void = console.log,
): Promise<GitHubData> {
  cached ??= load(login, topic, log);
  return cached;
}

async function load(
  login: string,
  topic: string,
  log: (msg: string) => void,
): Promise<GitHubData> {
  const token = getToken();

  if (!token) {
    if (process.env.CI) {
      // Fail loudly in CI: a failed build never replaces the live site (decision 0007).
      throw new Error(
        "GH_DATA_TOKEN is not set. Refusing to build the live site from sample data.",
      );
    }
    log(
      "GH_DATA_TOKEN not set: using local sample data (this never ships to production).",
    );
    return applyOverrides(sampleData(), await readOverrides());
  }

  const result = await graphql<QueryResult>(
    QUERY,
    { login, search: `user:${login} topic:${topic} fork:false is:public` },
    token,
  );

  if (!result.user) throw new Error(`GitHub user "${login}" not found.`);

  const projects: Project[] = result.search.nodes
    .filter((n): n is RepoNode => "name" in n)
    .filter((r) => !r.isPrivate && !r.isFork)
    .map((r) => ({
      name: r.name,
      description: r.description?.trim() ?? "",
      summary: extractSummary(r.readmeUpper?.text ?? r.readmeLower?.text),
      url: r.url,
      homepage: r.homepageUrl?.trim() || undefined,
      language: r.primaryLanguage?.name,
      stars: r.stargazerCount,
      createdAt: r.createdAt,
      pushedAt: r.pushedAt,
    }));

  const coll = result.user.contributionsCollection;
  const calendar: ContributionCalendar = {
    total: coll.contributionCalendar.totalContributions,
    privateCount: coll.restrictedContributionsCount,
    weeks: coll.contributionCalendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
    ),
  };

  log(
    `GitHub: ${projects.length} project(s) tagged "${topic}", ${calendar.total} contributions in the last year.`,
  );
  return applyOverrides(
    { projects, calendar, sample: false },
    await readOverrides(),
  );
}

async function readOverrides(): Promise<Override[]> {
  try {
    const raw = await readFile("src/content/projects.yaml", "utf8");
    const parsed = parseYaml(raw) as unknown;
    if (parsed == null) return [];
    if (!Array.isArray(parsed)) {
      throw new Error("src/content/projects.yaml must be a list.");
    }
    return parsed.map((o, i) => {
      if (!o || typeof o.name !== "string") {
        throw new Error(
          `src/content/projects.yaml item ${i + 1} needs a "name".`,
        );
      }
      return o as Override;
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

function applyOverrides(data: GitHubData, overrides: Override[]): GitHubData {
  const byName = new Map(overrides.map((o) => [o.name.toLowerCase(), o]));
  const projects = data.projects
    .filter((p) => !byName.get(p.name.toLowerCase())?.hide)
    .map((p) => {
      const o = byName.get(p.name.toLowerCase());
      return o
        ? {
            ...p,
            description: o.description ?? p.description,
            summary: o.summary ?? p.summary,
          }
        : p;
    });
  return { ...data, projects };
}
