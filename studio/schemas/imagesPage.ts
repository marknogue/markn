import { defineType, defineField } from "sanity";
import { createBatchMediaInput } from "../components/BatchMediaInput";

export const imagesPage = defineType({
  name: "imagesPage",
  title: "Images",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Images",
      type: "array",
      of: [{ type: "imagesMedia" }],
      components: { input: createBatchMediaInput("imagesMedia") },
      description:
        "The main grid. Drag items to change the order they appear on the site.",
    }),
  ],
  preview: { prepare: () => ({ title: "Images" }) },
});
