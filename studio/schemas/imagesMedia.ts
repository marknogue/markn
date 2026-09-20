import { defineType, defineField } from "sanity";
import { BatchImageInput } from "../components/BatchImageInput";

export const imagesMedia = defineType({
  name: "imagesMedia",
  title: "Image or video",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "image",
      options: {
        list: [
          { title: "Image / GIF", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "image",
      title: "Image / GIF",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
      description: "Use mp4 (H.264) for the widest browser support.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "poster",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "A still to represent this video in the Studio list.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "width",
      title: "Width in pixels",
      type: "number",
      description: "Filled in automatically on upload. Used for layout proportions.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "height",
      title: "Height in pixels",
      type: "number",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "landscape",
      title: "Full width",
      type: "boolean",
      initialValue: false,
      description: "Turn on for wide media so it spans the full column width.",
    }),
    defineField({
      name: "caption",
      title: "Title",
      type: "string",
      description:
        "Shown over the image on hover, and underneath it on phones. Leave blank for no label.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      components: { input: BatchImageInput },
      description:
        "Clicking this item opens these images full screen. Upload several at once, then drag to reorder.",
    }),
    defineField({
      name: "link",
      title: "Link instead of gallery",
      type: "url",
      validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { image: "image", poster: "poster", type: "type", caption: "caption" },
    prepare({ image, poster, type, caption }) {
      const label = type === "video" ? "Video" : "Image";
      return {
        title: caption || label,
        subtitle: caption ? label : undefined,
        media: type === "video" ? poster : image,
      };
    },
  },
});
