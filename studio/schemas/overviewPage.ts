import { defineType, defineField } from "sanity";
import { BatchCellInput } from "../components/BatchCellInput";

export const overviewPage = defineType({
  name: "overviewPage",
  title: "Portfolio Overview",
  type: "document",
  fields: [
    defineField({
      name: "cells",
      title: "Images",
      type: "array",
      of: [{ type: "overviewCell" }],
      components: { input: BatchCellInput },
      description:
        "Drag to reorder. Each cell is one image, or a small group of 2–3. Use the “Upload multiple images” button below to bulk-add tiles.",
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio Overview" }) },
});
