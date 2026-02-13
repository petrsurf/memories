import Image from "next/image";
import type { CSSProperties, Dispatch, ReactElement, SetStateAction } from "react";
import type { Album, Content, EditableTextProps, GalleryItem } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => ReactElement;

type GallerySectionProps = {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  galleryItems: GalleryItem[];
  albums: Album[];
  selectedAlbumId: string;
  uploadsCount: number;
  isEditMode: boolean;
  isGallerySelectOpen: boolean;
  selectedGalleryIds: string[];
  pendingGalleryDelete: "selected" | "all" | null;
  galleryScale: number;
  openMenuId: string | null;
  setOpenMenuId: Dispatch<SetStateAction<string | null>>;
  setIsGallerySelectOpen: Dispatch<SetStateAction<boolean>>;
  setPendingGalleryDelete: Dispatch<SetStateAction<"selected" | "all" | null>>;
  closeSelection: () => void;
  toggleGallerySelection: (id: string) => void;
  confirmGalleryDelete: () => void;
  handleGalleryClick: (id: string) => void;
  handleGalleryAlbumDoubleClick: (id: string) => void;
  addFiles: (files: FileList | null, albumId: string) => void;
  updateGalleryTitle: (id: string, value: string) => void;
  handleMoveToAlbum: (item: GalleryItem, albumId: string) => void;
  setAlbumCoverFromItem: (albumId: string, item: GalleryItem) => void;
  handleDeleteItem: (item: GalleryItem) => void;
  openLightbox: (id: string, items?: GalleryItem[]) => void;
  setEditorTargetId: Dispatch<SetStateAction<string | null>>;
  setNoteEditingId: Dispatch<SetStateAction<string | null>>;
  getMediaKey: (item: GalleryItem) => string;
  resolveText: (key: string, fallback: string) => string;
  updateOverride: (key: string, value: string) => void;
  resolveAssetSrc: (src?: string) => string;
  getMediaStyle: (item: GalleryItem) => CSSProperties | undefined;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
};

