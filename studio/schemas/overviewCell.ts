import { defineType, defineField } from "sanity";

export const overviewCell = defineType({
  name: "overviewCell",
  title: "Cell",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images (1–3)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Add one image for a normal tile, or 2–3 to group them tightly as one unit.",
      validation: (r) => r.min(1).max(3),
    }),
    defineField({
      name: "caption",
      title: "Hover text",
      type: "string",
      description: "Shown over the image on hover. Leave blank for no label.",
    }),
  ],
  preview: {
    select: { images: "images", caption: "caption" },
    prepare({ images, caption }) {
      const arr = Array.isArray(images) ? images : [];
      const n = arr.length;
      const type = n > 1 ? `Group of ${n}` : "Single image";
      return {
        title: caption || type,
        subtitle: caption ? type : undefined,
        media: arr[0],
      };
    },
  },
});
