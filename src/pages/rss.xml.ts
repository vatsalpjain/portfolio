import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { site } from "../site.config";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${site.name}: Blog`,
    description: "Notes on what I'm building and learning.",
    site: context.site ?? "https://vatsaljain.pages.dev",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${site.locale}</language>`,
  });
}
