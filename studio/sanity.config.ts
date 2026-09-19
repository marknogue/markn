import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./schemas";

const singletons = [
  { id: "homePage", title: "Latest Series (Home)" },
  { id: "overviewPage", title: "Portfolio Overview" },
  { id: "motionPage", title: "Motion" },
  { id: "aboutPage", title: "About" },
  { id: "studioPage", title: "Studio" },
  { id: "preloaderPage", title: "Preloader" },
  { id: "siteSettings", title: "Settings" },
];

export default defineConfig({
  name: "default",
  title: "Markn",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items(
            singletons.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .child(S.document().schemaType(s.id).documentId(s.id))
            )
          ),
    }),
    media(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (t) => !singletons.some((s) => s.id === t.schemaType)
      ),
  },
  document: {
    actions: (input, context) =>
      singletons.some((s) => s.id === context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : input,
  },
});
