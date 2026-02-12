import Image from "next/image";
import type { CSSProperties, DragEvent, ReactElement } from "react";
import type { Album, Content, EditableTextProps, GalleryItem } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => ReactElement;

type AlbumMediaCounts = {
  images: number;
  videos: number;
  totalSize: number;
};

type AlbumsSectionProps = {
  content: Content;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
  albums: Album[];
  visibleAlbums: Album[];
  uploadsByAlbum: Record<string, GalleryItem[]>;
  uploadCounts: Record<string, number>;
  albumMediaCounts: Record<string, AlbumMediaCounts>;
  albumImageHeight: number;
  albumUploadThumbHeight: number;
  isEditMode: boolean;
  selectedAlbumId: string;
  resolveText: (key: string, fallback: string) => string;
  updateOverride: (key: string, value: string) => void;
  formatAlbumCount: (albumId: string) => string;
  updateAlbum: (id: string, patch: Partial<Album>) => void;
  requestDeleteAlbum: (album: Album) => void;
  requestDeleteUpload: (item: GalleryItem) => void;
  openLightbox: (id: string, items?: GalleryItem[]) => void;
  handleFileDragOver: (event: DragEvent<HTMLElement>) => void;
  handleCoverDrop: (event: DragEvent<HTMLElement>, albumId: string) => void;
  handleCoverDragStart: (event: DragEvent<HTMLElement>, item: GalleryItem) => void;
  addFiles: (files: FileList | null, albumId: string) => void;
  resolveAssetSrc: (src?: string) => string;
  getMediaStyle: (item: GalleryItem) => CSSProperties | undefined;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
};

