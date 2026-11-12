import type { ServerLoad } from "@sveltejs/kit";
import experiences from "../lib/experiences.json";

type Writing = {
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
};

type Rss2JsonResponse = {
  status: string;
  items: { title: string; description: string; link: string; content: string; thumbnail?: string }[];
};

export const load: ServerLoad = async () => {
  // Fetch Medium posts for writings
  const mediumUsername = "@minasesotlg"; // Replace with your actual Medium username if needed
  let writings: Writing[] = [];
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`,
    );
    if (response.ok) {
      const data = (await response.json()) as Rss2JsonResponse;
      if (data.status === "ok") {
        writings = data.items.map((item) => {
          // Extract image from content if thumbnail is missing
          let thumbnail = item.thumbnail;
          if (!thumbnail || thumbnail === "") {
            const imgRegex = /<img[^>]+src="([^"]+)"/g;
            const match = imgRegex.exec(item.content);
            if (match && match[1]) {
              thumbnail = match[1];
            }
          }
          return {
            title: item.title,
            description: item.description.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
            url: item.link,
            thumbnail,
          };
        });
      }
    }
  } catch {
    // If fetch fails, fallback to empty writings
    writings = [];
  }

  return { writings, experiences };
};
