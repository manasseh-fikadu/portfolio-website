const redirectMap: Record<string, string> = {
  github$: "https://github.com/manasseh-fikadu",
  linkedin: "https://www.linkedin.com/in/minase-fikadu/",
  email: "mailto:minasefikaduwm@proton.me",
  upwork: "https://www.upwork.com/freelancers/~012ac90b612e6f234d",
};

redirectMap.gh$ = redirectMap.github$;
redirectMap.bluesky = redirectMap.bsky;
redirectMap.x = redirectMap.twitter;
redirectMap.mal = redirectMap.myanimelist;

const socials: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  upwork: "Upwork",
};

export { redirectMap, socials };
