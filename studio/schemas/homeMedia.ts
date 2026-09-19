import { defineType, defineField } from "sanity";
import { BatchImageInput } from "../components/BatchImageInput";

export const homeMedia = defineType({
  name: "homeMedia",
  title: "Media",
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
      description:
        "mp4, mov, webm, etc. For best playback across browsers use mp4 (H.264) or webm.",
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
      title: "Width (video only)",
      type: "number",
      description: "Pixel width of the video, used for layout proportions.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "height",
      title: "Height (video only)",
      type: "number",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "landscape",
      title: "Full width",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on for wide / landscape media so it spans the full column width.",
    }),
    defineField({
      name: "caption",
      title: "Hover text",
      type: "string",
      description:
        "Shown over the media on hover (and below it on mobile). Leave blank for no label.",
    }),
    defineField({
      name: "gallery",
      title: "Related images (lightbox)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      components: { input: BatchImageInput },
      description:
        "Optional. When you add images here, clicking this item opens a grid of these images. Use the “Upload multiple images” button to bulk-add. Takes priority over the link below.",
    }),
    defineField({
      name: "link",
      title: "Link (optional)",
      type: "url",
      validation: (r) =>
        r.uri({ allowRelative: true, scheme: ["http", "https"] }),
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
