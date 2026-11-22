import { getCollection, type CollectionEntry } from "astro:content";

/** Published posts, newest first. Drafts are visible only in `astro dev`. */
export async function getPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection(
    "blog",
    (p) => import.meta.env.DEV || !p.data.draft,
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
