export type Media = {
  kind: "video" | "gif";
  src: string;
  w: number;
  h: number;
  ar: number;
  caption?: string;
  poster?: string;
};
export type Cell = { type: "single"; ar: number; item: Media };
export type Row = { cells: Cell[]; ar: number };
