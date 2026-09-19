export type PlaceholderImage = { src: string; w: number; h: number };
export type PlaceholderProject = { slug: string; title: string; images: PlaceholderImage[] };

const image = (slug: string, n: number, w: number, h: number): PlaceholderImage => ({
  src: `/placeholder/images/${slug}/${slug}-${String(n).padStart(2, "0")}.jpg`,
  w,
  h,
});

export const PROJECTS: PlaceholderProject[] = [
  {
    slug: "document",
    title: "Document",
    images: [
      image("document", 1, 2100, 2800),
      image("document", 2, 2708, 3599),
      image("document", 3, 2793, 3724),
      image("document", 4, 2100, 2800),
      image("document", 5, 2422, 3229),
      image("document", 6, 2100, 2640),
      image("document", 7, 1682, 1348),
      image("document", 8, 2100, 2648),
      image("document", 9, 1682, 1348),
      image("document", 10, 2059, 1660),
    ],
  },
  {
    slug: "more-or-less",
    title: "More or Less",
    images: [
      image("more-or-less", 1, 1440, 1766),
      image("more-or-less", 2, 1440, 1758),
      image("more-or-less", 3, 1440, 1761),
      image("more-or-less", 4, 1440, 1796),
      image("more-or-less", 5, 1440, 1758),
      image("more-or-less", 6, 1440, 1761),
      image("more-or-less", 7, 1440, 1794),
      image("more-or-less", 8, 1440, 1796),
      image("more-or-less", 9, 1440, 1761),
    ],
  },
  {
    slug: "times-luxx",
    title: "Times Luxx",
    images: [
      image("times-luxx", 1, 2400, 1555),
      image("times-luxx", 2, 2400, 1551),
      image("times-luxx", 3, 2400, 1553),
      image("times-luxx", 4, 2400, 3199),
      image("times-luxx", 5, 1739, 2318),
      image("times-luxx", 6, 2400, 3119),
      image("times-luxx", 7, 1298, 1691),
    ],
  },
  {
    slug: "vogue-scandinavia",
    title: "Vogue Scandinavia",
    images: [
      image("vogue-scandinavia", 1, 1440, 1782),
      image("vogue-scandinavia", 2, 1440, 1794),
      image("vogue-scandinavia", 3, 1440, 1782),
      image("vogue-scandinavia", 4, 1440, 1800),
      image("vogue-scandinavia", 5, 1440, 1785),
    ],
  },
  {
    slug: "wsj-magazine",
    title: "WSJ Magazine",
    images: [
      image("wsj-magazine", 1, 1440, 1159),
      image("wsj-magazine", 2, 1440, 1776),
      image("wsj-magazine", 3, 1440, 1740),
      image("wsj-magazine", 4, 1440, 1771),
      image("wsj-magazine", 5, 1440, 1740),
      image("wsj-magazine", 6, 1440, 1740),
      image("wsj-magazine", 7, 1440, 1740),
      image("wsj-magazine", 8, 1440, 1161),
    ],
  },
];

export type PlaceholderVideo = { src: string; w: number; h: number; title: string };

export const MOTION: PlaceholderVideo[] = [
  { src: "/placeholder/motion/vogue-scandinavia-01.mp4", w: 1280, h: 720, title: "Vogue Scandinavia" },
  { src: "/placeholder/motion/le-rouge-et-le-noir.mp4", w: 1280, h: 720, title: "Le Rouge et le Noir" },
  { src: "/placeholder/motion/vogue-scandinavia-02.mp4", w: 720, h: 900, title: "Vogue Scandinavia" },
];
