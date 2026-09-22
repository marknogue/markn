import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Italic", value: "em" }],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: "publications",
      title: "Selected publications",
      type: "array",
      of: [{ type: "string" }],
      description: "Drag to set the order they appear in on the site.",
    }),
    defineField({
      name: "clients",
      title: "Select clients",
      type: "array",
      of: [{ type: "string" }],
      description: "Drag to set the order they appear in on the site.",
    }),
    defineField({
      name: "copyright",
      title: "Copyright line",
      type: "string",
      initialValue: "All images © Markn",
    }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
