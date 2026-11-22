// Content collections (decisions 0002, 0003, 0006).
// A mistake in front matter fails the build with a clear message instead of breaking a page.

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { site } from "./site.config";
import {
  githubContributionsLoader,
  githubProjectsLoader,
} from "./lib/github/loaders";

/** The Home page text: one Markdown file, plain prose. */
const home = defineCollection({
  loader: glob({ pattern: "home.md", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    /** Short italic line at the top of Home. */
    tagline: z.string(),
    /** Optional "Currently …" status pill. Only fill in when it's true right now. */
    now: z.string().optional(),
  }),
});

/** Blog posts: one .md (or .mdx when a component is needed) per post. */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: githubProjectsLoader(site.github),
});

const contributions = defineCollection({
  loader: githubContributionsLoader(site.github),
});

export const collections = { home, blog, projects, contributions };
