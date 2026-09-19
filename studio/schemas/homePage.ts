import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Latest Series (Home)",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Media",
      type: "array",
      of: [{ type: "homeMedia" }],
      description: "Drag to reorder. These appear on the homepage grid.",
    }),
  ],
  preview: { prepare: () => ({ title: "Latest Series (Home)" }) },
});
