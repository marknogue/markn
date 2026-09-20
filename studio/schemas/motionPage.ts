import { defineType, defineField } from "sanity";
import { createBatchMediaInput } from "../components/BatchMediaInput";

export const motionPage = defineType({
  name: "motionPage",
  title: "Motion",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Films",
      type: "array",
      of: [{ type: "motionMedia" }],
      components: { input: createBatchMediaInput("motionMedia") },
      description:
        "Drag films to change the order they appear on the site.",
    }),
  ],
  preview: { prepare: () => ({ title: "Motion" }) },
});
