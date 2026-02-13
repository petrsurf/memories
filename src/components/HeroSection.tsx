import Image from "next/image";
import { useRef } from "react";
import type { CSSProperties, Dispatch, ReactElement, SetStateAction } from "react";
import type { Album, Content, EditableTextProps, GalleryItem } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => ReactElement;

type HeroSectionProps = {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  hero: GalleryItem;
  heroAlbum?: Album;
  heroHeight: number;
  heroScale: number;
  heroSourceId: string | null;
  setHeroSourceId: (id: string | null) => void;
  openLightbox: (id: string, items?: GalleryItem[]) => void;
  updateAlbum: (id: string, patch: Partial<Album>) => void;
  requestDeleteAlbum: (album: Album) => void;
  resolveAssetSrc: (src?: string) => string;
  getMediaStyle: (item: GalleryItem) => CSSProperties | undefined;
  albums: Album[];
  isEditMode: boolean;
  clearHeroCard: () => void;
  uploadHeroFiles: (files: FileList | null) => void;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
};

const HeroSection = ({
  content,
  setContent,
  hero,
  heroAlbum,
  heroHeight,
  heroScale,
  heroSourceId,
  setHeroSourceId,
  openLightbox,
  updateAlbum,
  requestDeleteAlbum,
  resolveAssetSrc,
  getMediaStyle,
  albums,
  isEditMode,
  clearHeroCard,
  uploadHeroFiles,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
}: HeroSectionProps) => {
  const heroUploadInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] fade-up">
      <div className="space-y-5">
        <EditableText
          as="p"
          value={content.heroDate}
          onChange={(value) => setContent((prev) => ({ ...prev, heroDate: value }))}
          className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--olive)] ${labelEffectClass}`}
        />
        <EditableText
          as="h2"
          value={content.heroHeadline}
          onChange={(value) =>
            setContent((prev) => ({ ...prev, heroHeadline: value }))
          }
          className={`font-display headline-gradient text-4xl leading-tight sm:text-5xl ${displayEffectClass}`}
        />
        <EditableText
          as="p"
          value={content.heroIntro}
          onChange={(value) => setContent((prev) => ({ ...prev, heroIntro: value }))}
          multiline
          className={`text-lg leading-relaxed text-[color:var(--ink)]/80 ${bodyEffectClass}`}
        />
        <div className="flex flex-wrap gap-4 font-ui text-sm uppercase tracking-[0.2em]">
          <a
            className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-[color:var(--paper)] shadow-[0_8px_24px_rgba(201,123,99,0.35)] transition-transform hover:-translate-y-0.5"
            href="#gallery"
          >
            <EditableText
              as="span"
              value={content.heroCtaPrimary}
              onChange={(value) =>
                setContent((prev) => ({ ...prev, heroCtaPrimary: value }))
              }
              className={labelEffectClass}
              editable={false}
            />
          </a>
          <a
            className="rounded-full border border-[color:var(--muted)] px-6 py-3 text-[color:var(--ink)] transition-colors hover:border-transparent hover:bg-[color:var(--paper-2)]"
            href="#albums"
          >
            <EditableText
              as="span"
              value={content.heroCtaSecondary}
              onChange={(value) =>
                setContent((prev) => ({ ...prev, heroCtaSecondary: value }))
              }
              className={labelEffectClass}
              editable={false}
            />
          </a>
        </div>
      </div>
      <div className="paper-card tape-effect p-6">
        <button
          type="button"
          onClick={() => openLightbox(hero.id)}
          className="gallery-hover relative w-full overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(44,42,38,0.08)]"
          style={{ height: heroHeight, "--gallery-scale": 1.02 } as CSSProperties}
          aria-label={`Open ${hero.title}`}
        >
          <div
            style={{
              transform: `scale(${heroScale})`,
              transformOrigin: "center center",
              width: "100%",
              height: "100%",
              transition: "transform 0.2s ease",
              position: "relative",
            }}
          >
            {hero.type === "video" && hero.videoSrc ? (
              <video
                className="gallery-image h-full w-full object-cover"
                src={resolveAssetSrc(hero.videoSrc)}
                muted
                playsInline
                style={getMediaStyle(hero)}
              />
            ) : hero.isLocal ? (
              <img
                src={resolveAssetSrc(hero.src)}
                alt={hero.alt}
                className="gallery-image h-full w-full object-cover"
                style={getMediaStyle(hero)}
              />
            ) : (
              <img
                src={resolveAssetSrc(hero.src)}
                alt={hero.alt}
                className="gallery-image object-cover"
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  objectFit: 'cover',
                  ...getMediaStyle(hero)
                }}
              />
            )}
          </div>
        </button>
        <div className="mt-5 space-y-2">
          <EditableText
            as="p"
            value={hero.title}
            onChange={(value) =>
              heroAlbum
                ? updateAlbum(heroAlbum.id, { title: value })
                : setContent((prev) => ({ ...prev, heroCardTitle: value }))
            }
            className={`font-display text-xl ${displayEffectClass}`}
          />
          <EditableText
            as="p"
            value={hero.detail ?? ""}
            onChange={(value) =>
              heroAlbum
                ? updateAlbum(heroAlbum.id, { mood: value })
                : setContent((prev) => ({ ...prev, heroCardDetail: value }))
            }
            className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
          />
        </div>
        {isEditMode ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 font-ui text-xs uppercase tracking-[0.2em]">
            <span className="text-[color:var(--muted)]">hero source</span>
            <select
              className="rounded-full border border-[color:var(--muted)] bg-transparent px-4 py-2"
              value={heroSourceId ?? ""}
              onChange={(event) => {
                const nextValue = event.currentTarget.value;
                setHeroSourceId(nextValue ? nextValue : null);
              }}
            >
              <option value="">Sunday Light</option>
              {albums.map((album) => (
                <option key={`hero-${album.id}`} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
            {heroAlbum ? (
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-4 py-2"
                onClick={() => requestDeleteAlbum(heroAlbum)}
              >
                delete album
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-4 py-2"
              onClick={clearHeroCard}
            >
              clear hero
            </button>
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-4 py-2"
              onClick={() => heroUploadInputRef.current?.click()}
            >
              upload hero media
            </button>
            <input
              ref={heroUploadInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(event) => {
                uploadHeroFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HeroSection;
