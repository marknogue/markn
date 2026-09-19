import { defineType, defineField } from "sanity";

export const preloaderPage = defineType({
  name: "preloaderPage",
  title: "Preloader",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Images for the intro animation. Around 6–8 works best — portraits pair up, wide ones show on their own. Leave empty to show just the name.",
    }),
  ],
  preview: { prepare: () => ({ title: "Preloader" }) },
});
