import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      initialValue: "https://www.instagram.com/marknmarkn/",
    }),
  ],
  preview: { prepare: () => ({ title: "Settings" }) },
});