const GallerySection = ({
  content,
  setContent,
  galleryItems,
  albums,
  selectedAlbumId,
  uploadsCount,
  isEditMode,
  isGallerySelectOpen,
  selectedGalleryIds,
  pendingGalleryDelete,
  galleryScale,
  openMenuId,
  setOpenMenuId,
  setIsGallerySelectOpen,
  setPendingGalleryDelete,
  closeSelection,
  toggleGallerySelection,
  confirmGalleryDelete,
  handleGalleryClick,
  handleGalleryAlbumDoubleClick,
  addFiles,
  updateGalleryTitle,
  handleMoveToAlbum,
  setAlbumCoverFromItem,
  handleDeleteItem,
  openLightbox,
  setEditorTargetId,
  setNoteEditingId,
  getMediaKey,
  resolveText,
  updateOverride,
  resolveAssetSrc,
  getMediaStyle,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
}: GallerySectionProps) => {
  return (
    <section
      id="gallery"
      className="mt-16"
      onDragOver={(event) => {
        if (!isEditMode) return;
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (!isEditMode) return;
        event.preventDefault();
        addFiles(event.dataTransfer.files, selectedAlbumId || albums[0]?.id || "");
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <EditableText
            as="p"
            value={resolveText("section.gallery", "gallery")}
            onChange={(value) => updateOverride("section.gallery", value)}
            className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
          />
          <EditableText
            as="h3"
            value={content.galleryTitle}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, galleryTitle: value }))
            }
            className={`font-display text-3xl ${displayEffectClass}`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <EditableText
            as="p"
            value={content.galleryDescription}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, galleryDescription: value }))
            }
            className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
          />
          {isEditMode ? (
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
              onClick={() => setIsGallerySelectOpen((prev) => !prev)}
            >
              {isGallerySelectOpen ? "close selection" : "select photos"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="masonry mt-8 columns-1 sm:columns-2 lg:columns-3">
        {galleryItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="masonry-item paper-card overflow-hidden p-4"
          >
            <div className="relative">
              <button
                type="button"
                className="gallery-hover relative w-full overflow-hidden rounded-xl"
                style={{ "--gallery-scale": galleryScale } as CSSProperties}
                onClick={() => handleGalleryClick(item.id)}
                onDoubleClick={() => handleGalleryAlbumDoubleClick(item.id)}
                aria-label={`Open ${item.title}`}
              >
                {item.type === "video" && item.videoSrc ? (
                  <video
                    className="gallery-image h-auto w-full rounded-xl object-cover"
                    src={resolveAssetSrc(item.videoSrc)}
                    muted
                    playsInline
                    preload="none"
                    style={getMediaStyle(item)}
                  />
                ) : item.isLocal ? (
                  <img
                    src={resolveAssetSrc(item.src)}
                    alt={item.alt}
                    className="gallery-image h-auto w-full rounded-xl object-cover"
                    style={getMediaStyle(item)}
                  />
                ) : (
                  <Image
                    src={resolveAssetSrc(item.src)}
                    alt={item.alt}
                    width={1200}
                    height={900}
                    className="gallery-image h-auto w-full rounded-xl object-cover"
                    style={getMediaStyle(item)}
                  />
                )}
              </button>
              {isEditMode ? (
                <div className="absolute right-2 top-2 z-20">
                  <button
                    type="button"
                    className="rounded-full bg-[color:var(--paper)]/90 px-2 py-1 font-ui text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId((prev) => (prev === item.id ? null : item.id));
                    }}
                    aria-label={`Open menu for ${item.title}`}
                  >
                    menu
                  </button>
                  {openMenuId === item.id ? (
                    <div
                      className="mt-2 w-56 rounded-xl border border-[color:var(--muted)] bg-[color:var(--paper)] p-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink)] shadow-[0_18px_30px_rgba(43,39,35,0.12)]"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="space-y-2">
                        <div>
                          <p className="text-[9px] text-[color:var(--muted)]">edit</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-[color:var(--muted)] px-2 py-1"
                              onClick={() => {
                                openLightbox(item.id);
                                setEditorTargetId(getMediaKey(item));
                                setOpenMenuId(null);
                              }}
                            >
                              crop
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-[color:var(--muted)] px-2 py-1"
                              onClick={() => {
                                openLightbox(item.id);
                                setEditorTargetId(getMediaKey(item));
                                setOpenMenuId(null);
                              }}
                            >
                              resize
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-[color:var(--muted)]">move</p>
                          <select
                            className="mt-2 w-full rounded-full border border-[color:var(--muted)] bg-transparent px-2 py-1"
                            defaultValue=""
                            disabled={!item.albumId}
                            onChange={(event) => {
                              const albumId = event.currentTarget.value;
                              if (!albumId) return;
                              handleMoveToAlbum(item, albumId);
                              event.currentTarget.value = "";
                              setOpenMenuId(null);
                            }}
                          >
                            <option value="" disabled>
                              select album
                            </option>
                            {albums.map((album) => (
                              <option key={`move-${item.id}-${album.id}`} value={album.id}>
                                {album.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p className="text-[9px] text-[color:var(--muted)]">set cover</p>
                          <select
                            className="mt-2 w-full rounded-full border border-[color:var(--muted)] bg-transparent px-2 py-1"
                            defaultValue=""
                            disabled={!item.albumId}
                            onChange={(event) => {
                              const albumId = event.currentTarget.value;
                              if (!albumId) return;
                              setAlbumCoverFromItem(albumId, item);
                              event.currentTarget.value = "";
                              setOpenMenuId(null);
                            }}
                          >
                            <option value="" disabled>
                              select album
                            </option>
                            {albums.map((album) => (
                              <option key={`cover-${item.id}-${album.id}`} value={album.id}>
                                {album.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full rounded-full border border-[color:var(--muted)] px-2 py-1"
                            onClick={() => {
                              openLightbox(item.id);
                              setNoteEditingId(getMediaKey(item));
                              setOpenMenuId(null);
                            }}
                          >
                            add text
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full rounded-full border border-[color:var(--muted)] px-2 py-1"
                            onClick={() => {
                              handleDeleteItem(item);
                              setOpenMenuId(null);
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
            </div>
            <div className="mt-4">
              <EditableText
                as="p"
                value={item.title}
                onChange={(value) => updateGalleryTitle(item.id, value)}
                className={`font-display text-lg ${displayEffectClass}`}
              />
              {item.detail ? (
                <p className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
                  {item.detail}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {isEditMode && isGallerySelectOpen ? (
        <div className="mt-10 paper-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                selection mode
              </p>
              <p className={`font-display text-xl ${displayEffectClass}`}>
                Select photos to delete
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
              onClick={closeSelection}
            >
              close
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryItems.map((item) => {
              const isSelectable = Boolean(item.albumId);
              const isSelected = selectedGalleryIds.includes(item.id);
              return (
                <div key={`select-${item.id}`} className="relative overflow-hidden rounded-xl">
                  {item.type === "video" && item.videoSrc ? (
                    <video
                      className="h-28 w-full object-cover"
                      src={resolveAssetSrc(item.videoSrc)}
                      muted
                      playsInline
                      preload="none"
                      style={getMediaStyle(item)}
                    />
                  ) : item.isLocal ? (
                    <img
                      src={resolveAssetSrc(item.src)}
                      alt={item.alt}
                      className="h-28 w-full object-cover"
                      style={getMediaStyle(item)}
                    />
                  ) : (
                    <Image
                      src={resolveAssetSrc(item.src)}
                      alt={item.alt}
                      width={400}
                      height={300}
                      className="h-28 w-full object-cover"
                      style={getMediaStyle(item)}
                    />
                  )}
                  <button
                    type="button"
                    className={`absolute right-2 top-2 h-5 w-5 rounded-full border-2 ${
                      isSelected
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)]"
                        : "border-[color:var(--paper)] bg-[color:var(--paper)]/70"
                    } ${isSelectable ? "" : "opacity-40"}`}
                    onClick={() => {
                      if (!isSelectable) return;
                      toggleGallerySelection(item.id);
                    }}
                    aria-label={
                      isSelectable
                        ? `Select ${item.title}`
                        : `${item.title} cannot be deleted`
                    }
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[color:var(--ink)]/70">
              Selected: {selectedGalleryIds.length}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                onClick={() => setPendingGalleryDelete("selected")}
                disabled={selectedGalleryIds.length === 0}
              >
                delete selected
              </button>
              <button
                type="button"
                className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                onClick={() => setPendingGalleryDelete("all")}
                disabled={uploadsCount === 0}
              >
                delete all
              </button>
            </div>
          </div>
          {pendingGalleryDelete ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[color:var(--muted)] px-4 py-3">
              <p className="text-sm text-[color:var(--ink)]/70">
                {pendingGalleryDelete === "all"
                  ? "Delete all uploaded photos?"
                  : "Delete selected photos?"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
                  onClick={() => setPendingGalleryDelete(null)}
                >
                  no
                </button>
                <button
                  type="button"
                  className="rounded-full bg-[color:var(--accent)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--paper)]"
                  onClick={confirmGalleryDelete}
                >
                  yes
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default GallerySection;
