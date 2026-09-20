export type Contribution = {
  date: string;
  count: number;
  level: number;
};

export type GitHubActivityData = {
  contributions: Contribution[];
};

export const githubUsername = "manasseh-fikadu";

// Pad the first week instead of discarding contributions before the first Sunday.
export function calendarWeeks(contributions: Contribution[]): (Contribution | null)[][] {
  if (!contributions.length) return [];
  const offset = new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay();
  const days: (Contribution | null)[] = [...Array<null>(offset).fill(null), ...contributions];
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(Array.from({ length: 7 }, (_, day) => days[index + day] ?? null));
  }
  return weeks;
}

export function activityStats(contributions: Contribution[]) {
  let total = 0;
  let activeDays = 0;
  let streak = 0;
  let longestStreak = 0;
  for (const day of contributions) {
    total += day.count;
    if (day.count > 0) {
      activeDays++;
      longestStreak = Math.max(longestStreak, ++streak);
    } else {
      streak = 0;
    }
  }
  return { total, activeDays, longestStreak };
}
