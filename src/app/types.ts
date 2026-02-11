import type { ElementType } from "react";

type Album = {
  id: string;
  title: string;
  count: string;
  date: string;
  mood: string;
  privacy: string;
  src: string;
  alt: string;
  type: "image" | "video";
  coverId?: string;
};

type GalleryItem = {
  id: string;
  title: string;
  detail?: string;
  src: string;
  alt: string;
  type: "image" | "video";
  videoSrc?: string;
  isLocal?: boolean;
  albumId?: string;
  mediaId?: string;
  fileSize?: string;
  mimeType?: string;
  duration?: string;
  timestamp?: number;
};

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  detail: string;
  src: string;
  alt: string;
  type: "image" | "video";
  videoSrc?: string;
};

type Content = {
  siteKicker: string;
  siteTitle: string;
  heroDate: string;
  heroHeadline: string;
  heroIntro: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroCardTitle: string;
  heroCardDetail: string;
  galleryTitle: string;
  galleryDescription: string;
  albumsTitle: string;
  uploadTitle: string;
  uploadDescription: string;
  timelineTitle: string;
  timelineDescription: string;
  aboutTitle: string;
  aboutBody: string;
  contactLabel: string;
  contactText: string;
  contactEmail: string;
};

type ThemePalette = {
  paper: string;
  paper2: string;
  ink: string;
  accent: string;
  muted: string;
  olive: string;
  shadow: string;
};

type ThemeFonts = {
  display: string;
  body: string;
};

type TextEffect =
  | "none"
  | "soft-shadow"
  | "outline"
  | "glow"
  | "emboss"
  | "shadow-strong"
  | "neon";

type ThemeTexture =
  | "none"
  | "watercolor"
  | "kraft"
  | "graph"
  | "dot"
  | "washi"
  | "cardstock";

type ThemeEffects = {
  display: TextEffect;
  body: TextEffect;
  label: TextEffect;
};

type Theme = {
  palette: ThemePalette;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  texture: ThemeTexture;
};

type ThemePreset = {
  id: string;
  name: string;
  palette: ThemePalette;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  texture: ThemeTexture;
};

type EditorSnapshot = {
  content: Content;
  textOverrides: Record<string, string>;
  theme: Theme;
  globalTheme: Theme;
  albumThemes: Record<string, Theme>;
  heroHeight: number;
  heroScale: number;
  albumImageHeight: number;
  galleryScale: number;
};

type EditableTextProps = {
  as: ElementType;
  value: string;
  onChange: (next: string) => void;
  className?: string;
  multiline?: boolean;
  editable?: boolean;
};

type StoredUpload = {
  id: string;
  title: string;
  detail?: string;
  alt: string;
  type: "image" | "video";
  albumId?: string;
  blob: Blob;
  blobType: string;
  duration?: string;
  timestamp?: number;
};

type ImageEdit = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type {
  Album,
  GalleryItem,
  TimelineItem,
  Content,
  ThemePalette,
  ThemeFonts,
  TextEffect,
  ThemeTexture,
  ThemeEffects,
  Theme,
  ThemePreset,
  EditorSnapshot,
  EditableTextProps,
  StoredUpload,
  ImageEdit,
};
