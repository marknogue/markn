import { defineType, defineField } from "sanity";

export const selectedWorksPage = defineType({
  name: "selectedWorksPage",
  title: "Selected Works",
  type: "document",
  fields: [
    defineField({
      name: "projects",
      title: "Projects and films",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }, { type: "film" }] }],
      validation: (r) => r.unique(),
      description:
        "Your favourite stories and films, shown first on the site. Pick existing projects or films, or create new ones here, then drag to set the order.",
    }),
  ],
  preview: { prepare: () => ({ title: "Selected Works" }) },
});
