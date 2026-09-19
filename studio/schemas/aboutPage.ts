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
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Bold", value: "strong" },
            ],
            annotations: [],
          },
        },
      ],
    }),
    defineField({
      name: "representation",
      title: "Representation line",
      type: "string",
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "clients",
      title: "Select Clients",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
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
