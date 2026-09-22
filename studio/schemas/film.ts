import { defineType, defineField } from "sanity";

export const film = defineType({
  name: "film",
  title: "Film",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Shown over the film on hover. Leave blank for no label.",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "video",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "GIF / Image", value: "image" },
        ],
        layout: "radio",
      },
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
      name: "image",
      title: "GIF / Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
    }),
    defineField({
      name: "poster",
      title: "Grid thumbnail",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. Shown in the grid instead of the video itself, which saves bandwidth on long films. The full video still plays full screen.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "width",
      title: "Width in pixels",
      type: "number",
      description: "Filled in automatically on upload. Used for layout proportions.",
    }),
    defineField({
      name: "height",
      title: "Height in pixels",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", image: "image", poster: "poster", type: "type", file: "video.asset.originalFilename" },
    prepare({ title, image, poster, type, file }) {
      return {
        title: title || file || "Untitled film",
        subtitle: type === "video" ? "Video" : "GIF / Image",
        media: type === "video" ? poster : image,
      };
    },
  },
});
