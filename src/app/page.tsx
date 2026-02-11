"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  CSSProperties,
  FocusEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AboutSection from "../components/AboutSection";
import AlbumsSection from "../components/AlbumsSection";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import TimelineSection from "../components/TimelineSection";
import UploadSection from "../components/UploadSection";
import type {
  Album,
  Content,
  EditableTextProps,
  EditorSnapshot,
  GalleryItem,
  ImageEdit,
  StoredUpload,
  TextEffect,
  Theme,
  ThemeEffects,
  ThemeFonts,
  ThemePalette,
  ThemePreset,
  ThemeTexture,
  TimelineItem,
} from "./types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const resolveAssetSrc = (src?: string) => {
  if (!src) return "";
  if (src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http")) {
    return src;
  }
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${normalized}`;
};

const initialAlbums: Album[] = [
  {
    id: "album-winter-kitchen",
    title: "Winter Kitchen",
    count: "18 photos",
    date: "Jan 2026",
    mood: "Morning light and warm tea.",
    privacy: "Private link",
    src: "/media/album-winter-kitchen.svg",
    alt: "Cozy kitchen scene",
    type: "image",
  },
  {
    id: "album-snow-walks",
    title: "Snow Walks",
    count: "12 photos · 2 videos",
    date: "Dec 2025",
    mood: "Soft footsteps and quiet streets.",
    privacy: "Friends",
    src: "/media/album-snow-walks.svg",
    alt: "Snowy walk in a quiet neighborhood",
    type: "image",
  },
  {
    id: "album-sunday-tables",
    title: "Sunday Tables",
    count: "24 photos",
    date: "Nov 2025",
    mood: "Family lunches, small rituals.",
    privacy: "Private link",
    src: "/media/album-sunday-tables.svg",
    alt: "Family lunch table",
    type: "image",
  },
  {
    id: "album-autumn-woods",
    title: "Autumn Woods",
    count: "15 photos",
    date: "Oct 2025",
    mood: "Leaves, fog, and an old thermos.",
    privacy: "Friends",
    src: "/media/album-autumn-woods.svg",
    alt: "Autumn woods with soft fog",
    type: "image",
  },
];

const initialTimeline: TimelineItem[] = [
  {
    id: "moment-snow-window",
    date: "Today",
    title: "First snow by the window",
    detail: "7:06 AM · 4 photos",
    src: "/media/thumb-snow-window.svg",
    alt: "Snow at the window",
    type: "image",
  },
  {
    id: "moment-candlelight",
    date: "Yesterday",
    title: "Candlelight dinner",
    detail: "9:12 PM · 1 video",
    src: "/media/thumb-candlelight.svg",
    alt: "Candlelight glow",
    type: "video",
    videoSrc: "",
  },
  {
    id: "moment-market",
    date: "Jan 30",
    title: "Market morning",
    detail: "10:18 AM · 6 photos",
    src: "/media/thumb-market.svg",
    alt: "Morning market stalls",
    type: "image",
  },
];

const VIEW_PASSWORD = "Cherry";
const EDIT_PASSWORD = "Bluesky";
const GALLERY_TOTAL_LIMIT = 18;

const defaultContent: Content = {
  siteKicker: "personal archive",
  siteTitle: "Sunday Album",
  heroDate: "Feb 2026 · Prague",
  heroHeadline: "Photographs and film, arranged like a quiet journal.",
  heroIntro:
    "A personal archive for friends and family. Browse the latest moments, then dive into each album when you have time to linger.",
  heroCtaPrimary: "open gallery",
  heroCtaSecondary: "browse albums",
  heroCardTitle: "Sunday light",
  heroCardDetail: "7:06 AM · 4 photos · kitchen window",
  galleryTitle: "A living wall of moments",
  galleryDescription: "Mixed sizes, like pages on a table.",
  albumsTitle: "Collections for friends",
  uploadTitle: "Add new moments",
  uploadDescription: "Drag and drop images or videos, or use the picker.",
  timelineTitle: "Recent moments",
  timelineDescription:
    "A quiet feed of the week, saved in order so it feels like turning pages.",
  aboutTitle: "Made for friends and family",
  aboutBody:
    "This space is private by default. Every album can be shared with a link, and videos play softly until you choose to listen. I add new moments every Sunday.",
  contactLabel: "contact",
  contactText: "Send a note for a private link or a download.",
  contactEmail: "hello@sundayalbum.com",
};

const displayFontOptions = [
  { id: "playfair", label: "Playfair Display", value: "'Playfair Display', serif" },
  { id: "fraunces", label: "Fraunces", value: "'Fraunces', serif" },
  { id: "cormorant", label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { id: "dmserif", label: "DM Serif Display", value: "'DM Serif Display', serif" },
  { id: "bodoni", label: "Bodoni Moda", value: "'Bodoni Moda', serif" },
  { id: "lora", label: "Lora", value: "'Lora', serif" },
  { id: "merriweather", label: "Merriweather", value: "'Merriweather', serif" },
  { id: "spacegrotesk", label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
];

const bodyFontOptions = [
  { id: "manrope", label: "Manrope", value: "'Manrope', sans-serif" },
  { id: "worksans", label: "Work Sans", value: "'Work Sans', sans-serif" },
  { id: "sourcesans", label: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
  { id: "ibmplex", label: "IBM Plex Sans", value: "'IBM Plex Sans', sans-serif" },
  { id: "nunito", label: "Nunito Sans", value: "'Nunito Sans', sans-serif" },
  { id: "jakarta", label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
];

const effectOptions: { id: TextEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "soft-shadow", label: "Soft shadow" },
  { id: "outline", label: "Outline" },
  { id: "glow", label: "Glow" },
  { id: "emboss", label: "Emboss" },
  { id: "shadow-strong" as TextEffect, label: "Shadow strong" },
  { id: "neon" as TextEffect, label: "Neon" },
];

const textureOptions: { id: ThemeTexture; label: string; value: string; size?: string }[] = [
  { id: "none", label: "None", value: "none" },
  { 
    id: "watercolor", 
    label: "Watercolor", 
    value: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 50%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
  },
  {
    id: "kraft",
    label: "Kraft",
    value: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E")`
  },
  {
    id: "graph",
    label: "Graph",
    value: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
    size: "20px 20px"
  },
  {
    id: "dot",
    label: "Dot Grid",
    value: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
    size: "20px 20px"
  },
  {
    id: "washi",
    label: "Washi",
    value: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`
  },
  {
    id: "cardstock",
    label: "Dark Cardstock",
    value: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`
  }
];

const defaultTheme: Theme = {
  palette: {
    paper: "#efe7dc",
    paper2: "#e7dccf",
    ink: "#2b2723",
    accent: "#b86f55",
    muted: "#c9beae",
    olive: "#5a5f45",
    shadow: "rgba(43, 39, 35, 0.12)",
  },
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Manrope', sans-serif",
  },
  effects: {
    display: "none",
    body: "none",
    label: "none",
  },
  texture: "none",
};

const themePresets: ThemePreset[] = [
  {
    id: "linen-clay",
    name: "Linen & Clay",
    palette: {
      paper: "#f1e7dc",
      paper2: "#eadccc",
      ink: "#2b2723",
      accent: "#b86f55",
      muted: "#c9beae",
      olive: "#5a5f45",
      shadow: "rgba(43, 39, 35, 0.12)",
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Manrope', sans-serif",
    },
    effects: {
      display: "none",
      body: "none",
      label: "none",
    },
    texture: "none",
  },
  {
    id: "moss-smoke",
    name: "Moss & Smoke",
    palette: {
      paper: "#e5e2d6",
      paper2: "#d8d3c2",
      ink: "#2f2b26",
      accent: "#7b8b5a",
      muted: "#b7b0a1",
      olive: "#4f5f3f",
      shadow: "rgba(47, 43, 38, 0.12)",
    },
    fonts: {
      display: "'Cormorant Garamond', serif",
      body: "'Source Sans 3', sans-serif",
    },
    effects: {
      display: "soft-shadow",
      body: "none",
      label: "none",
    },
    texture: "none",
  },
  {
    id: "saffron-studio",
    name: "Saffron Studio",
    palette: {
      paper: "#f4e6cf",
      paper2: "#ecd7b4",
      ink: "#2f241a",
      accent: "#d08c3f",
      muted: "#cbb79f",
      olive: "#6b5a3a",
      shadow: "rgba(47, 36, 26, 0.12)",
    },
    fonts: {
      display: "'Fraunces', serif",
      body: "'Work Sans', sans-serif",
    },
    effects: {
      display: "emboss",
      body: "none",
      label: "none",
    },
    texture: "none",
  },
  {
    id: "ink-oat",
    name: "Ink & Oat",
    palette: {
      paper: "#f2ede3",
      paper2: "#e4ddd2",
      ink: "#232624",
      accent: "#5f7d87",
      muted: "#b9b2a6",
      olive: "#4f5b56",
      shadow: "rgba(35, 38, 36, 0.12)",
    },
    fonts: {
      display: "'DM Serif Display', serif",
      body: "'IBM Plex Sans', sans-serif",
    },
    effects: {
      display: "outline",
      body: "none",
      label: "none",
    },
    texture: "none",
  },
  {
    id: "sunday-morning",
    name: "Morning Light",
    palette: {
      paper: "#f9f7f2",
      paper2: "#f0ebe0",
      ink: "#2d2a26",
      accent: "#d4a373",
      muted: "#e5e0d6",
      olive: "#78866b",
      shadow: "rgba(45, 42, 38, 0.08)",
    },
    fonts: {
      display: "'Fraunces', serif",
      body: "'Manrope', sans-serif",
    },
    effects: {
      display: "none",
      body: "none",
      label: "none",
    },
    texture: "none",
  },
];

const UPLOAD_DB_NAME = "sunday-album-db";
const UPLOAD_STORE_NAME = "uploads";
const SETTINGS_STORE_NAME = "settings";
const SETTINGS_KEY = "sunday-album-settings";

const requestToPromise = <T,>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transactionToPromise = (transaction: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });

