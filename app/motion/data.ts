import { packRows } from "../lib/mosaic";
import { MOTION } from "../lib/placeholders";

export type Media = { kind: "video" | "gif"; src: string; w: number; h: number; ar: number; caption?: string; poster?: string };
export type Cell = { type: "single"; ar: number; item: Media };
export type Row = { cells: Cell[]; ar: number };

const media: Media[] = MOTION.map((video) => ({
  kind: "video",
  src: video.src,
  w: video.w,
  h: video.h,
  ar: Math.round((video.w / video.h) * 1e4) / 1e4,
  caption: video.title,
}));

export const cells: Cell[] = media.map((item) => ({ type: "single", ar: item.ar, item }));

const packable = cells.map((c) => ({ ar: c.ar, data: c }));

export const desktopRows: Row[] = packRows(packable, 1280, 50, 320, 2);
export const mobileRows: Row[] = packRows(packable, 390, 14, 240, 1);
