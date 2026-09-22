import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./schemas";

const singletons = [
  { id: "selectedWorksPage", title: "Selected Works" },
  { id: "portfolioPage", title: "Portfolio" },
  { id: "motionPage", title: "Motion" },
  { id: "aboutPage", title: "About" },
  { id: "preloaderPage", title: "Opening animation" },
  { id: "siteSettings", title: "Contact & settings" },
];

const singletonItem = (S: StructureBuilder, s: (typeof singletons)[number]) =>
  S.listItem()
    .title(s.title)
    .id(s.id)
    .child(S.document().schemaType(s.id).documentId(s.id));

export default defineConfig({
  name: "default",
  title: "Markn",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) => {
        const [selectedWorks, portfolio, motion, ...rest] = singletons;
        return S.list()
          .title("Content")
          .items([
            singletonItem(S, selectedWorks),
            singletonItem(S, portfolio),
            singletonItem(S, motion),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("film").title("Films"),
            S.divider(),
            ...rest.map((s) => singletonItem(S, s)),
          ]);
      },
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
