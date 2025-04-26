import type { ServerLoad } from "@sveltejs/kit";

// TODO: make this dynamic
export const load: ServerLoad = async () => {
  const projects = [
    {
      title: "QuickSync",
      description:
        "A very robust web app that enables users to sync their inventory, products and orders in real time.",
      url: "https://quicksync.pro",
    },
    {
      title: "TravelWave",
      description: "A ride sharing application built ot help passengers pool a ride if they have the same destination.",
      url: "https://github.com/orgs/TravelWave/repositories",
    },
    {
      title: "AiQEM",
      description: "An AI based advertisement enhancement platform.",
      url: "https://aiqem.tech",
    },
    {
      title: "Stroke Prediction App",
      description: "A machine learning app to predict stroke risk.",
      url: "https://stroke-backend.vercel.app/",
    },
    {
      title: "Loan Approval Prediction App",
      description: "A machine learning app to predict loan approval risk.",
      url: "https://loan-prediction-051v.onrender.com/",
    },
    {
      title: "Home Credit Default Risk Prediction App",
      description: "A machine learning app to predict home credit default risk.",
      url: "https://home-credit-gradio.onrender.com/",
    },
    {
      title: "Diabetes Prediction App",
      description: "A machine learning app to predict diabetes risk.",
      url: "https://github.com/manasseh-fikadu/diabetes-prediction-app",
    },
    {
      title: "Mushroom Classification App",
      description: "A machine learning app to classify mushrooms.",
      url: "https://mushroom-classification-resnet.streamlit.app/",
    },
  ];

  // Fetch Medium posts for writings
  const mediumUsername = "@minasesotlg"; // Replace with your actual Medium username if needed
  let writings = [];
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`,
    );
    if (response.ok) {
      const data: any = await response.json();
      if (data.status === "ok") {
        writings = (data.items as any[]).map((item: any) => {
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

  return { projects, writings };
};
