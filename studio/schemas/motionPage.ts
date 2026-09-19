import { defineType, defineField } from "sanity";

export const motionPage = defineType({
  name: "motionPage",
  title: "Motion",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Motion items",
      type: "array",
      of: [{ type: "motionMedia" }],
      description: "Drag to reorder. Videos and GIFs for the Motion page.",
    }),
  ],
  preview: { prepare: () => ({ title: "Motion" }) },
});