const openUploadsDb = () => {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(UPLOAD_DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(UPLOAD_STORE_NAME)) {
        db.createObjectStore(UPLOAD_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
        db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const loadSettingsFromDb = async () => {
  const db = await openUploadsDb();
  if (!db) return null;
  const transaction = db.transaction(SETTINGS_STORE_NAME, "readonly");
  const store = transaction.objectStore(SETTINGS_STORE_NAME);
  const data = await requestToPromise(store.get(SETTINGS_KEY));
  return data?.payload ?? null;
};

const saveSettingsToDb = async (payload: Record<string, unknown>) => {
  const db = await openUploadsDb();
  if (!db) return;
  const transaction = db.transaction(SETTINGS_STORE_NAME, "readwrite");
  const store = transaction.objectStore(SETTINGS_STORE_NAME);
  store.put({ id: SETTINGS_KEY, payload });
  await transactionToPromise(transaction);
};

const loadUploadsFromDb = async () => {
  const db = await openUploadsDb();
  if (!db) return [] as StoredUpload[];
  const transaction = db.transaction(UPLOAD_STORE_NAME, "readonly");
  const store = transaction.objectStore(UPLOAD_STORE_NAME);
  const data = await requestToPromise(store.getAll());
  return data as StoredUpload[];
};

const saveUploadToDb = async (item: GalleryItem, file: File) => {
  const db = await openUploadsDb();
  if (!db) return;
  
  let duration = "";
  if (file.type.startsWith("video/")) {
    duration = await new Promise<string>((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const m = Math.floor(video.duration / 60);
        const s = Math.floor(video.duration % 60);
        resolve(`${m}:${s.toString().padStart(2, "0")}`);
      };
      video.onerror = () => resolve("");
      video.src = URL.createObjectURL(file);
    });
  }

  const transaction = db.transaction(UPLOAD_STORE_NAME, "readwrite");
  const store = transaction.objectStore(UPLOAD_STORE_NAME);
  const payload: StoredUpload = {
    id: item.id,
    title: item.title,
    detail: item.detail,
    alt: item.alt,
    type: item.type,
    albumId: item.albumId,
    blob: file,
    blobType: file.type || "application/octet-stream",
    duration,
    timestamp: item.timestamp,
  };
  store.put(payload);
  await transactionToPromise(transaction);
};

const deleteUploadFromDb = async (id: string) => {
  const db = await openUploadsDb();
  if (!db) return;
  const transaction = db.transaction(UPLOAD_STORE_NAME, "readwrite");
  const store = transaction.objectStore(UPLOAD_STORE_NAME);
  store.delete(id);
  await transactionToPromise(transaction);
};

const updateUploadInDb = async (id: string, patch: Partial<StoredUpload>) => {
  const db = await openUploadsDb();
  if (!db) return;
  const transaction = db.transaction(UPLOAD_STORE_NAME, "readwrite");
  const store = transaction.objectStore(UPLOAD_STORE_NAME);
  const existing = await requestToPromise(store.get(id));
  if (!existing) return;
  store.put({ ...existing, ...patch });
  await transactionToPromise(transaction);
};

export default function Home() {
  const [accessLevel, setAccessLevel] = useState<"view" | "edit">("view");
  const [showAuth, setShowAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [content, setContent] = useState<Content>(defaultContent);

  // Synchronize content state across windows using localStorage events
  useEffect(() => {
    // Listen for content updates from other windows
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'sunday-album-content' && event.newValue) {
        try {
          const updated = JSON.parse(event.newValue);
          setContent((prev) => ({ ...prev, ...updated }));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Broadcast content changes to other windows
  useEffect(() => {
    localStorage.setItem('sunday-album-content', JSON.stringify(content));
  }, [content]);
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});
  const [globalTheme, setGlobalTheme] = useState<Theme>(defaultTheme);
  const [albumThemes, setAlbumThemes] = useState<Record<string, Theme>>({});
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [paletteDraft, setPaletteDraft] = useState<ThemePalette>(defaultTheme.palette);
  const [history, setHistory] = useState<EditorSnapshot[]>([]);
  const [future, setFuture] = useState<EditorSnapshot[]>([]);

  const [heroHeight, setHeroHeight] = useState(256);
  const [heroScale, setHeroScale] = useState(1);
  const [albumImageHeight, setAlbumImageHeight] = useState(160);
  const [galleryScale, setGalleryScale] = useState(1);
  const [heroSourceId, setHeroSourceId] = useState<string | null>(null);
  const [imageEdits, setImageEdits] = useState<Record<string, ImageEdit>>({});
  const [imageNotes, setImageNotes] = useState<Record<string, string>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLightboxMenuOpen, setIsLightboxMenuOpen] = useState(false);
  const [noteEditingId, setNoteEditingId] = useState<string | null>(null);
  const [editorTargetId, setEditorTargetId] = useState<string | null>(null);
  const [showLightboxInfo, setShowLightboxInfo] = useState(false);

  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);

  const [uploads, setUploads] = useState<GalleryItem[]>([]);

  const totalSizeMb = useMemo(() => {
    return uploads.reduce((acc, item) => {
      const sizeStr = item.fileSize || "0";
      const val = parseFloat(sizeStr.replace(/[^0-9.]/g, ""));
      return acc + (isNaN(val) ? 0 : val);
    }, 0).toFixed(1);
  }, [uploads]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(
    initialAlbums[0]?.id ?? ""
  );
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const isEditMode = accessLevel === "edit";
  const [isGallerySelectOpen, setIsGallerySelectOpen] = useState(false);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);
  const [pendingGalleryDelete, setPendingGalleryDelete] = useState<"selected" | "all" | null>(null);
  const galleryClickTimeoutRef = useRef<number | null>(null);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const thumbDragStartXRef = useRef(0);
  const thumbScrollLeftRef = useRef(0);
  const thumbDragMovedRef = useRef(false);
  const thumbPointerCapturedRef = useRef(false);
  const thumbScrollIntervalRef = useRef<number | null>(null);
  const [thumbDragIndex, setThumbDragIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    | {
        type: "album" | "upload" | "lightbox-upload" | "timeline";
        id: string;
        label: string;
      }
    | null
  >(null);
  const uploadsRef = useRef<GalleryItem[]>([]);
  const editSessionRef = useRef(false);
  const [editorWindow, setEditorWindow] = useState<Window | null>(null);
  const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(null);
  const editorStyleObserverRef = useRef<MutationObserver | null>(null);
  const inlineEditorContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      let parsed: {
        content?: Content;
        heroHeight?: number;
        heroScale?: number;
        albumImageHeight?: number;
        galleryScale?: number;
        heroSourceId?: string | null;
        imageEdits?: Record<string, ImageEdit>;
        imageNotes?: Record<string, string>;
        albums?: Album[];
        selectedAlbumId?: string;
        timeline?: TimelineItem[];
        textOverrides?: Record<string, string>;
        globalTheme?: Theme;
        albumThemes?: Record<string, Theme>;
      } | null = null;

      try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
          parsed = JSON.parse(stored);
        }
      } catch {
        parsed = null;
      }

      if (!parsed) {
        try {
          parsed = (await loadSettingsFromDb()) as typeof parsed;
        } catch {
          parsed = null;
        }
      }

      if (!parsed || !isMounted) return;
      if (parsed.content) setContent(parsed.content);
      if (parsed.heroHeight) setHeroHeight(parsed.heroHeight);
      if (parsed.heroScale) setHeroScale(parsed.heroScale);
      if (parsed.albumImageHeight) setAlbumImageHeight(parsed.albumImageHeight);
      if (parsed.galleryScale) setGalleryScale(parsed.galleryScale);
      if (parsed.heroSourceId !== undefined) setHeroSourceId(parsed.heroSourceId);
      if (parsed.imageEdits) setImageEdits(parsed.imageEdits);
      if (parsed.imageNotes) setImageNotes(parsed.imageNotes);
      if (parsed.albums) setAlbums(parsed.albums);
      if (parsed.selectedAlbumId) setSelectedAlbumId(parsed.selectedAlbumId);
      if (parsed.timeline && parsed.timeline.length > 0) setTimeline(parsed.timeline);
      if (parsed.textOverrides) setTextOverrides(parsed.textOverrides);
      if (parsed.globalTheme) setGlobalTheme(parsed.globalTheme);
      if (parsed.albumThemes) setAlbumThemes(parsed.albumThemes);
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const cloneTheme = (
    value: {
      palette: ThemePalette;
      fonts: ThemeFonts;
      effects: ThemeEffects;
      texture?: ThemeTexture;
    }
  ): Theme => ({
    palette: { ...value.palette },
    fonts: { ...value.fonts },
    effects: { ...value.effects },
    texture: value.texture ?? "none",
  });

  const cloneAlbumThemes = (themes: Record<string, Theme>) =>
    Object.fromEntries(
      Object.entries(themes).map(([key, value]) => [key, cloneTheme(value)])
    );

  const createSnapshot = (): EditorSnapshot => ({
    content: { ...content },
    textOverrides: { ...textOverrides },
    theme: cloneTheme(theme),
    globalTheme: cloneTheme(globalTheme),
    albumThemes: cloneAlbumThemes(albumThemes),
    heroHeight,
    heroScale,
    albumImageHeight,
    galleryScale,
  });

  const applySnapshot = (snapshot: EditorSnapshot) => {
    setContent(snapshot.content);
    setTextOverrides(snapshot.textOverrides);
    setTheme(snapshot.theme);
    setGlobalTheme(snapshot.globalTheme);
    setAlbumThemes(snapshot.albumThemes);
    setHeroHeight(snapshot.heroHeight);
    setHeroScale(snapshot.heroScale ?? 1);
    setAlbumImageHeight(snapshot.albumImageHeight);
    setGalleryScale(snapshot.galleryScale);
  };

  const pushHistory = () => {
    setHistory((prev) => [...prev, createSnapshot()]);
    setFuture([]);
  };

  const beginEditSession = () => {
    if (!editSessionRef.current) {
      pushHistory();
      editSessionRef.current = true;
    }
  };

  const endEditSession = () => {
    editSessionRef.current = false;
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const snapshot = history[history.length - 1];
    setFuture((prev) => [createSnapshot(), ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    applySnapshot(snapshot);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const snapshot = future[0];
    setHistory((prev) => [...prev, createSnapshot()]);
    setFuture((prev) => prev.slice(1));
    applySnapshot(snapshot);
  };

  const resolveText = (key: string, fallback: string) =>
    textOverrides[key] ?? fallback;

  const updateOverride = (key: string, value: string) => {
    setTextOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const getEffectClass = (effect: TextEffect) => {
    if (effect === "soft-shadow") return "text-effect-soft";
    if (effect === "outline") return "text-effect-outline";
    if (effect === "glow") return "text-effect-glow";
    if (effect === "emboss") return "text-effect-emboss";
    if (effect === "shadow-strong") return "text-effect-shadow-strong";
    if (effect === "neon") return "text-effect-neon";
    return "text-effect-none";
  };

  const effectiveTheme = previewTheme ?? theme;
  const displayEffectClass = getEffectClass(effectiveTheme.effects.display);
  const bodyEffectClass = getEffectClass(effectiveTheme.effects.body);
  const labelEffectClass = getEffectClass(effectiveTheme.effects.label);

  const paletteFields: { key: keyof ThemePalette; label: string }[] = [
    { key: "paper", label: "Paper" },
    { key: "paper2", label: "Paper alt" },
    { key: "ink", label: "Ink" },
    { key: "accent", label: "Accent" },
    { key: "muted", label: "Muted" },
    { key: "olive", label: "Olive" },
  ];

  const activeTexture = textureOptions.find((t) => t.id === effectiveTheme.texture);
  const themeStyle = {
    "--paper": effectiveTheme.palette.paper,
    "--paper-2": effectiveTheme.palette.paper2,
    "--ink": effectiveTheme.palette.ink,
    "--accent": effectiveTheme.palette.accent,
    "--muted": effectiveTheme.palette.muted,
    "--olive": effectiveTheme.palette.olive,
    "--shadow": effectiveTheme.palette.shadow,
    "--font-display": effectiveTheme.fonts.display,
    "--font-body": effectiveTheme.fonts.body,
    ...(activeTexture && activeTexture.id !== "none"
      ? {
          backgroundImage: activeTexture.value,
          backgroundSize: activeTexture.size,
          backgroundBlendMode: activeTexture.id === "watercolor" ? "multiply" : "normal",
        }
      : {}),
  } as CSSProperties;

  const hasUnsavedChanges = history.length > 0;

  const copyStyles = (targetDoc: Document) => {
    const head = targetDoc.head;
    head.querySelectorAll("base").forEach((node) => node.remove());
    head.querySelectorAll("link[rel=stylesheet], style").forEach((node) =>
      node.remove()
    );
    const base = targetDoc.createElement("base");
    base.href = window.location.origin;
    head.appendChild(base);
    document
      .querySelectorAll("link[rel=stylesheet], style")
      .forEach((node) => {
        head.appendChild(node.cloneNode(true));
      });
  };

  const closeEditorWindow = (force = false) => {
    if (!force && hasUnsavedChanges) {
      const confirmHost = editorWindow ?? window;
      const shouldClose = confirmHost.confirm(
        "Close the editor? You can undo changes after reopening."
      );
      if (!shouldClose) return;
    }
    if (inlineEditorContainerRef.current) {
      inlineEditorContainerRef.current.remove();
      inlineEditorContainerRef.current = null;
    }
    if (editorWindow && !editorWindow.closed) {
      editorWindow.close();
    }
    editorStyleObserverRef.current?.disconnect();
    editorStyleObserverRef.current = null;
    setEditorWindow(null);
    setEditorContainer(null);
    setAccessLevel("view");
    setShowAuth(false);
    setAuthError("");
  };

  const mountInlineEditor = () => {
    if (inlineEditorContainerRef.current) return;
    const container = document.createElement("div");
    container.dataset.editorInline = "true";
    document.body.appendChild(container);
    inlineEditorContainerRef.current = container;
    setEditorContainer(container);
  };

  const openEditorWindow = async () => {
    if (editorWindow && !editorWindow.closed) {
      editorWindow.focus();
      return;
    }
    
    // Try to open a popup window
    // note: 'alwaysOnTop' is not a standard feature for web popups, but we request a standard window
    // that the user can drag across screens.
    const newWindow = window.open(
      "",
      "SundayAlbumEditor",
      "width=520,height=800,left=60,top=60,resizable=yes,scrollbars=yes"
    );
    
    if (!newWindow) {
      mountInlineEditor();
      return;
    }
    
    newWindow.document.title = "Sunday Album Editor";
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.className = document.body.className;
    newWindow.document.documentElement.className =
      document.documentElement.className;
    const container = newWindow.document.createElement("div");
    newWindow.document.body.appendChild(container);
    copyStyles(newWindow.document);
    window.setTimeout(() => copyStyles(newWindow.document), 0);
    window.setTimeout(() => copyStyles(newWindow.document), 300);
    setEditorWindow(newWindow);
    setEditorContainer(container);
    editorStyleObserverRef.current?.disconnect();
    editorStyleObserverRef.current = new MutationObserver(() => {
      copyStyles(newWindow.document);
    });
    editorStyleObserverRef.current.observe(document.head, {
      childList: true,
      subtree: true,
    });
    newWindow.addEventListener("beforeunload", (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    });
    newWindow.addEventListener("unload", () => {
      setEditorWindow(null);
      setEditorContainer(null);
      setAccessLevel("view");
      setShowAuth(false);
      setAuthError("");
    });
  };

  const maximizeEditorWindow = () => {
    if (!editorWindow || editorWindow.closed) return;
    editorWindow.moveTo(0, 0);
    editorWindow.resizeTo(screen.availWidth, screen.availHeight);
  };

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    if (accessLevel !== "edit") {
      closeEditorWindow(true);
      return;
    }
    if (!editorWindow || editorWindow.closed) {
      openEditorWindow();
    }
  }, [accessLevel, editorWindow]);

  useEffect(() => {
    const albumTheme = albumThemes[selectedAlbumId];
    setTheme(albumTheme ?? globalTheme);
  }, [albumThemes, globalTheme, selectedAlbumId]);

  useEffect(() => {
    setPaletteDraft(theme.palette);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;
    const loadUploads = async () => {
      const storedUploads = await loadUploadsFromDb();
      if (!isMounted || storedUploads.length === 0) return;
      const restored = storedUploads.map((item) => {
        const url = URL.createObjectURL(item.blob);
        const sizeMb = (item.blob.size / (1024 * 1024)).toFixed(1);
        return {
          id: item.id,
          title: item.title,
          detail: item.detail,
          src: url,
          alt: item.alt,
          type: item.type,
          videoSrc: item.type === "video" ? url : undefined,
          isLocal: true,
          albumId: item.albumId,
          fileSize: `${sizeMb} MB`,
          mimeType: item.blobType.split("/")[1]?.toUpperCase() ?? "FILE",
          duration: item.duration,
          timestamp: item.timestamp,
        } as GalleryItem;
      });
      setUploads(restored);
    };

    loadUploads();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    persistSettings();
  }, [
    content,
    heroHeight,
    heroScale,
    albumImageHeight,
    galleryScale,
    heroSourceId,
    imageEdits,
    imageNotes,
    albums,
    selectedAlbumId,
    timeline,
    textOverrides,
    globalTheme,
    albumThemes,
  ]);

  const uploadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uploads.forEach((item) => {
      if (!item.albumId) return;
      counts[item.albumId] = (counts[item.albumId] ?? 0) + 1;
    });
    return counts;
  }, [uploads]);

  const albumMediaCounts = useMemo(() => {
    const counts: Record<string, { images: number; videos: number; totalSize: number }> = {};
    uploads.forEach((item) => {
      if (!item.albumId) return;
      if (!counts[item.albumId]) {
        counts[item.albumId] = { images: 0, videos: 0, totalSize: 0 };
      }
      const sizeVal = parseFloat(item.fileSize || "0");
      if (!isNaN(sizeVal)) {
        counts[item.albumId].totalSize += sizeVal;
      }
      if (item.type === "video") {
        counts[item.albumId].videos += 1;
      } else {
        counts[item.albumId].images += 1;
      }
    });
    return counts;
  }, [uploads]);

  const formatAlbumCount = (albumId: string) => {
    const counts = albumMediaCounts[albumId];
    if (!counts) return "0 photos";
    const parts = [] as string[];
    parts.push(`${counts.images} photo${counts.images === 1 ? "" : "s"}`);
    if (counts.videos > 0) {
      parts.push(`${counts.videos} video${counts.videos === 1 ? "" : "s"}`);
    }
    return parts.join(" · ");
  };

  const uploadsByAlbum = useMemo(() => {
    const grouped: Record<string, GalleryItem[]> = {};
    uploads.forEach((item) => {
      if (!item.albumId) return;
      if (!grouped[item.albumId]) grouped[item.albumId] = [];
      grouped[item.albumId].push(item);
    });
    albums.forEach((album) => {
      const items = grouped[album.id];
      if (!items || !album.coverId) return;
      const coverIndex = items.findIndex((item) => item.id === album.coverId);
      if (coverIndex > 0) {
        const [cover] = items.splice(coverIndex, 1);
        items.unshift(cover);
      }
    });
    return grouped;
  }, [uploads, albums]);

  const heroAlbum = heroSourceId
    ? albums.find((album) => album.id === heroSourceId)
    : undefined;
  const heroCoverItem = heroAlbum
    ? uploadsByAlbum[heroAlbum.id]?.find((item) => item.id === heroAlbum.coverId) ??
      uploadsByAlbum[heroAlbum.id]?.[0]
    : undefined;
  const heroMediaId = heroCoverItem?.id;
  const hero: GalleryItem = {
    id: heroAlbum?.id ?? "hero-sunday-light",
    title: content.heroCardTitle,
    detail: content.heroCardDetail,
    src: heroCoverItem?.src ?? heroAlbum?.src ?? "/media/hero-sunday-light.svg",
    alt: heroCoverItem?.alt ?? heroAlbum?.alt ?? "Warm morning light through a kitchen window",
    type: heroCoverItem?.type ?? heroAlbum?.type ?? "image",
    videoSrc: heroCoverItem?.videoSrc,
    isLocal: heroCoverItem?.isLocal,
    mediaId: heroMediaId,
  };

  const albumsWithUploads = useMemo(
    () => albums.filter((album) => (uploadsByAlbum[album.id]?.length ?? 0) > 0),
    [albums, uploadsByAlbum]
  );

  const visibleAlbums = isEditMode ? albums : albumsWithUploads;

  const galleryItems = useMemo(() => {
    const heroItem = {
      id: hero.id,
      title: hero.title,
      detail: hero.detail,
      src: hero.src,
      alt: hero.alt,
      type: hero.type,
      videoSrc: hero.videoSrc,
      isLocal: hero.isLocal,
    } as GalleryItem;

    const visibleAlbumIds = albumsWithUploads
      .filter((album) => album.id !== hero.id)
      .map((a) => a.id);

    const TARGET_TOTAL = 20;
    const MIN_PER_ALBUM = 3;
    const albumCount = visibleAlbumIds.length;
    
    // Ensure minimal coverage but fill up to target
    let countPerAlbum = MIN_PER_ALBUM;
    if (albumCount > 0 && albumCount * MIN_PER_ALBUM < TARGET_TOTAL) {
      countPerAlbum = Math.ceil(TARGET_TOTAL / albumCount);
    }

    const selectedItems: GalleryItem[] = [];

    // deterministic shuffle helper
    const getStableRandomSubset = (items: GalleryItem[], count: number) => {
      // Create a deterministic sort based on ID hash
      const sorted = [...items].sort((a, b) => {
        const codeA = a.id.charCodeAt(a.id.length - 1) + a.id.length;
        const codeB = b.id.charCodeAt(b.id.length - 1) + b.id.length;
        return codeA - codeB;
      });
      return sorted.slice(0, count);
    };

    visibleAlbumIds.forEach((albumId) => {
      const albumUploads = uploadsByAlbum[albumId] || [];
      const subset = getStableRandomSubset(albumUploads, countPerAlbum);
      
      selectedItems.push(
        ...subset.map((item) => {
          const album = albums.find((a) => a.id === albumId);
          return {
            ...item,
            title: album ? album.title : item.title,
            detail: album ? album.date : item.detail,
          };
        })
      );
    });

    return [heroItem, ...selectedItems];
  }, [albumsWithUploads, hero, uploadsByAlbum, albums]);

  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : lightboxItems[activeIndex];

  const openLightbox = (id: string, items?: GalleryItem[]) => {
    const source = items && items.length > 0 ? items : galleryItems;
    const index = source.findIndex((item) => item.id === id);
    if (index >= 0) {
      setLightboxItems(source);
      setActiveIndex(index);
    }
  };

  const goToNext = () => {
    setActiveIndex((prev) => {
      if (prev === null || lightboxItems.length === 0) return prev;
      return (prev + 1) % lightboxItems.length;
    });
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => {
      if (prev === null || lightboxItems.length === 0) return prev;
      return (prev - 1 + lightboxItems.length) % lightboxItems.length;
    });
  };

  const handleGalleryClick = (id: string) => {
    setOpenMenuId(null);
    if (galleryClickTimeoutRef.current) {
      window.clearTimeout(galleryClickTimeoutRef.current);
    }
    galleryClickTimeoutRef.current = window.setTimeout(() => {
      if (!isGallerySelectOpen) {
        const galleryItem = galleryItems.find((item) => item.id === id);
        if (galleryItem?.albumId) {
          setSelectedAlbumId(galleryItem.albumId);
          window.location.hash = "#albums";
          return;
        }
        const albumMatch = albums.find((album) => album.id === galleryItem?.id);
        if (albumMatch) {
          setSelectedAlbumId(albumMatch.id);
          window.location.hash = "#albums";
        } else {
          openLightbox(id);
        }
      }
      galleryClickTimeoutRef.current = null;
    }, 200);
  };

  const handleGalleryDoubleClick = () => {
    if (galleryClickTimeoutRef.current) {
      window.clearTimeout(galleryClickTimeoutRef.current);
      galleryClickTimeoutRef.current = null;
    }
    if (!isEditMode) return;
    setIsGallerySelectOpen(true);
  };

  const handleGalleryAlbumDoubleClick = (itemId: string) => {
    if (galleryClickTimeoutRef.current) {
      window.clearTimeout(galleryClickTimeoutRef.current);
      galleryClickTimeoutRef.current = null;
    }
    if (!isEditMode) return;
    const albumMatch = albums.find((album) => album.id === itemId);
    if (albumMatch) {
      const albumItems = uploadsByAlbum[albumMatch.id];
      if (albumItems && albumItems.length > 0) {
        openLightbox(albumItems[0].id, albumItems);
        return;
      }
    }
    handleGalleryDoubleClick();
  };

  const toggleGallerySelection = (id: string) => {
    setSelectedGalleryIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const confirmGalleryDelete = () => {
    if (!pendingGalleryDelete) return;
    const uploadIds = uploads.map((upload) => upload.id);
    if (pendingGalleryDelete === "all") {
      uploadIds.forEach((id) => removeUpload(id));
    } else {
      selectedGalleryIds.filter((id) => uploadIds.includes(id)).forEach((id) => removeUpload(id));
    }
    setPendingGalleryDelete(null);
    setSelectedGalleryIds([]);
  };

  const handleLightboxDelete = () => {
    if (!activeItem || !activeItem.isLocal) return;
    removeUpload(activeItem.id);
    setLightboxItems((prev) => {
      const nextItems = prev.filter((item) => item.id !== activeItem.id);
      if (nextItems.length === 0) {
        setActiveIndex(null);
        return [];
      }
      setActiveIndex((prevIndex) => {
        if (prevIndex === null) return null;
        return prevIndex >= nextItems.length ? nextItems.length - 1 : prevIndex;
      });
      return nextItems;
    });
  };

  const handleThumbPointerDown = () => {
    thumbDragMovedRef.current = false;
    thumbPointerCapturedRef.current = false;
    thumbDragStartXRef.current = 0;
    thumbScrollLeftRef.current = 0;
  };

  function persistSettings(
    overrides?: Partial<{
      content: Content;
      heroHeight: number;
      heroScale: number;
      albumImageHeight: number;
      galleryScale: number;
      heroSourceId: string | null;
      imageEdits: Record<string, ImageEdit>;
      imageNotes: Record<string, string>;
      albums: Album[];
      selectedAlbumId: string;
      timeline: TimelineItem[];
      textOverrides: Record<string, string>;
      globalTheme: Theme;
      albumThemes: Record<string, Theme>;
    }>
  ) {
    if (typeof window === "undefined") return;
    const payload = {
      content,
      heroHeight,
      heroScale,
      albumImageHeight,
      galleryScale,
      heroSourceId,
      imageEdits,
      imageNotes,
      albums,
      selectedAlbumId,
      timeline,
      textOverrides,
      globalTheme,
      albumThemes,
      ...overrides,
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage failures and rely on IndexedDB fallback.
    }
    void saveSettingsToDb(payload as Record<string, unknown>);
  }

  const scrollThumbsBy = (direction: "left" | "right") => {
    const container = thumbStripRef.current;
    if (!container) return;
    const firstThumb = container.querySelector<HTMLElement>(".thumb-card");
    const gapValue = window.getComputedStyle(container).gap;
    const gap = Number.parseFloat(gapValue) || 0;
    const baseStep = firstThumb ? firstThumb.offsetWidth + gap : container.clientWidth * 0.2;
    const step = baseStep * 2;
    container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const requestDeleteAlbum = (album: Album) => {
    if (!isEditMode) return;
    setPendingDelete({ type: "album", id: album.id, label: album.title });
  };

  const requestDeleteUpload = (item: GalleryItem, context?: "lightbox") => {
    if (!isEditMode) return;
    setPendingDelete({
      type: context === "lightbox" ? "lightbox-upload" : "upload",
      id: item.id,
      label: item.title,
    });
  };

  const requestDeleteTimeline = (item: TimelineItem) => {
    if (!isEditMode) return;
    setPendingDelete({ type: "timeline", id: item.id, label: item.title });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === "album") {
      const albumId = pendingDelete.id;
      const albumUploads = uploads.filter((item) => item.albumId === albumId);
      albumUploads.forEach((item) => removeUpload(item.id));
      const nextAlbums = albums.filter((album) => album.id !== albumId);
      const nextSelectedAlbumId =
        selectedAlbumId === albumId ? nextAlbums[0]?.id ?? "" : selectedAlbumId;
      const nextHeroSourceId = heroSourceId === albumId ? null : heroSourceId;
      setAlbums(nextAlbums);
      setSelectedAlbumId(nextSelectedAlbumId);
      if (heroSourceId === albumId) {
        setHeroSourceId(null);
      }
      if (activeItem?.id === albumId) {
        setActiveIndex(null);
        setLightboxItems([]);
      }
      persistSettings({
        albums: nextAlbums,
        selectedAlbumId: nextSelectedAlbumId,
        heroSourceId: nextHeroSourceId,
      });
    } else if (pendingDelete.type === "timeline") {
      const timelineId = pendingDelete.id;
      setTimeline((prev) => prev.filter((item) => item.id !== timelineId));
      setActiveIndex(null);
      setLightboxItems([]);
    } else if (pendingDelete.type === "lightbox-upload") {
      handleLightboxDelete();
    } else {
      removeUpload(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const reorderUploadsForLightbox = (orderedItems: GalleryItem[]) => {
    const ids = orderedItems.map((item) => item.id);
    const idSet = new Set(ids);
    if (!orderedItems.every((item) => item.isLocal)) return;
    setUploads((prev) => {
      const orderedUploads = ids
        .map((id) => prev.find((item) => item.id === id))
        .filter((item): item is GalleryItem => Boolean(item));
      let inserted = false;
      const result: GalleryItem[] = [];
      for (const item of prev) {
        if (!idSet.has(item.id)) {
          result.push(item);
          continue;
        }
        if (!inserted) {
          result.push(...orderedUploads);
          inserted = true;
        }
      }
      if (!inserted) {
        result.push(...orderedUploads);
      }
      return result;
    });
  };

  const reorderLightboxItems = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setLightboxItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      reorderUploadsForLightbox(next);
      return next;
    });
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      if (prev === fromIndex) return toIndex;
      if (fromIndex < toIndex && prev > fromIndex && prev <= toIndex) return prev - 1;
      if (fromIndex > toIndex && prev >= toIndex && prev < fromIndex) return prev + 1;
      return prev;
    });
  };

  const startThumbScroll = (direction: "left" | "right") => {
    if (thumbScrollIntervalRef.current !== null) {
      window.clearInterval(thumbScrollIntervalRef.current);
    }
    thumbScrollIntervalRef.current = window.setInterval(() => {
      scrollThumbsBy(direction);
    }, 240);
  };

  const stopThumbScroll = () => {
    if (thumbScrollIntervalRef.current === null) return;
    window.clearInterval(thumbScrollIntervalRef.current);
    thumbScrollIntervalRef.current = null;
  };

  const handleCoverDragStart = (event: React.DragEvent, upload: GalleryItem) => {
    if (!isEditMode) return;
    event.dataTransfer.setData("text/plain", upload.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleCoverDrop = (event: React.DragEvent, albumId: string) => {
    if (!isEditMode) return;
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(files, albumId);
      return;
    }
    const uploadId = event.dataTransfer.getData("text/plain");
    if (!uploadId) return;
    updateAlbum(albumId, { coverId: uploadId });
  };

  useEffect(() => {
    const preventWindowDrop = (event: DragEvent) => {
      event.preventDefault();
    };
    window.addEventListener("dragover", preventWindowDrop);
    window.addEventListener("drop", preventWindowDrop);
    return () => {
      window.removeEventListener("dragover", preventWindowDrop);
      window.removeEventListener("drop", preventWindowDrop);
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % galleryItems.length;
        });
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null) return prev;
          return (prev - 1 + galleryItems.length) % galleryItems.length;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, lightboxItems.length]);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!activeItem) return;
    setShowLightboxInfo(false);
    setIsLightboxMenuOpen(false);
    setEditorTargetId(null);
    setNoteEditingId(null);
  }, [activeItem?.id]);

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((item) => {
        if (item.isLocal) {
          URL.revokeObjectURL(item.src);
          if (item.videoSrc) {
            URL.revokeObjectURL(item.videoSrc);
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (galleryClickTimeoutRef.current) {
        window.clearTimeout(galleryClickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (albums.length === 0) {
      if (selectedAlbumId) setSelectedAlbumId("");
      return;
    }
    if (!albums.some((album) => album.id === selectedAlbumId)) {
      setSelectedAlbumId(albums[0].id);
    }
  }, [albums, selectedAlbumId]);

  const handleFileDragOver = (event: React.DragEvent) => {
    if (!isEditMode) return;
    if (!event.dataTransfer?.types?.includes("Files")) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleFileDrop = (event: React.DragEvent, albumIdOverride?: string) => {
    if (!isEditMode) return;
    if (!event.dataTransfer?.files?.length) return;
    event.preventDefault();
    event.stopPropagation();
    const targetAlbumId = albumIdOverride || selectedAlbumId || albums[0]?.id || "";
    addFiles(event.dataTransfer.files, targetAlbumId);
  };

  const addFiles = (fileList: FileList | null, albumId: string) => {
    if (!fileList || fileList.length === 0) return;
    const skipped: string[] = [];
    const fileEntries = Array.from(fileList)
      .map((file) => {
        const lowerName = file.name.toLowerCase();
        const isHeic =
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          lowerName.endsWith(".heic") ||
          lowerName.endsWith(".heif");
        if (isHeic) {
          skipped.push(file.name);
          return null;
        }

        const isVideoByType = file.type.startsWith("video/");
        const isVideoByExt = /\.(mp4|mov|webm|mkv|avi)$/i.test(lowerName);
        const isVideo = isVideoByType || isVideoByExt;
        const objectUrl = URL.createObjectURL(file);
        const uid =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const item = {
          id: `${file.name}-${file.lastModified}-${uid}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          detail: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          src: objectUrl,
          alt: file.name,
          type: isVideo ? "video" : "image",
          videoSrc: isVideo ? objectUrl : undefined,
          isLocal: true,
          albumId,
          timestamp: file.lastModified,
        } as GalleryItem;
        return { item, file };
      })
      .filter((entry): entry is { item: GalleryItem; file: File } => Boolean(entry));

    const newItems = fileEntries.map(({ item }) => item);

    setUploads((prev) => [...newItems, ...prev]);

    fileEntries.forEach(({ item, file }) => {
      void saveUploadToDb(item, file);
    });

    if (skipped.length > 0) {
      alert(
        `Skipped ${skipped.length} HEIC/HEIF file(s). Please convert to JPG or PNG.`
      );
    }
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => {
      const item = prev.find((upload) => upload.id === id);
      if (item?.isLocal) {
        URL.revokeObjectURL(item.src);
        if (item.videoSrc) {
          URL.revokeObjectURL(item.videoSrc);
        }
      }
      return prev.filter((upload) => upload.id !== id);
    });
    setImageEdits((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setImageNotes((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    void deleteUploadFromDb(id);
  };

  const updateAlbum = (id: string, patch: Partial<Album>) => {
    setAlbums((prev) =>
      prev.map((album) => (album.id === id ? { ...album, ...patch } : album))
    );
  };

  const updateUpload = (id: string, patch: Partial<GalleryItem>) => {
    setUploads((prev) =>
      prev.map((upload) => (upload.id === id ? { ...upload, ...patch } : upload))
    );
    const dbPatch: Partial<StoredUpload> = {
      title: patch.title,
      detail: patch.detail,
      alt: patch.alt,
    };
    if (patch.albumId !== undefined) {
      dbPatch.albumId = patch.albumId;
    }
    void updateUploadInDb(id, dbPatch);
  };

  const setAlbumCoverFromItem = (albumId: string, item: GalleryItem) => {
    if (!albumId) return;
    updateAlbum(albumId, { coverId: item.id });
  };

  const updateTimelineItem = (id: string, patch: Partial<TimelineItem>) => {
    setTimeline((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const updateGalleryTitle = (id: string, value: string) => {
    if (id === hero.id) {
      if (heroAlbum) {
        updateAlbum(heroAlbum.id, { title: value });
      } else {
        setContent((prev) => ({ ...prev, heroCardTitle: value }));
      }
      return;
    }
    if (albums.some((album) => album.id === id)) {
      updateAlbum(id, { title: value });
      return;
    }
    if (timeline.some((item) => item.id === id)) {
      updateTimelineItem(id, { title: value });
      return;
    }
    if (uploads.some((upload) => upload.id === id)) {
      updateUpload(id, { title: value });
    }
  };

  const defaultImageEdit: ImageEdit = { scale: 1, offsetX: 0, offsetY: 0 };

  const getMediaKey = (item: GalleryItem) => item.mediaId ?? item.id;

  const getImageEdit = (item: GalleryItem) =>
    imageEdits[getMediaKey(item)] ?? defaultImageEdit;

  const getMediaStyle = (item: GalleryItem): CSSProperties | undefined => {
    const edit = imageEdits[getMediaKey(item)];
    if (!edit) return undefined;
    return {
      transform: `translate(${edit.offsetX}%, ${edit.offsetY}%) scale(${edit.scale})`,
      transformOrigin: "center",
    };
  };

  const updateImageEdit = (item: GalleryItem, patch: Partial<ImageEdit>) => {
    const key = getMediaKey(item);
    setImageEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? defaultImageEdit), ...patch },
    }));
  };

  const resetImageEdit = (item: GalleryItem) => {
    const key = getMediaKey(item);
    setImageEdits((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const setImageNote = (item: GalleryItem, value: string) => {
    const key = getMediaKey(item);
    setImageNotes((prev) => ({ ...prev, [key]: value }));
  };

  const getImageNote = (item: GalleryItem) => imageNotes[getMediaKey(item)] ?? "";

  const handleMoveToAlbum = (item: GalleryItem, albumId: string) => {
    if (!albumId || !item.isLocal) return;
    updateUpload(item.id, { albumId });
  };

  const handleDeleteItem = (item: GalleryItem, context?: "lightbox") => {
    if (item.isLocal) {
      requestDeleteUpload(item, context);
      return;
    }
    const albumMatch = albums.find((album) => album.id === item.id);
    if (albumMatch) {
      requestDeleteAlbum(albumMatch);
      return;
    }
    const timelineMatch = timeline.find((moment) => moment.id === item.id);
    if (timelineMatch) {
      requestDeleteTimeline(timelineMatch);
    }
  };

  const getSourceLabel = (item: GalleryItem) => {
    if (item.id === hero.id) {
      return heroAlbum ? `Hero · ${heroAlbum.title}` : "Hero · Sunday Light";
    }
    const albumMatch = albums.find((album) => album.id === item.id);
    if (albumMatch) return `Album · ${albumMatch.title}`;
    const timelineMatch = timeline.find((moment) => moment.id === item.id);
    if (timelineMatch) return "Timeline";
    if (item.albumId) {
      const parentAlbum = albums.find((album) => album.id === item.albumId);
      return parentAlbum ? `Album · ${parentAlbum.title}` : "Album · Unsorted";
    }
    return "Upload";
  };

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId);
  const hasAlbumTheme = Boolean(albumThemes[selectedAlbumId]);
  const uploadsForSelectedAlbum = uploads.filter(
    (upload) => upload.albumId === selectedAlbumId
  );
  const uploadPreviewHeight = Math.max(180, Math.round(albumImageHeight * 1.1));
  const albumUploadThumbHeight = Math.max(96, Math.round(albumImageHeight * 0.55));

  const createAlbum = () => {
    const trimmedTitle = newAlbumTitle.trim();
    if (!trimmedTitle) return;
    const now = new Date();
    const dateLabel = now.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    const newId = `album-${trimmedTitle.toLowerCase().replace(/\s+/g, "-")}-${now.getTime()}`;

    const newAlbum: Album = {
      id: newId,
      title: trimmedTitle,
      count: "0 uploads",
      date: dateLabel,
      mood: "New collection.",
      privacy: "Private link",
      src: "/media/album-winter-kitchen.svg",
      alt: `${trimmedTitle} cover`,
      type: "image",
    };

    setAlbums((prev) => [newAlbum, ...prev]);
    setSelectedAlbumId(newId);
    setNewAlbumTitle("");
  };

  const closeGallerySelection = () => {
    setIsGallerySelectOpen(false);
    setSelectedGalleryIds([]);
    setPendingGalleryDelete(null);
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordInput === EDIT_PASSWORD) {
      setAccessLevel("edit");
      setShowAuth(false);
      setAuthError("");
      setPasswordInput("");
      return;
    }
    setAuthError("Password not recognized.");
  };

  const EditableText = ({
    as: Tag,
    value,
    onChange,
    className,
    multiline = false,
    editable = true,
  }: EditableTextProps) => {
    if (!isEditMode || !editable) {
      return <Tag className={className}>{value}</Tag>;
    }

    return (
      <Tag
        className={`editable-text ${className ?? ""}`}
        contentEditable
        suppressContentEditableWarning
        onClick={(event: ReactMouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
          if (!multiline && event.key === "Enter") {
            event.preventDefault();
            (event.currentTarget as HTMLElement).blur();
          }
        }}
        onBlur={(event: FocusEvent<HTMLElement>) => {
          const text = event.currentTarget.textContent ?? "";
          const next = multiline
            ? text.replace(/\n{3,}/g, "\n\n").trim()
            : text.trim();
          if (next !== value) {
            pushHistory();
            onChange(next);
          }
        }}
      >
        {value}
      </Tag>
    );
  };

  const visibleTimeline = useMemo(() => {
    if (uploads.length < 3) return timeline;

    const sortedUploads = [...uploads].sort((a, b) => {
        const timeA = a.timestamp ?? 0;
        const timeB = b.timestamp ?? 0;
        return timeB - timeA;
    });

    const recent = sortedUploads.slice(0, 3).map((item) => {
       const album = albums.find(a => a.id === item.albumId);
       const date = item.timestamp ? new Date(item.timestamp) : new Date();
       
       let dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
       const today = new Date();
       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       
       if (date.toDateString() === today.toDateString()) {
           dateStr = "Today";
       } else if (date.toDateString() === yesterday.toDateString()) {
           dateStr = "Yesterday";
       }

       return {
         id: `moment-${item.id}`,
         date: dateStr,
         title: album ? album.title : "Recent Upload",
         detail: album ? album.date : item.detail,
         src: item.src,
         alt: item.alt,
         type: item.type,
         videoSrc: item.videoSrc,
         isGenerated: true,
       } as TimelineItem & { isGenerated?: boolean };
    });

    return recent;
  }, [uploads, timeline, albums]);

  return (
    <div
      className={`${
        effectiveTheme.texture !== "none" ? "" : "page-background"
      } min-h-screen theme-root`}
      style={themeStyle}
      onDragOver={handleFileDragOver}
      onDrop={(event) => handleFileDrop(event)}
    >
      <div className="grain">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10 sm:px-10">
          <div>
            <EditableText
              as="p"
              value={content.siteKicker}
              onChange={(value) => {
                setContent((prev) => {
                  const updated = { ...prev, siteKicker: value };
                  localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                  return updated;
                });
              }}
              className={`font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] ${labelEffectClass}`}
            />
            <EditableText
              as="h1"
              value={content.siteTitle}
              onChange={(value) => {
                setContent((prev) => {
                  const updated = { ...prev, siteTitle: value };
                  localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                  return updated;
                });
              }}
              className={`font-display text-2xl text-[color:var(--ink)] ${displayEffectClass}`}
            />
          </div>
          <nav className="hidden items-center gap-6 font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--ink)] sm:flex">
            <a className="transition-opacity hover:opacity-70" href="#albums">
              <EditableText
                as="span"
                value={resolveText("nav.albums", "albums")}
                onChange={(value) => updateOverride("nav.albums", value)}
                className={labelEffectClass}
                editable={false}
              />
            </a>
            <a className="transition-opacity hover:opacity-70" href="#gallery">
              <EditableText
                as="span"
                value={resolveText("nav.gallery", "gallery")}
                onChange={(value) => updateOverride("nav.gallery", value)}
                className={labelEffectClass}
                editable={false}
              />
            </a>
            <a className="transition-opacity hover:opacity-70" href="#timeline">
              <EditableText
                as="span"
                value={resolveText("nav.timeline", "timeline")}
                onChange={(value) => updateOverride("nav.timeline", value)}
                className={labelEffectClass}
                editable={false}
              />
            </a>
            {isEditMode ? (
              <a className="transition-opacity hover:opacity-70" href="#upload">
                <EditableText
                  as="span"
                  value={resolveText("nav.upload", "upload")}
                  onChange={(value) => updateOverride("nav.upload", value)}
                  className={labelEffectClass}
                  editable={false}
                />
              </a>
            ) : null}
            <a className="transition-opacity hover:opacity-70" href="#about">
              <EditableText
                as="span"
                value={resolveText("nav.about", "about")}
                onChange={(value) => updateOverride("nav.about", value)}
                className={labelEffectClass}
                editable={false}
              />
            </a>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]">
              {accessLevel}
            </span>
            {accessLevel === "edit" ? (
              <>
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                >
                  undo
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em] disabled:opacity-50"
                  onClick={handleRedo}
                  disabled={future.length === 0}
                >
                  redo
                </button>
              </>
            ) : null}
            {accessLevel === "edit" && (!editorWindow || editorWindow.closed) ? (
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                onClick={openEditorWindow}
              >
                editor
              </button>
            ) : null}
            {accessLevel === "view" ? (
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                onClick={() => {
                  setShowAuth(true);
                  setAuthError("");
                }}
              >
                <EditableText
                  as="span"
                  value={resolveText("controls.edit", "edit")}
                  onChange={(value) => updateOverride("controls.edit", value)}
                  className={labelEffectClass}
                  editable={false}
                />
              </button>
            ) : null}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 sm:px-10">
          <HeroSection
            content={content}
            setContent={setContent}
            hero={hero}
            heroAlbum={heroAlbum}
            heroHeight={heroHeight}
            heroScale={heroScale}
            heroSourceId={heroSourceId}
            setHeroSourceId={setHeroSourceId}
            openLightbox={openLightbox}
            updateAlbum={updateAlbum}
            requestDeleteAlbum={requestDeleteAlbum}
            resolveAssetSrc={resolveAssetSrc}
            getMediaStyle={getMediaStyle}
            albums={albums}
            isEditMode={isEditMode}
            displayEffectClass={displayEffectClass}
            labelEffectClass={labelEffectClass}
            bodyEffectClass={bodyEffectClass}
            EditableText={EditableText}
          />

          {editorContainer && isEditMode
            ? createPortal(
                <div className="theme-root" style={themeStyle}>
                  <div className="page-background min-h-screen">
                    <div className="grain min-h-screen">
                      <div className="mx-auto w-full max-w-3xl p-6">
                        <div className="paper-card overflow-hidden">
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--muted)]/40 px-6 py-4">
                            <div>
                              <p className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                                edit mode
                              </p>
                              <h3 className="font-display text-2xl">Content and layout</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                                onClick={handleUndo}
                                disabled={history.length === 0}
                              >
                                undo
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                                onClick={handleRedo}
                                disabled={future.length === 0}
                              >
                                redo
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                                onClick={maximizeEditorWindow}
                              >
                                max
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                                onClick={() => {
                                  if (history.length > 0) {
                                    handleUndo();
                                  }
                                  closeEditorWindow(true);
                                }}
                                disabled={history.length === 0}
                              >
                                undo + close
                              </button>
                              <button
                                type="button"
                                className="rounded-full bg-[color:var(--accent)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]"
                                onClick={() => closeEditorWindow(false)}
                              >
                                close
                              </button>
                            </div>
                          </div>
                          <section id="edit" className="px-6 py-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-sm text-[color:var(--ink)]/70">
                                Changes are local to this browser session.
                              </p>
                            </div>
                            
                            <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--muted)]/40 p-4 text-sm">
                              <table className="w-full text-left">
                                <thead>
                                  <tr className="border-b border-[color:var(--muted)]/20 text-[color:var(--muted)] font-ui text-xs uppercase tracking-[0.2em]">
                                    <th className="pb-2">Stat</th>
                                    <th className="pb-2 text-right">Value</th>
                                  </tr>
                                </thead>
                                <tbody className="font-display">
                                  <tr>
                                    <td className="py-2">Current Site</td>
                                    <td className="py-2 text-right">{content.siteTitle}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">Total Photos</td>
                                    <td className="py-2 text-right">{uploads.length}</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">Space Used</td>
                                    <td className="py-2 text-right">{totalSizeMb} MB</td>
                                  </tr>
                                   <tr>
                                    <td className="py-2">Albums</td>
                                    <td className="py-2 text-right">{albums.length}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Site title
                  </span>
                  <input
                    value={content.siteTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, siteTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Site kicker
                  </span>
                  <input
                    value={content.siteKicker}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, siteKicker: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero date
                  </span>
                  <input
                    value={content.heroDate}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, heroDate: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero headline
                  </span>
                  <input
                    value={content.heroHeadline}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, heroHeadline: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero intro
                  </span>
                  <textarea
                    value={content.heroIntro}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, heroIntro: event.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero card title
                  </span>
                  <input
                    value={content.heroCardTitle}
                    onChange={(event) => {
                      setContent((prev) => {
                        const updated = { ...prev, heroCardTitle: event.target.value };
                        localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                        return updated;
                      });
                    }}
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero card detail
                  </span>
                  <input
                    value={content.heroCardDetail}
                    onChange={(event) => {
                      setContent((prev) => {
                        const updated = { ...prev, heroCardDetail: event.target.value };
                        localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                        return updated;
                      });
                    }}
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Gallery title
                  </span>
                  <input
                    value={content.galleryTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, galleryTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Gallery description
                  </span>
                  <input
                    value={content.galleryDescription}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, galleryDescription: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Albums title
                  </span>
                  <input
                    value={content.albumsTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, albumsTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Upload title
                  </span>
                  <input
                    value={content.uploadTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, uploadTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Upload description
                  </span>
                  <input
                    value={content.uploadDescription}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, uploadDescription: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Timeline title
                  </span>
                  <input
                    value={content.timelineTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, timelineTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Timeline description
                  </span>
                  <input
                    value={content.timelineDescription}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, timelineDescription: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    About title
                  </span>
                  <input
                    value={content.aboutTitle}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, aboutTitle: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    About body
                  </span>
                  <textarea
                    value={content.aboutBody}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, aboutBody: event.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Contact label
                  </span>
                  <input
                    value={content.contactLabel}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, contactLabel: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Contact text
                  </span>
                  <input
                    value={content.contactText}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, contactText: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Contact email
                  </span>
                  <input
                    value={content.contactEmail}
                    onChange={(event) =>
                      setContent((prev) => ({ ...prev, contactEmail: event.target.value }))
                    }
                    className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                  />
                </label>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero height
                  </span>
                  <input
                    type="range"
                    min={220}
                    max={420}
                    value={heroHeight}
                    onChange={(event) => setHeroHeight(Number(event.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-[color:var(--ink)]/70">{heroHeight}px</p>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Hero scale
                  </span>
                  <input
                    type="range"
                    min={100}
                    max={150}
                    value={Math.round(heroScale * 100)}
                    onChange={(event) => setHeroScale(Number(event.target.value) / 100)}
                    className="w-full"
                  />
                  <p className="text-xs text-[color:var(--ink)]/70">{Math.round(heroScale * 100)}%</p>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Album image height
                  </span>
                  <input
                    type="range"
                    min={120}
                    max={260}
                    value={albumImageHeight}
                    onChange={(event) => setAlbumImageHeight(Number(event.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-[color:var(--ink)]/70">{albumImageHeight}px</p>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Gallery scale
                  </span>
                  <input
                    type="range"
                    min={90}
                    max={110}
                    value={Math.round(galleryScale * 100)}
                    onChange={(event) =>
                      setGalleryScale(Number(event.target.value) / 100)
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-[color:var(--ink)]/70">
                    {Math.round(galleryScale * 100)}%
                  </p>
                </label>
              </div>
                          </section>
                          <section id="design" className="border-t border-[color:var(--muted)]/40 px-6 py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                      design studio
                    </p>
                    <h3 className="font-display text-2xl">Palette, fonts, effects</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                      onClick={handleUndo}
                      disabled={history.length === 0}
                    >
                      undo
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                      onClick={handleRedo}
                      disabled={future.length === 0}
                    >
                      redo
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-display text-lg">Theme presets</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {themePresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            pushHistory();
                            setTheme(cloneTheme(preset));
                          }}
                          onMouseEnter={() => setPreviewTheme(cloneTheme(preset))}
                          onMouseLeave={() => setPreviewTheme(null)}
                          className="rounded-xl border border-[color:var(--muted)] p-4 text-left transition-transform hover:-translate-y-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-5 w-5 rounded-full border border-white/40"
                              style={{ background: preset.palette.paper }}
                            />
                            <span
                              className="h-5 w-5 rounded-full border border-white/40"
                              style={{ background: preset.palette.paper2 }}
                            />
                            <span
                              className="h-5 w-5 rounded-full border border-white/40"
                              style={{ background: preset.palette.accent }}
                            />
                            <span
                              className="h-5 w-5 rounded-full border border-white/40"
                              style={{ background: preset.palette.ink }}
                            />
                          </div>
                          <p className="mt-3 font-display text-base">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-display text-lg">Palette</h4>
                    <div className="grid gap-3">
                      {paletteFields.map((field) => (
                        <label key={field.key} className="space-y-2 text-sm">
                          <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            {field.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={paletteDraft[field.key]}
                              onMouseEnter={() =>
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: paletteDraft,
                                    fonts: theme.fonts,
                                    effects: theme.effects,
                                  })
                                )
                              }
                              onMouseLeave={() => setPreviewTheme(null)}
                              onFocus={() => {
                                beginEditSession();
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: paletteDraft,
                                    fonts: theme.fonts,
                                    effects: theme.effects,
                                  })
                                );
                              }}
                              onBlur={() => {
                                endEditSession();
                                setPreviewTheme(null);
                              }}
                              onChange={(event) =>
                                setPaletteDraft((prev) => {
                                  const next = {
                                    ...prev,
                                    [field.key]: event.target.value,
                                  };
                                  setPreviewTheme(
                                    cloneTheme({
                                      palette: next,
                                      fonts: theme.fonts,
                                      effects: theme.effects,
                                    })
                                  );
                                  return next;
                                })
                              }
                              className="h-10 w-12 rounded-lg border border-[color:var(--muted)] bg-transparent"
                            />
                            <input
                              type="text"
                              value={paletteDraft[field.key]}
                              onMouseEnter={() =>
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: paletteDraft,
                                    fonts: theme.fonts,
                                    effects: theme.effects,
                                  })
                                )
                              }
                              onMouseLeave={() => setPreviewTheme(null)}
                              onFocus={() => {
                                beginEditSession();
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: paletteDraft,
                                    fonts: theme.fonts,
                                    effects: theme.effects,
                                  })
                                );
                              }}
                              onBlur={() => {
                                endEditSession();
                                setPreviewTheme(null);
                              }}
                              onChange={(event) =>
                                setPaletteDraft((prev) => {
                                  const next = {
                                    ...prev,
                                    [field.key]: event.target.value,
                                  };
                                  setPreviewTheme(
                                    cloneTheme({
                                      palette: next,
                                      fonts: theme.fonts,
                                      effects: theme.effects,
                                    })
                                  );
                                  return next;
                                })
                              }
                              className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                            />
                          </div>
                        </label>
                      ))}
                      <button
                        type="button"
                        className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                        onClick={() => {
                          pushHistory();
                          setTheme((prev) => ({
                            ...prev,
                            palette: { ...paletteDraft },
                          }));
                          setPreviewTheme(null);
                        }}
                      >
                        apply palette
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-display text-lg">Fonts</h4>
                    <div className="grid gap-3">
                      <label className="space-y-2 text-sm">
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          Display font
                        </span>
                        <select
                          className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                          value={theme.fonts.display}
                          onFocus={beginEditSession}
                          onBlur={endEditSession}
                          onChange={(event) =>
                            setTheme((prev) => ({
                              ...prev,
                              fonts: { ...prev.fonts, display: event.target.value },
                            }))
                          }
                        >
                          {displayFontOptions.map((option) => (
                            <option key={option.id} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {displayFontOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className="rounded-lg border border-[color:var(--muted)] px-3 py-2 text-left"
                            onClick={() => {
                              pushHistory();
                              setTheme((prev) => ({
                                ...prev,
                                fonts: { ...prev.fonts, display: option.value },
                              }));
                            }}
                            onMouseEnter={() =>
                              setPreviewTheme(
                                cloneTheme({
                                  palette: theme.palette,
                                  fonts: { ...theme.fonts, display: option.value },
                                  effects: theme.effects,
                                })
                              )
                            }
                            onMouseLeave={() => setPreviewTheme(null)}
                          >
                            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                              {option.label}
                            </p>
                            <p
                              className="mt-1 text-lg"
                              style={{ fontFamily: option.value }}
                            >
                              Sunday Album
                            </p>
                          </button>
                        ))}
                      </div>
                      <label className="space-y-2 text-sm">
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          Body font
                        </span>
                        <select
                          className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                          value={theme.fonts.body}
                          onFocus={beginEditSession}
                          onBlur={endEditSession}
                          onChange={(event) =>
                            setTheme((prev) => ({
                              ...prev,
                              fonts: { ...prev.fonts, body: event.target.value },
                            }))
                          }
                        >
                          {bodyFontOptions.map((option) => (
                            <option key={option.id} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {bodyFontOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className="rounded-lg border border-[color:var(--muted)] px-3 py-2 text-left"
                            onClick={() => {
                              pushHistory();
                              setTheme((prev) => ({
                                ...prev,
                                fonts: { ...prev.fonts, body: option.value },
                              }));
                            }}
                            onMouseEnter={() =>
                              setPreviewTheme(
                                cloneTheme({
                                  palette: theme.palette,
                                  fonts: { ...theme.fonts, body: option.value },
                                  effects: theme.effects,
                                })
                              )
                            }
                            onMouseLeave={() => setPreviewTheme(null)}
                          >
                            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                              {option.label}
                            </p>
                            <p
                              className="mt-1 text-sm"
                              style={{ fontFamily: option.value }}
                            >
                              A quiet feed of the week, saved in order.
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-4 pb-6 border-b border-[color:var(--muted)]/20 mb-6">
                      <h4 className="font-display text-lg">Paper Texture</h4>
                      <div className="grid grid-cols-2 gap-2">
                         {textureOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={`relative flex h-20 w-full flex-col justify-end overflow-hidden rounded-lg border text-left transition-all hover:scale-[1.02] ${
                              theme.texture === option.id
                                ? "border-[color:var(--accent)] ring-1 ring-[color:var(--accent)] shadow-md"
                                : "border-[color:var(--muted)]"
                            }`}
                            onClick={() => {
                               pushHistory();
                               setTheme((prev) => ({ ...prev, texture: option.id }));
                            }}
                            onMouseEnter={() =>
                              setPreviewTheme(
                                cloneTheme({
                                  ...theme,
                                  texture: option.id,
                                })
                              )
                            }
                            onMouseLeave={() => setPreviewTheme(null)}
                          >
                            <div 
                              className="absolute inset-0 z-0 bg-[color:var(--paper)]" 
                              style={{ 
                                  backgroundImage: option.value, 
                                  backgroundSize: option.size
                              }} 
                             />
                            <span className="relative z-10 font-ui text-[10px] uppercase tracking-wider text-[color:var(--ink)] bg-white/60 px-1.5 py-0.5 rounded-tr-md rounded-bl-md backdrop-blur-sm self-start">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-display text-lg">Text effects</h4>
                    <div className="grid gap-3">
                      <label className="space-y-2 text-sm">
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          Display
                        </span>
                        <select
                          className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                          value={theme.effects.display}
                          onFocus={beginEditSession}
                          onBlur={endEditSession}
                          onChange={(event) =>
                            setTheme((prev) => ({
                              ...prev,
                              effects: {
                                ...prev.effects,
                                display: event.target.value as TextEffect,
                              },
                            }))
                          }
                        >
                          {effectOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              onMouseEnter={() =>
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: theme.palette,
                                    fonts: theme.fonts,
                                    effects: {
                                      ...theme.effects,
                                      display: option.id,
                                    },
                                  })
                                )
                              }
                              onMouseLeave={() => setPreviewTheme(null)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm">
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          Body
                        </span>
                        <select
                          className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                          value={theme.effects.body}
                          onFocus={beginEditSession}
                          onBlur={endEditSession}
                          onChange={(event) =>
                            setTheme((prev) => ({
                              ...prev,
                              effects: {
                                ...prev.effects,
                                body: event.target.value as TextEffect,
                              },
                            }))
                          }
                        >
                          {effectOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              onMouseEnter={() =>
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: theme.palette,
                                    fonts: theme.fonts,
                                    effects: { ...theme.effects, body: option.id },
                                  })
                                )
                              }
                              onMouseLeave={() => setPreviewTheme(null)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm">
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          Labels
                        </span>
                        <select
                          className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
                          value={theme.effects.label}
                          onFocus={beginEditSession}
                          onBlur={endEditSession}
                          onChange={(event) =>
                            setTheme((prev) => ({
                              ...prev,
                              effects: {
                                ...prev.effects,
                                label: event.target.value as TextEffect,
                              },
                            }))
                          }
                        >
                          {effectOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              onMouseEnter={() =>
                                setPreviewTheme(
                                  cloneTheme({
                                    palette: theme.palette,
                                    fonts: theme.fonts,
                                    effects: { ...theme.effects, label: option.id },
                                  })
                                )
                              }
                              onMouseLeave={() => setPreviewTheme(null)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="rounded-lg border border-[color:var(--muted)] p-4">
                      <p className={`font-display text-lg ${displayEffectClass}`}>
                        Headline preview
                      </p>
                      <p className={`mt-2 text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
                        Body preview with the current palette and font settings.
                      </p>
                      <p className={`mt-2 font-ui text-xs uppercase tracking-[0.2em] ${labelEffectClass}`}>
                        Label preview
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[color:var(--ink)]/70">
                      Editing theme for: {selectedAlbum?.title ?? "No album"}
                    </p>
                    {hasAlbumTheme ? (
                      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--olive)]">
                        Album override active
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                      onClick={() => {
                        pushHistory();
                        if (!selectedAlbumId) return;
                        setAlbumThemes((prev) => ({
                          ...prev,
                          [selectedAlbumId]: cloneTheme(theme),
                        }));
                      }}
                    >
                      apply to current album
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-[color:var(--accent)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]"
                      onClick={() => {
                        pushHistory();
                        setGlobalTheme(cloneTheme(theme));
                      }}
                    >
                      apply to all albums
                    </button>
                    {hasAlbumTheme ? (
                      <button
                        type="button"
                        className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                        onClick={() => {
                          pushHistory();
                          setAlbumThemes((prev) => {
                            const next = { ...prev };
                            delete next[selectedAlbumId];
                            return next;
                          });
                          setTheme(globalTheme);
                        }}
                      >
                        use global
                      </button>
                    ) : null}
                  </div>
                </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>,
                editorContainer
              )
            : null}

          <GallerySection
            content={content}
            setContent={setContent}
            galleryItems={galleryItems}
            albums={albums}
            selectedAlbumId={selectedAlbumId}
            uploadsCount={uploads.length}
            isEditMode={isEditMode}
            isGallerySelectOpen={isGallerySelectOpen}
            selectedGalleryIds={selectedGalleryIds}
            pendingGalleryDelete={pendingGalleryDelete}
            galleryScale={galleryScale}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            setIsGallerySelectOpen={setIsGallerySelectOpen}
            setPendingGalleryDelete={setPendingGalleryDelete}
            closeSelection={closeGallerySelection}
            toggleGallerySelection={toggleGallerySelection}
            confirmGalleryDelete={confirmGalleryDelete}
            handleGalleryClick={handleGalleryClick}
            handleGalleryAlbumDoubleClick={handleGalleryAlbumDoubleClick}
            addFiles={addFiles}
            updateGalleryTitle={updateGalleryTitle}
            handleMoveToAlbum={handleMoveToAlbum}
            setAlbumCoverFromItem={setAlbumCoverFromItem}
            handleDeleteItem={handleDeleteItem}
            openLightbox={openLightbox}
            setEditorTargetId={setEditorTargetId}
            setNoteEditingId={setNoteEditingId}
            getMediaKey={getMediaKey}
            resolveText={resolveText}
            updateOverride={updateOverride}
            resolveAssetSrc={resolveAssetSrc}
            getMediaStyle={getMediaStyle}
            displayEffectClass={displayEffectClass}
            labelEffectClass={labelEffectClass}
            bodyEffectClass={bodyEffectClass}
            EditableText={EditableText}
          />

          <AlbumsSection
            content={content}
            setContent={setContent}
            albums={albums}
            visibleAlbums={visibleAlbums}
            uploadsByAlbum={uploadsByAlbum}
            uploadCounts={uploadCounts}
            albumMediaCounts={albumMediaCounts}
            albumImageHeight={albumImageHeight}
            albumUploadThumbHeight={albumUploadThumbHeight}
            isEditMode={isEditMode}
            selectedAlbumId={selectedAlbumId}
            resolveText={resolveText}
            updateOverride={updateOverride}
            formatAlbumCount={formatAlbumCount}
            updateAlbum={updateAlbum}
            requestDeleteAlbum={requestDeleteAlbum}
            requestDeleteUpload={requestDeleteUpload}
            openLightbox={openLightbox}
            handleFileDragOver={handleFileDragOver}
            handleCoverDrop={handleCoverDrop}
            handleCoverDragStart={handleCoverDragStart}
            addFiles={addFiles}
            resolveAssetSrc={resolveAssetSrc}
            getMediaStyle={getMediaStyle}
            displayEffectClass={displayEffectClass}
            labelEffectClass={labelEffectClass}
            bodyEffectClass={bodyEffectClass}
            EditableText={EditableText}
          />

          <UploadSection
            content={content}
            setContent={setContent}
            albums={albums}
            selectedAlbum={selectedAlbum}
            selectedAlbumId={selectedAlbumId}
            setSelectedAlbumId={setSelectedAlbumId}
            newAlbumTitle={newAlbumTitle}
            setNewAlbumTitle={setNewAlbumTitle}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadsForSelectedAlbum={uploadsForSelectedAlbum}
            uploadsByAlbum={uploadsByAlbum}
            uploadPreviewHeight={uploadPreviewHeight}
            isEditMode={isEditMode}
            resolveText={resolveText}
            updateOverride={updateOverride}
            createAlbum={createAlbum}
            addFiles={addFiles}
            handleCoverDragStart={handleCoverDragStart}
            updateAlbum={updateAlbum}
            openLightbox={openLightbox}
            requestDeleteUpload={requestDeleteUpload}
            resolveAssetSrc={resolveAssetSrc}
            getMediaStyle={getMediaStyle}
            displayEffectClass={displayEffectClass}
            labelEffectClass={labelEffectClass}
            bodyEffectClass={bodyEffectClass}
            EditableText={EditableText}
          />

          <TimelineSection
              content={content}
              setContent={setContent}
              visibleTimeline={visibleTimeline}
              isEditMode={isEditMode}
              resolveText={resolveText}
              updateOverride={updateOverride}
              updateTimelineItem={updateTimelineItem}
              requestDeleteTimeline={requestDeleteTimeline}
              openLightbox={openLightbox}
              resolveAssetSrc={resolveAssetSrc}
              displayEffectClass={displayEffectClass}
              labelEffectClass={labelEffectClass}
              bodyEffectClass={bodyEffectClass}
              EditableText={EditableText}
              uploads={uploads}
            />

          <AboutSection
            content={content}
            setContent={setContent}
            resolveText={resolveText}
            updateOverride={updateOverride}
            displayEffectClass={displayEffectClass}
            labelEffectClass={labelEffectClass}
            bodyEffectClass={bodyEffectClass}
            EditableText={EditableText}
          />
        </main>
      </div>
      {showAuth ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[color:var(--ink)]/70 p-6">
          <form
            onSubmit={handleAuthSubmit}
            className="paper-card w-full max-w-md space-y-4 p-6"
          >
            <div className="space-y-2">
              <EditableText
                as="p"
                value={resolveText("auth.kicker", "secure access")}
                onChange={(value) => updateOverride("auth.kicker", value)}
                className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
              />
              <EditableText
                as="h3"
                value={resolveText("auth.title", "Enter password")}
                onChange={(value) => updateOverride("auth.title", value)}
                className={`font-display text-2xl ${displayEffectClass}`}
              />
              <EditableText
                as="p"
                value={resolveText(
                  "auth.note",
                  "Enter the edit password to change content."
                )}
                onChange={(value) => updateOverride("auth.note", value)}
                className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
              />
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              className="w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2"
              placeholder={resolveText("auth.placeholder", "Password")}
              autoFocus
            />
            {authError ? (
              <p className="text-sm text-[color:var(--accent)]">{authError}</p>
            ) : null}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                onClick={() => setShowAuth(false)}
              >
                <EditableText
                  as="span"
                  value={resolveText("auth.cancel", "cancel")}
                  onChange={(value) => updateOverride("auth.cancel", value)}
                  className={labelEffectClass}
                  editable={false}
                />
              </button>
              <button
                type="submit"
                className="rounded-full bg-[color:var(--accent)] px-5 py-2 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]"
              >
                <EditableText
                  as="span"
                  value={resolveText("auth.unlock", "unlock")}
                  onChange={(value) => updateOverride("auth.unlock", value)}
                  className={labelEffectClass}
                  editable={false}
                />
              </button>
            </div>
          </form>
        </div>
      ) : null}
      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--ink)]/70 p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close lightbox"
            onClick={() => {
              setActiveIndex(null);
              setLightboxItems([]);
            }}
          />
          <div className="relative z-10 w-full max-w-6xl">
            <div className="paper-card relative overflow-hidden p-3">
              {isEditMode ? (
                <div className="absolute left-4 top-4 z-20">
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] bg-[color:var(--paper)] px-3 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                    onClick={() => setIsLightboxMenuOpen((prev) => !prev)}
                  >
                    menu
                  </button>
                  {isLightboxMenuOpen ? (
                    <div className="mt-2 w-64 rounded-xl border border-[color:var(--muted)] bg-[color:var(--paper)] p-3 text-xs uppercase tracking-[0.18em] text-[color:var(--ink)] shadow-[0_18px_30px_rgba(43,39,35,0.12)]">
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] text-[color:var(--muted)]">edit</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-[color:var(--muted)] px-3 py-1"
                              onClick={() => {
                                setEditorTargetId(getMediaKey(activeItem));
                                setIsLightboxMenuOpen(false);
                              }}
                            >
                              crop
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-[color:var(--muted)] px-3 py-1"
                              onClick={() => {
                                setEditorTargetId(getMediaKey(activeItem));
                                setIsLightboxMenuOpen(false);
                              }}
                            >
                              resize
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-[color:var(--muted)]">move</p>
                          <select
                            className="mt-2 w-full rounded-full border border-[color:var(--muted)] bg-transparent px-3 py-1"
                            defaultValue=""
                            disabled={!activeItem.isLocal}
                            onChange={(event) => {
                              const albumId = event.currentTarget.value;
                              if (!albumId) return;
                              handleMoveToAlbum(activeItem, albumId);
                              event.currentTarget.value = "";
                              setIsLightboxMenuOpen(false);
                            }}
                          >
                            <option value="" disabled>
                              select album
                            </option>
                            {albums.map((album) => (
                              <option key={`move-${activeItem.id}-${album.id}`} value={album.id}>
                                {album.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p className="text-[10px] text-[color:var(--muted)]">set cover</p>
                          <select
                            className="mt-2 w-full rounded-full border border-[color:var(--muted)] bg-transparent px-3 py-1"
                            defaultValue=""
                            disabled={!activeItem.isLocal}
                            onChange={(event) => {
                              const albumId = event.currentTarget.value;
                              if (!albumId) return;
                              setAlbumCoverFromItem(albumId, activeItem);
                              event.currentTarget.value = "";
                              setIsLightboxMenuOpen(false);
                            }}
                          >
                            <option value="" disabled>
                              select album
                            </option>
                            {albums.map((album) => (
                              <option key={`cover-${activeItem.id}-${album.id}`} value={album.id}>
                                {album.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full rounded-full border border-[color:var(--muted)] px-3 py-2"
                            onClick={() => {
                              setNoteEditingId(getMediaKey(activeItem));
                              setIsLightboxMenuOpen(false);
                            }}
                          >
                            add text
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full rounded-full border border-[color:var(--muted)] px-3 py-2"
                            onClick={() => {
                              handleDeleteItem(activeItem, "lightbox");
                              setIsLightboxMenuOpen(false);
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div
                className="relative h-[75vh] w-full overflow-hidden rounded-xl bg-transparent"
                onClick={() => {
                  if (!isEditMode) return;
                  setShowLightboxInfo((prev) => !prev);
                }}
              >
                {activeItem.type === "video" && activeItem.videoSrc ? (
                  <video
                    controls
                    className="h-full w-full rounded-xl object-cover"
                    src={resolveAssetSrc(activeItem.videoSrc)}
                    preload="metadata"
                    style={getMediaStyle(activeItem)}
                  />
                ) : activeItem.isLocal ? (
                  <img
                    src={resolveAssetSrc(activeItem.src)}
                    alt={activeItem.alt}
                    className="h-full w-full rounded-xl object-cover"
                    style={getMediaStyle(activeItem)}
                  />
                ) : (
                  <Image
                    src={resolveAssetSrc(activeItem.src)}
                    alt={activeItem.alt}
                    fill
                    className="object-cover"
                    style={getMediaStyle(activeItem)}
                  />
                )}
              </div>
              {!isEditMode && activeIndex !== null ? (
                <div className="mt-3 flex justify-center">
                  <span className="rounded-full bg-[color:var(--paper-2)] px-4 py-1 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]">
                    {activeIndex + 1} of {lightboxItems.length}
                  </span>
                </div>
              ) : null}
              {lightboxItems.length > 1 ? (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-3 py-2"
                    onPointerDown={() => startThumbScroll("left")}
                    onPointerUp={stopThumbScroll}
                    onPointerLeave={stopThumbScroll}
                    aria-label="Scroll thumbnails left"
                  >
                    prev
                  </button>
                  <div
                    ref={thumbStripRef}
                    className="thumb-deck overflow-hidden pb-3"
                    onPointerDown={handleThumbPointerDown}
                  >
                    {lightboxItems.map((item, index) => {
                      const isActive = index === activeIndex;
                      const canReorder =
                        isEditMode && lightboxItems.every((thumb) => thumb.isLocal);
                      return (
                        <button
                          key={`${item.id}-thumb-${index}`}
                          type="button"
                          draggable={canReorder}
                          onDragStart={() => setThumbDragIndex(index)}
                          onDragOver={(event) => {
                            if (!canReorder) return;
                            event.preventDefault();
                          }}
                          onDrop={(event) => {
                            if (!canReorder) return;
                            event.preventDefault();
                            if (thumbDragIndex === null) return;
                            reorderLightboxItems(thumbDragIndex, index);
                            setThumbDragIndex(null);
                          }}
                          onDragEnd={() => setThumbDragIndex(null)}
                          onClick={() => {
                            if (thumbDragMovedRef.current) {
                              thumbDragMovedRef.current = false;
                              return;
                            }
                            setActiveIndex(index);
                          }}
                          className={`thumb-card h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border ${
                            isActive
                              ? "border-[color:var(--accent)]"
                              : "border-[color:var(--muted)]/60"
                          } ${
                            thumbDragIndex === index && canReorder
                              ? "opacity-60"
                              : ""
                          }`}
                          aria-label={`View ${item.title}`}
                        >
                          {item.type === "video" && item.videoSrc ? (
                            <video
                              className="h-full w-full object-cover"
                              src={resolveAssetSrc(item.videoSrc)}
                              muted
                              playsInline
                              style={getMediaStyle(item)}
                            />
                          ) : item.isLocal ? (
                            <img
                              src={resolveAssetSrc(item.src)}
                              alt={item.alt}
                              className="h-full w-full object-cover"
                              style={getMediaStyle(item)}
                            />
                          ) : (
                            <Image
                              src={resolveAssetSrc(item.src)}
                              alt={item.alt}
                              width={160}
                              height={120}
                              className="h-full w-full object-cover"
                              style={getMediaStyle(item)}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-3 py-2"
                    onPointerDown={() => startThumbScroll("right")}
                    onPointerUp={stopThumbScroll}
                    onPointerLeave={stopThumbScroll}
                    aria-label="Scroll thumbnails right"
                  >
                    next
                  </button>
                </div>
              ) : null}
              {isEditMode && showLightboxInfo ? (
                <div className="mt-4 rounded-lg border border-[color:var(--muted)]/50 bg-[color:var(--paper-2)]/70 px-4 py-3">
                  <p className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    source
                  </p>
                  <p className="text-sm text-[color:var(--ink)]/80">{getSourceLabel(activeItem)}</p>
                </div>
              ) : null}
              {isEditMode && editorTargetId === getMediaKey(activeItem) ? (
                <div className="mt-4 rounded-lg border border-[color:var(--muted)]/50 bg-[color:var(--paper-2)]/70 px-4 py-3">
                  <p className="font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    edit image
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/70">
                      resize
                      <input
                        type="range"
                        min={0.5}
                        max={2.5}
                        step={0.01}
                        value={getImageEdit(activeItem).scale}
                        onChange={(event) =>
                          updateImageEdit(activeItem, {
                            scale: Number(event.currentTarget.value),
                          })
                        }
                        className="mt-2 w-full"
                      />
                    </label>
                    <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/70">
                      crop x
                      <input
                        type="range"
                        min={-50}
                        max={50}
                        step={1}
                        value={getImageEdit(activeItem).offsetX}
                        onChange={(event) =>
                          updateImageEdit(activeItem, {
                            offsetX: Number(event.currentTarget.value),
                          })
                        }
                        className="mt-2 w-full"
                      />
                    </label>
                    <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/70">
                      crop y
                      <input
                        type="range"
                        min={-50}
                        max={50}
                        step={1}
                        value={getImageEdit(activeItem).offsetY}
                        onChange={(event) =>
                          updateImageEdit(activeItem, {
                            offsetY: Number(event.currentTarget.value),
                          })
                        }
                        className="mt-2 w-full"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em]"
                      onClick={() => resetImageEdit(activeItem)}
                    >
                      reset
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-3 py-1 text-xs uppercase tracking-[0.2em]"
                      onClick={() => setEditorTargetId(null)}
                    >
                      close
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <EditableText
                    as="p"
                    value={activeItem.title}
                    onChange={(value) => {
                      if (activeItem.id === hero.id) {
                        if (heroAlbum) {
                          updateAlbum(heroAlbum.id, { title: value });
                        } else {
                          setContent((prev) => {
                            const updated = { ...prev, heroCardTitle: value };
                            localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                            return updated;
                          });
                        }
                        return;
                      }
                      const albumMatch = albums.find((album) => album.id === activeItem.id);
                      if (albumMatch) {
                        updateAlbum(activeItem.id, { title: value });
                        return;
                      }
                      const timelineMatch = timeline.find(
                        (item) => item.id === activeItem.id
                      );
                      if (timelineMatch) {
                        updateTimelineItem(activeItem.id, { title: value });
                      }
                    }}
                    className={`font-display text-2xl ${displayEffectClass}`}
                  />
                  {isEditMode && activeItem.isLocal && activeItem.alt ? (
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {activeItem.alt}
                    </p>
                  ) : null}
                  {activeItem.detail ? (
                    <EditableText
                      as="p"
                      value={activeItem.detail}
                      onChange={(value) => {
                        if (activeItem.id === hero.id) {
                          if (heroAlbum) {
                            updateAlbum(heroAlbum.id, { mood: value });
                          } else {
                            setContent((prev) => {
                              const updated = { ...prev, heroCardDetail: value };
                              localStorage.setItem('sunday-album-content', JSON.stringify(updated));
                              return updated;
                            });
                          }
                          return;
                        }
                        const timelineMatch = timeline.find(
                          (item) => item.id === activeItem.id
                        );
                        if (timelineMatch) {
                          updateTimelineItem(activeItem.id, { detail: value });
                        }
                      }}
                      className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
                    />
                  ) : null}
                  {activeItem.type === "video" && !activeItem.videoSrc ? (
                    <EditableText
                      as="p"
                      value={resolveText("lightbox.videoSoon", "Video file coming soon.")}
                      onChange={(value) => updateOverride("lightbox.videoSoon", value)}
                      className={`text-sm text-[color:var(--ink)]/60 ${bodyEffectClass}`}
                    />
                  ) : null}
                  {isEditMode && noteEditingId === getMediaKey(activeItem) ? (
                    <textarea
                      value={getImageNote(activeItem)}
                      onChange={(event) => setImageNote(activeItem, event.target.value)}
                      rows={3}
                      className="mt-3 w-full rounded-lg border border-[color:var(--muted)] bg-transparent px-3 py-2 text-sm"
                      placeholder="Add a note below the image"
                    />
                  ) : null}
                  {!isEditMode && getImageNote(activeItem) ? (
                    <p className={`mt-3 text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
                      {getImageNote(activeItem)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 font-ui text-xs uppercase tracking-[0.2em]">
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-4 py-2"
                    onClick={goToPrevious}
                  >
                    <EditableText
                      as="span"
                      value={resolveText("lightbox.previous", "previous")}
                      onChange={(value) => updateOverride("lightbox.previous", value)}
                      className={labelEffectClass}
                      editable={false}
                    />
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-4 py-2"
                    onClick={goToNext}
                  >
                    <EditableText
                      as="span"
                      value={resolveText("lightbox.next", "next")}
                      onChange={(value) => updateOverride("lightbox.next", value)}
                      className={labelEffectClass}
                      editable={false}
                    />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(null);
                  setLightboxItems([]);
                }}
                className="absolute right-6 top-6 rounded-full border border-[color:var(--muted)] bg-[color:var(--paper)] px-3 py-1 font-ui text-xs uppercase tracking-[0.2em]"
              >
                <EditableText
                  as="span"
                  value={resolveText("lightbox.close", "close")}
                  onChange={(value) => updateOverride("lightbox.close", value)}
                  className={labelEffectClass}
                  editable={false}
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {pendingDelete ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[color:var(--ink)]/70 p-6">
          <div className="paper-card w-full max-w-md space-y-4 p-6">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                confirm delete
              </p>
              <p className={`font-display text-2xl ${displayEffectClass}`}>
                Delete {pendingDelete.label}?
              </p>
              <p className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
                This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                onClick={() => setPendingDelete(null)}
              >
                no
              </button>
              <button
                type="button"
                className="rounded-full bg-[color:var(--accent)] px-5 py-2 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]"
                onClick={confirmDelete}
              >
                yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
