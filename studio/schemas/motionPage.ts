import { defineType, defineField } from "sanity";
import { createBatchMediaInput } from "../components/BatchMediaInput";

export const motionPage = defineType({
  name: "motionPage",
  title: "Motion",
  type: "document",
  fields: [
    defineField({
      name: "films",
      title: "Films",
      type: "array",
      of: [{ type: "reference", to: [{ type: "film" }] }],
      validation: (r) => r.unique(),
      components: { input: createBatchMediaInput("film") },
      description:
        "Pick existing films, create one here, or upload several at once. Drag to set the order.",
    }),
  ],
  preview: { prepare: () => ({ title: "Motion" }) },
});
