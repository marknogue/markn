import { defineType, defineField } from "sanity";

export const portfolioPage = defineType({
  name: "portfolioPage",
  title: "Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (r) => r.unique(),
      description:
        "Every story. Pick existing projects or create a new one here, then drag to set the order.",
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio" }) },
});
