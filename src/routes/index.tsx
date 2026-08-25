import { createFileRoute } from "@tanstack/react-router";
import { App } from "@/components/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Khaba Dhaba — Your Personal Dhaba Chef" },
      {
        name: "description",
        content:
          "Tell Khaba Dhaba what's in your fridge and get a warm Pakistani recipe with steps, nutrition and chef's secrets.",
      },
      { property: "og:title", content: "Khaba Dhaba — Your Personal Dhaba Chef" },
      {
        property: "og:description",
        content:
          "Pakistani recipe assistant: ingredients in, desi recipe out — steps, nutrition and serving ideas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
