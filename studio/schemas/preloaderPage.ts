import { defineType, defineField } from "sanity";
import { BatchImageInput } from "../components/BatchImageInput";

export const preloaderPage = defineType({
  name: "preloaderPage",
  title: "Opening animation",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      components: { input: BatchImageInput },
      description:
        "Images for the intro. Around 6–8 works best: upright images pair up, wide ones show on their own. Drag to reorder. Leave empty to show just the name.",
    }),
    defineField({
      name: "secondsPerImage",
      title: "Seconds between images",
      type: "number",
      initialValue: 0.28,
      validation: (r) => r.min(0.1).max(1.5),
      description:
        "How quickly the images flicker past. 0.28 is the default; higher is slower. Between 0.1 and 1.5.",
    }),
    defineField({
      name: "holdSeconds",
      title: "Seconds to hold the name",
      type: "number",
      initialValue: 2,
      validation: (r) => r.min(0).max(4),
      description: "How long the name stays on screen before the site appears.",
    }),
  ],
  preview: { prepare: () => ({ title: "Opening animation" }) },
});