const AlbumsSection = ({
  content,
  setContent,
  albums,
  visibleAlbums,
  uploadsByAlbum,
  uploadCounts,
  albumMediaCounts,
  albumImageHeight,
  albumUploadThumbHeight,
  isEditMode,
  selectedAlbumId,
  resolveText,
  updateOverride,
  formatAlbumCount,
  updateAlbum,
  requestDeleteAlbum,
  requestDeleteUpload,
  openLightbox,
  handleFileDragOver,
  handleCoverDrop,
  handleCoverDragStart,
  addFiles,
  resolveAssetSrc,
  getMediaStyle,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
}: AlbumsSectionProps) => {
  return (
    <section
      id="albums"
      className="mt-20"
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
            value={resolveText("section.albums", "albums")}
            onChange={(value) => updateOverride("section.albums", value)}
            className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
          />
          <EditableText
            as="h3"
            value={content.albumsTitle}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, albumsTitle: value }))
            }
            className={`font-display text-3xl ${displayEffectClass}`}
          />
        </div>
        <a
          className="font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--olive)]"
          href="#albums"
        >
          <EditableText
            as="span"
            value={resolveText("albums.viewAll", "view all")}
            onChange={(value) => updateOverride("albums.viewAll", value)}
            className={labelEffectClass}
            editable={false}
          />
        </a>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visibleAlbums.map((album) => (
          <article
            key={album.id}
            className="paper-card p-6 transition-transform hover:-translate-y-1"
          >
            {(() => {
              // Only show cover if explicitly set by user via coverId
              const hasCover = album.coverId && uploadsByAlbum[album.id];
              const coverItem = hasCover 
                ? uploadsByAlbum[album.id]?.find((item) => item.id === album.coverId)
                : null;
              
              return (
                <div
                  className="relative"
                  onDragOver={handleFileDragOver}
                  onDrop={(event) => handleCoverDrop(event, album.id)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const albumItems = uploadsByAlbum[album.id];
                      if (albumItems && albumItems.length > 0) {
                        openLightbox(albumItems[0].id, albumItems);
                        return;
                      }
                      openLightbox(album.id);
                    }}
                    onDragOver={handleFileDragOver}
                    onDrop={(event) => handleCoverDrop(event, album.id)}
                    className="gallery-hover relative w-full overflow-hidden rounded-xl"
                    style={{ height: albumImageHeight, "--gallery-scale": 1.03 } as CSSProperties}
                    aria-label={`Open ${album.title}`}
                  >
                    {coverItem ? (
                      <div className="album-stack">
                        <div className="album-stack-item">
                          {coverItem.type === "video" && coverItem.videoSrc ? (
                            <video
                              className="gallery-image h-full w-full object-cover"
                              src={resolveAssetSrc(coverItem.videoSrc)}
                              muted
                              playsInline
                              style={getMediaStyle(coverItem)}
                            />
                          ) : (
                            <img
                              src={resolveAssetSrc(coverItem.src)}
                              alt={coverItem.alt}
                              className="gallery-image h-full w-full object-cover"
                              style={getMediaStyle(coverItem)}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={resolveAssetSrc(album.src)}
                        alt={album.alt}
                        fill
                        className="gallery-image object-cover"
                      />
                    )}
                  </button>
                </div>
              );
            })()}
            <div className="mt-5 flex items-center justify-between">
              <EditableText
                as="h4"
                value={album.title}
                onChange={(value) => updateAlbum(album.id, { title: value })}
                className={`font-display text-xl ${displayEffectClass}`}
              />
              {isEditMode ? (
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                  onClick={() => requestDeleteAlbum(album)}
                >
                  delete
                </button>
              ) : null}
            </div>
            <p className={`mt-2 text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
              {formatAlbumCount(album.id)} · {album.date}
            </p>
            {!isEditMode ? (
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {albumMediaCounts[album.id]?.images ?? 0} IMG · {albumMediaCounts[album.id]?.videos ?? 0} VID
              </p>
            ) : null}
            {uploadCounts[album.id] ? (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--olive)]">
                {uploadCounts[album.id]} new upload{uploadCounts[album.id] > 1 ? "s" : ""}
              </p>
            ) : null}
            <EditableText
              as="p"
              value={album.mood}
              onChange={(value) => updateAlbum(album.id, { mood: value })}
              className={`mt-3 text-base text-[color:var(--ink)]/80 ${bodyEffectClass}`}
            />
            {isEditMode && (
              <div className="mt-3 grid gap-1 rounded bg-[color:var(--paper2)] p-3 font-mono text-xs text-[color:var(--ink)]/70">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider opacity-50">Privacy</span>
                  <EditableText
                    as="span"
                    value={album.privacy}
                    onChange={(value) => updateAlbum(album.id, { privacy: value })}
                    className="hover:underline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider opacity-50">Content</span>
                  <span>
                    {albumMediaCounts[album.id]?.images ?? 0} IMG · {" "}
                    {albumMediaCounts[album.id]?.videos ?? 0} VID
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider opacity-50">Size</span>
                  <span>
                    {(albumMediaCounts[album.id]?.totalSize ?? 0).toFixed(1)} MB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-wider opacity-50">ID</span>
                  <span title={album.id}>{album.id.slice(0, 8)}...</span>
                </div>
              </div>
            )}
            {uploadsByAlbum[album.id]?.length ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {uploadsByAlbum[album.id].slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    style={{ height: albumUploadThumbHeight }}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(item.id, uploadsByAlbum[album.id])}
                      className="gallery-hover relative w-full overflow-hidden rounded-lg"
                      style={{ height: albumUploadThumbHeight }}
                      aria-label={`Open ${item.title}`}
                    >
                      {item.type === "video" && item.videoSrc ? (
                        <video
                          className="gallery-image h-full w-full object-cover"
                          src={resolveAssetSrc(item.videoSrc)}
                          muted
                          playsInline
                          style={getMediaStyle(item)}
                        />
                      ) : (
                        <img
                          src={resolveAssetSrc(item.src)}
                          alt={item.alt}
                          className="gallery-image h-full w-full object-cover"
                          style={getMediaStyle(item)}
                        />
                      )}
                    </button>
                    {isEditMode ? (
                      <button
                        type="button"
                        className="absolute left-2 top-2 z-10 rounded-full bg-[color:var(--paper)]/90 px-2 py-1 font-ui text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]"
                        draggable
                        onDragStart={(event) => handleCoverDragStart(event, item)}
                        aria-label={`Drag ${item.title} to set cover`}
                      >
                        drag
                      </button>
                    ) : null}
                    {isEditMode ? (
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 rounded-full bg-[color:var(--paper)]/90 px-2 py-1 font-ui text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]"
                        onClick={(event) => {
                          event.stopPropagation();
                          requestDeleteUpload(item);
                        }}
                        aria-label={`Remove ${item.title}`}
                      >
                        remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AlbumsSection;
