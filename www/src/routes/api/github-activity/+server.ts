import { json } from "@sveltejs/kit";
import { githubUsername, type Contribution, type GitHubActivityData } from "$lib/github-activity";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch }) => {
  // Public data only. No GitHub token is needed or sent to the browser.
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Calendar unavailable");
    const calendar = await response.json();
    if (!Array.isArray(calendar.contributions) || !calendar.contributions.length) {
      throw new Error("Calendar unavailable");
    }

    const data: GitHubActivityData = { contributions: calendar.contributions as Contribution[] };
    return json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return json(
      { message: "GitHub activity is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
