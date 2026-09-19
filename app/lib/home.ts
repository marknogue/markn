import { PROJECTS } from "./placeholders";

export type GalleryImg = { thumb: string; src: string; w: number; h: number };

export type Item =
  | { type: "image"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] }
  | { type: "gif"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] }
  | { type: "video"; id: string; href: string; src: string; width?: number; height?: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] };

export type Placed = { item: Item; align: string };

const HOME_PICKS_PER_PROJECT = 3;

export const HOME_ITEMS: Item[] = Array.from({ length: HOME_PICKS_PER_PROJECT }).flatMap((_, pick) =>
  PROJECTS.filter((project) => project.images[pick]).map((project) => {
    const img = project.images[pick];
    return {
      type: "image" as const,
      id: `${project.slug}-${pick}`,
      href: "#",
      image: img.src,
      width: img.w,
      height: img.h,
      landscape: img.w > img.h,
      caption: project.title,
      gallery: project.images.map((g) => ({ thumb: g.src, src: g.src, w: g.w, h: g.h })),
    };
  })
);

export const PRELOADER_IMAGES = PROJECTS.map((project) => project.images[0]);

export const isFullWidth = (item: Item) => {
  if (item.type === "video") return true;
  const ar = (item.width ?? 0) / (item.height ?? 1);
  if (ar > 0 && ar < 1) return false;
  if (item.landscape) return true;
  return ar > 1.1;
};

export const itemAr = (item: Item) =>
  item.type === "video"
    ? (item.width || 1276) / (item.height || 720)
    : item.width / item.height;

function alignClass(n: number) {
  const m = n % 3;
  if (m === 0) return "md:ml-auto md:mr-0";
  if (m === 1) return "md:mr-auto md:ml-0";
  return "md:mx-auto";
}

export function buildColumns(list: Item[]): [Placed[], Placed[]] {
  const cols: [Placed[], Placed[]] = [[], []];
  const heights = [0, 0];
  list.forEach((item, i) => {
    const wFrac = isFullWidth(item) ? 1 : 0.62;
    const h = wFrac / itemAr(item) + 0.4;
    const c = heights[0] <= heights[1] ? 0 : 1;
    cols[c].push({ item, align: alignClass(i) });
    heights[c] += h;
  });
  return cols;
}
