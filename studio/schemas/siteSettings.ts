import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact & settings",
  type: "document",
  fields: [
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "London",
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      initialValue: "https://www.instagram.com/marknmarkn/",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact & settings" }) },
});
