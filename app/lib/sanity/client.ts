import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityEnabled = projectId.length > 0;

export const sanity: SanityClient | null = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: "2024-10-01", useCdn: false })
  : null;

export function sized(url: string, w: number, q?: number): string {
  if (!url) return url;
  if (!/cdn\.sanity\.io/.test(url)) return url;
  if (/\.gif($|\?)/i.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  const quality = q ? `&q=${q}` : "";
  return `${url}${sep}w=${w}&auto=format&fit=max${quality}`;
}
