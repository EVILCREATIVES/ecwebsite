import { useQuery } from "@tanstack/react-query";

// Content for the Works and Campaigns sections. It is edited from /admin and
// stored in Vercel Blob; the defaults below are used until something is saved
// (and in local development, where the /api functions don't run).

export type MediaItem = {
  /** Either a path inside public/ (e.g. "images/x.png") or a full URL. */
  src: string;
  label: string;
  video?: boolean;
};

export type SiteContent = {
  works: { rowOne: MediaItem[]; rowTwo: MediaItem[] };
  campaigns: MediaItem[];
  updatedAt?: string;
};

export const defaultContent: SiteContent = {
  works: {
    rowOne: [
      { src: "images/gallery-brandworlds.png", label: "Brand Worlds" },
      { src: "images/site-img5.png", label: "Concept Film" },
      { src: "images/gallery-lumen-park.png", label: "Multimedia Activation" },
      { src: "images/site-img6.png", label: "Type & Identity" },
      { src: "images/case6.png", label: "Photo-Reportage" },
    ],
    rowTwo: [
      { src: "images/site-img10.png", label: "Narrative Campaigns" },
      { src: "images/site-img2.png", label: "Social Content" },
      { src: "images/interface-lumen.png", label: "Interface Systems" },
      { src: "videos/gallery-dome.mp4", label: "3D & Spatial", video: true },
      { src: "images/site-img7.png", label: "Docu-Series" },
    ],
  },
  campaigns: [
    { src: "videos/ads-cocktail.mp4", label: "Brand Film", video: true },
    { src: "images/site-img9.png", label: "Key Visuals" },
    { src: "videos/ads-social.mp4", label: "Social Campaign", video: true },
    { src: "videos/ads-motion.mp4", label: "Guerrilla Tactics", video: true },
    { src: "videos/ads-activation.mp4", label: "Brand Activations", video: true },
  ],
};

const base = import.meta.env.BASE_URL;

export function resolveSrc(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${base}${src.replace(/^\//, "")}`;
}

export const CONTENT_QUERY_KEY = ["site-content"] as const;

export async function fetchContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${base}api/content`, { cache: "no-store" });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return defaultContent;
    const data = (await res.json()) as SiteContent | null;
    if (!data?.works?.rowOne || !data.works.rowTwo || !data.campaigns) return defaultContent;
    return data;
  } catch {
    return defaultContent;
  }
}

export function useSiteContent() {
  return useQuery({ queryKey: CONTENT_QUERY_KEY, queryFn: fetchContent, staleTime: Infinity, retry: false });
}
