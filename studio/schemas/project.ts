import { defineType, defineField } from "sanity";
import { BatchImageInput } from "../components/BatchImageInput";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
      description: "Shown over the cover on hover, underneath it on phones, and at the top of the gallery.",
    }),
    defineField({
      name: "type",
      title: "Cover type",
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
      title: "Cover image / GIF",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
    }),
    defineField({
      name: "video",
      title: "Cover video",
      type: "file",
      options: { accept: "video/*" },
      description: "Use mp4 (H.264) for the widest browser support.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "poster",
      title: "Video thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "A still to represent this video in the Studio.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "width",
      title: "Video width in pixels",
      type: "number",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "height",
      title: "Video height in pixels",
      type: "number",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "landscape",
      title: "Full width",
      type: "boolean",
      initialValue: false,
      description: "Turn on for a wide cover so it spans the full column width.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      components: { input: BatchImageInput },
      description:
        "The thumbnails shown when someone clicks the project. Upload many at once, then drag to reorder.",
    }),
    defineField({
      name: "link",
      title: "Link instead of gallery",
      type: "url",
      validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "title", image: "image", poster: "poster", type: "type" },
    prepare({ title, image, poster, type }) {
      return { title: title || "Untitled project", media: type === "video" ? poster : image };
    },
  },
});
