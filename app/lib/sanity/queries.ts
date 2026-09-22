import type { PortableTextBlock } from "@portabletext/react";
import { sanity, sanityEnabled } from "./client";

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!sanityEnabled || !sanity) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SANITY_PROJECT_ID is not set, refusing to build a site with no content"
      );
    }
    return null;
  }
  try {
    return await sanity.fetch<T>(query);
  } catch (e) {
    const message = (e as Error).message;
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Sanity fetch failed, refusing to build an empty site: ${message}`);
    }
    console.warn("[sanity] fetch failed:", message);
    return null;
  }
}

export type GalleryImg = { src: string; w: number; h: number };

export type Media = {
  type: "image" | "video";
  src: string;
  width: number;
  height: number;
  landscape?: boolean;
  link?: string;
  caption?: string;
  poster?: string;
  gallery: GalleryImg[];
};

type RawMedia = {
  type?: "image" | "video";
  landscape?: boolean;
  link?: string;
  caption?: string;
  imgUrl?: string;
  imgW?: number;
  imgH?: number;
  vidUrl?: string;
  vidW?: number;
  vidH?: number;
  posterUrl?: string;
  gallery?: GalleryImg[];
};

const MEDIA_FIELDS = `
  "type": type,
  "landscape": landscape,
  "link": link,
  "imgUrl": image.asset->url,
  "imgW": image.asset->metadata.dimensions.width,
  "imgH": image.asset->metadata.dimensions.height,
  "vidUrl": video.asset->url,
  "vidW": width,
  "vidH": height,
  "posterUrl": poster.asset->url,
  "gallery": gallery[]{
    "src": asset->url,
    "w": asset->metadata.dimensions.width,
    "h": asset->metadata.dimensions.height
  }
`;

const WORK_PROJECTION = `{ ${MEDIA_FIELDS}, "caption": title }`;

function normalize(d: RawMedia): Media | null {
  const gallery = (d.gallery || []).filter((g) => g.src && g.w && g.h);
  if (d.type === "video") {
    if (!d.vidUrl) return null;
    return {
      type: "video",
      src: d.vidUrl,
      width: d.vidW || 1280,
      height: d.vidH || 720,
      landscape: d.landscape ?? true,
      link: d.link,
      caption: d.caption,
      poster: d.posterUrl,
      gallery,
    };
  }
  if (!d.imgUrl || !d.imgW || !d.imgH) return null;
  return {
    type: "image",
    src: d.imgUrl,
    width: d.imgW,
    height: d.imgH,
    landscape: d.landscape,
    link: d.link,
    caption: d.caption,
    gallery,
  };
}

function toMedia(raw: (RawMedia | null)[] | null): Media[] | null {
  if (!raw || raw.length === 0) return null;
  const items = raw
    .filter((m): m is RawMedia => m !== null)
    .map(normalize)
    .filter((m): m is Media => m !== null);
  return items.length ? items : null;
}

const projectList = async (docType: string) =>
  toMedia(
    await safeFetch<(RawMedia | null)[] | null>(
      `*[_type=="${docType}"][0].projects[]->${WORK_PROJECTION}`
    )
  );

export const getSelectedWorks = () => projectList("selectedWorksPage");
export const getPortfolio = () => projectList("portfolioPage");

export const getMotion = async () =>
  toMedia(
    await safeFetch<(RawMedia | null)[] | null>(
      `*[_type=="motionPage"][0].films[]->${WORK_PROJECTION}`
    )
  );

export type AboutData = {
  bio: PortableTextBlock[] | null;
  publications: string[] | null;
  clients: string[] | null;
  copyright: string | null;
};

export const getAbout = () =>
  safeFetch<AboutData | null>(
    `*[_type=="aboutPage"][0]{ bio, publications, clients, copyright }`
  );

export type SettingsData = {
  location: string | null;
  email: string | null;
  instagramUrl: string | null;
};

export const getSettings = () =>
  safeFetch<SettingsData | null>(
    `*[_type=="siteSettings"][0]{ location, email, instagramUrl }`
  );

export type PreloaderImage = { src: string; w: number; h: number };

export type PreloaderData = {
  images: PreloaderImage[];
  secondsPerImage: number | null;
  holdSeconds: number | null;
};

export async function getPreloader(): Promise<PreloaderData | null> {
  const data = await safeFetch<{
    images: PreloaderImage[] | null;
    secondsPerImage: number | null;
    holdSeconds: number | null;
  } | null>(
    `*[_type=="preloaderPage"][0]{
      "images": images[]{
        "src": asset->url,
        "w": asset->metadata.dimensions.width,
        "h": asset->metadata.dimensions.height
      },
      secondsPerImage,
      holdSeconds
    }`
  );
  if (!data) return null;
  const images = (data.images || []).filter((i) => i.src && i.w && i.h);
  return { images, secondsPerImage: data.secondsPerImage, holdSeconds: data.holdSeconds };
}
