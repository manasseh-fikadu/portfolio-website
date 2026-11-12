export type LinkKind = "live" | "code" | "ios" | "android";

export type ProjectLink = { kind: LinkKind; href: string; label?: string };

export type Product = {
  name: string;
  description: string;
  links: ProjectLink[];
};

export type Project = {
  title: string;
  description: string;
  links: ProjectLink[];
  products?: Product[];
};

export const linkLabels: Record<LinkKind, string> = {
  live: "Live",
  code: "Code",
  ios: "App Store",
  android: "Google Play",
};

export const featured: Project[] = [
  {
    title: "Bield",
    description: "A self-hosted control plane for every machine on your tailnet. One binary, no accounts.",
    links: [
      { kind: "live", href: "https://manasseh-fikadu.github.io/bield/" },
      { kind: "code", href: "https://github.com/manasseh-fikadu/bield" },
    ],
  },
  {
    title: "Entrust Platform",
    description:
      "One codebase for Entrust Africa's SME platforms: TRADE for export capability, MIZAN for financial readiness and CLEAR for export compliance, plus the entrust-africa.com website.",
    links: [{ kind: "live", href: "https://entrust-africa.com" }],
  },
  {
    title: "AfriConnect",
    description:
      "The trade execution intelligence layer for Africa: AfCFTA compliance, cross-border deals, payments, shipping and business tools in one platform.",
    links: [],
    products: [
      {
        name: "Web",
        description: "Marketplace, compliance checks and the AfCFTA assistant.",
        links: [{ kind: "live", href: "https://africonnect.africa.com" }],
      },
      {
        name: "Mobile",
        description: "iOS and Android app on the same backend.",
        links: [
          { kind: "ios", href: "https://apps.apple.com/us/app/africonnect-b2b/id6783799323" },
          { kind: "android", href: "https://play.google.com/store/apps/details?id=com.africonnect.mobile" },
        ],
      },
    ],
  },
  {
    title: "Gradients.io",
    description: "A decentralized AI training platform on Bittensor built around the idea that anyone can train AI.",
    links: [{ kind: "live", href: "https://gradients.io" }],
  },
  {
    title: "Careit",
    description: "A food donation and rescue platform that helps businesses share surplus food with local nonprofits.",
    links: [],
    products: [
      {
        name: "Website",
        description: "careit.com, for businesses and nonprofits.",
        links: [{ kind: "live", href: "https://careit.com" }],
      },
      {
        name: "Careit",
        description: "Matches donors with extra food to nearby nonprofits.",
        links: [
          { kind: "ios", href: "https://apps.apple.com/us/app/careit-food-donation-rescue/id1574145523" },
          { kind: "android", href: "https://play.google.com/store/apps/details?id=com.careit.careitapp" },
        ],
      },
      {
        name: "FreshCue",
        description: "Free leftover food happening near campus, for students.",
        links: [
          { kind: "ios", href: "https://apps.apple.com/us/app/freshcue-food/id6755314132" },
          { kind: "android", href: "https://play.google.com/store/apps/details?id=app.freshcue.freshcue" },
        ],
      },
    ],
  },
  {
    title: "QuickSync",
    description: "A very robust web app that enables users to sync their inventory, products and orders in real time.",
    links: [{ kind: "live", href: "https://quicksync.pro" }],
  },
  {
    title: "AiQEM",
    description: "An AI based advertisement enhancement platform.",
    links: [],
  },
];

export const more: Project[] = [
  {
    title: "Stroke Prediction",
    description: "A machine learning app to predict stroke risk.",
    links: [
      { kind: "live", href: "https://stroke-backend.vercel.app/" },
      { kind: "code", href: "https://github.com/manasseh-fikadu/stroke-backend" },
    ],
  },
  {
    title: "Loan Approval Prediction",
    description: "A machine learning app to predict loan approval risk.",
    links: [
      { kind: "live", href: "https://loan-prediction-051v.onrender.com/" },
      { kind: "code", href: "https://github.com/manasseh-fikadu/loan_prediction" },
    ],
  },
  {
    title: "Home Credit Default Risk",
    description: "A machine learning app to predict home credit default risk.",
    links: [
      { kind: "live", href: "https://home-credit-gradio.onrender.com/" },
      { kind: "code", href: "https://github.com/manasseh-fikadu/Home_Credit_Gradio" },
    ],
  },
  {
    title: "Diabetes Prediction",
    description: "A desktop app to predict diabetes risk.",
    links: [],
  },
  {
    title: "Mushroom Classification",
    description: "A machine learning app to classify mushrooms.",
    links: [
      { kind: "live", href: "https://mushroom-classification-resnet.streamlit.app/" },
      { kind: "code", href: "https://github.com/manasseh-fikadu/Mushroom-Classification" },
    ],
  },
  {
    title: "TravelWave",
    description: "A ride sharing app that helps passengers pool a ride to the same destination.",
    links: [{ kind: "code", href: "https://github.com/orgs/TravelWave/repositories" }],
  },
];
