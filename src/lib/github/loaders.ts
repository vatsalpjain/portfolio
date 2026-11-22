// Astro content loaders: GitHub data becomes collections, just like local Markdown (decision 0006).

import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { getGitHubData } from "./data";

interface Options {
  username: string;
  topic: string;
}

export const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  summary: z.string(),
  url: z.url(),
  homepage: z.url().optional(),
  language: z.string().optional(),
  stars: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  pushedAt: z.coerce.date(),
  sample: z.boolean(),
});

export const calendarSchema = z.object({
  total: z.number().int().nonnegative(),
  privateCount: z.number().int().nonnegative(),
  weeks: z.array(
    z.array(
      z.object({
        date: z.string(),
        count: z.number().int().nonnegative(),
        level: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
        ]),
      }),
    ),
  ),
  sample: z.boolean(),
});

/** Public repos tagged with the portfolio topic. */
export function githubProjectsLoader(opts: Options) {
  return {
    name: "github-projects",
    schema: projectSchema,
    load: async ({ store, parseData, generateDigest, logger }) => {
      const gh = await getGitHubData(opts.username, opts.topic, (m) =>
        logger.info(m),
      );
      store.clear();
      for (const project of gh.projects) {
        const id = project.name.toLowerCase();
        const data = await parseData({
          id,
          data: { ...project, sample: gh.sample },
        });
        store.set({ id, data, digest: generateDigest(data) });
      }
    },
  } satisfies Loader;
}

/** The last-12-months contribution calendar, stored as a single entry "calendar". */
export function githubContributionsLoader(opts: Options) {
  return {
    name: "github-contributions",
    schema: calendarSchema,
    load: async ({ store, parseData, generateDigest, logger }) => {
      const gh = await getGitHubData(opts.username, opts.topic, (m) =>
        logger.info(m),
      );
      store.clear();
      const data = await parseData({
        id: "calendar",
        data: { ...gh.calendar, sample: gh.sample },
      });
      store.set({ id: "calendar", data, digest: generateDigest(data) });
    },
  } satisfies Loader;
}
