import type { CSSProperties, DragEvent, Dispatch, ReactElement, SetStateAction } from "react";
import type { Album, Content, EditableTextProps, GalleryItem } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => ReactElement;

type UploadSectionProps = {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  albums: Album[];
  selectedAlbum?: Album;
  selectedAlbumId: string;
  setSelectedAlbumId: Dispatch<SetStateAction<string>>;
  newAlbumTitle: string;
  setNewAlbumTitle: Dispatch<SetStateAction<string>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  uploadsForSelectedAlbum: GalleryItem[];
  uploadsByAlbum: Record<string, GalleryItem[]>;
  uploadPreviewHeight: number;
  isEditMode: boolean;
  resolveText: (key: string, fallback: string) => string;
  updateOverride: (key: string, value: string) => void;
  createAlbum: () => void;
  addFiles: (files: FileList | null, albumId: string) => void;
  handleCoverDragStart: (event: DragEvent<HTMLElement>, item: GalleryItem) => void;
  updateAlbum: (id: string, patch: Partial<Album>) => void;
  openLightbox: (id: string, items?: GalleryItem[]) => void;
  requestDeleteUpload: (item: GalleryItem) => void;
  resolveAssetSrc: (src?: string) => string;
  getMediaStyle: (item: GalleryItem) => CSSProperties | undefined;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
};

const UploadSection = ({
  content,
  setContent,
  albums,
  selectedAlbum,
  selectedAlbumId,
  setSelectedAlbumId,
  newAlbumTitle,
  setNewAlbumTitle,
  isDragging,
  setIsDragging,
  uploadsForSelectedAlbum,
  uploadsByAlbum,
  uploadPreviewHeight,
  isEditMode,
  resolveText,
  updateOverride,
  createAlbum,
  addFiles,
  handleCoverDragStart,
  updateAlbum,
  openLightbox,
  requestDeleteUpload,
  resolveAssetSrc,
  getMediaStyle,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
}: UploadSectionProps) => {
  if (!isEditMode) return null;
  const selectableAlbums = albums.filter(
    (album) => (uploadsByAlbum[album.id]?.length ?? 0) > 0
  );
  const effectiveSelectedAlbumId = selectableAlbums.some(
    (album) => album.id === selectedAlbumId
  )
    ? selectedAlbumId
    : selectableAlbums[0]?.id ?? "";

  return (
    <section id="upload" className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <EditableText
            as="p"
            value={resolveText("section.uploads", "uploads")}
            onChange={(value) => updateOverride("section.uploads", value)}
            className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
          />
          <EditableText
            as="h3"
            value={content.uploadTitle}
            onChange={(value) =>
              setContent((prev) => ({ ...prev, uploadTitle: value }))
            }
            className={`font-display text-3xl ${displayEffectClass}`}
          />
        </div>
        <EditableText
          as="p"
          value={content.uploadDescription}
          onChange={(value) =>
            setContent((prev) => ({ ...prev, uploadDescription: value }))
          }
          className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
        />
      </div>
      <div
        className={`paper-card mt-6 flex min-h-[220px] flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? "border-[color:var(--accent)] bg-[color:var(--paper)]/70"
            : "border-[color:var(--muted)]"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!effectiveSelectedAlbumId) return;
          addFiles(event.dataTransfer.files, effectiveSelectedAlbumId);
        }}
      >
        <EditableText
          as="p"
          value={resolveText("upload.drop", "Drop files here")}
          onChange={(value) => updateOverride("upload.drop", value)}
          className={`font-display text-2xl ${displayEffectClass}`}
        />
        <EditableText
          as="p"
          value={resolveText(
            "upload.formats",
            "JPG, PNG, MP4, MOV and similar formats are supported."
          )}
          onChange={(value) => updateOverride("upload.formats", value)}
          className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
        />
        <div className="flex flex-wrap items-center justify-center gap-3 font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]">
          <EditableText
            as="span"
            value={resolveText("upload.target", "target album")}
            onChange={(value) => updateOverride("upload.target", value)}
            className={`text-[11px] text-[color:var(--ink)]/70 ${labelEffectClass}`}
          />
          <select
            className="rounded-full border border-[color:var(--muted)] bg-transparent px-4 py-2"
            value={effectiveSelectedAlbumId}
            onChange={(event) => setSelectedAlbumId(event.target.value)}
          >
            {selectableAlbums.length === 0 ? (
              <option value="" disabled>
                No albums with media
              </option>
            ) : (
              selectableAlbums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))
            )}
          </select>
          <label className="cursor-pointer rounded-full bg-[color:var(--accent)] px-6 py-3 text-[color:var(--paper)] shadow-[0_8px_24px_rgba(184,111,85,0.35)]">
            <EditableText
              as="span"
              value={resolveText("upload.choose", "choose files")}
              onChange={(value) => updateOverride("upload.choose", value)}
              className={labelEffectClass}
              editable={false}
            />
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              disabled={!effectiveSelectedAlbumId}
              onChange={(event) => {
                if (!effectiveSelectedAlbumId) return;
                addFiles(event.target.files, effectiveSelectedAlbumId);
              }}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input
            value={newAlbumTitle}
            onChange={(event) => setNewAlbumTitle(event.target.value)}
            placeholder={resolveText("upload.newAlbum", "New album name")}
            className="w-52 rounded-full border border-[color:var(--muted)] bg-transparent px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={createAlbum}
            className="rounded-full border border-[color:var(--muted)] px-4 py-2 font-ui text-xs uppercase tracking-[0.2em]"
          >
            <EditableText
              as="span"
              value={resolveText("upload.addAlbum", "add album")}
              onChange={(value) => updateOverride("upload.addAlbum", value)}
              className={labelEffectClass}
              editable={false}
            />
          </button>
        </div>
      </div>

      {uploadsForSelectedAlbum.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {uploadsForSelectedAlbum.map((upload) => (
            <article key={upload.id} className="paper-card p-6">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ height: uploadPreviewHeight }}
                draggable={isEditMode}
                onDragStart={(event) => handleCoverDragStart(event, upload)}
              >
                {upload.type === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    src={resolveAssetSrc(upload.videoSrc)}
                    preload="metadata"
                    muted
                    playsInline
                    style={getMediaStyle(upload)}
                  />
                ) : (
                  <img
                    src={resolveAssetSrc(upload.src)}
                    alt={upload.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={getMediaStyle(upload)}
                  />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className={`font-display text-lg ${displayEffectClass}`}>
                    {upload.title}
                  </p>
                  {upload.detail ? (
                    <p className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}>
                      {upload.detail}
                    </p>
                  ) : null}
                  {selectedAlbum ? (
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {selectedAlbum.title}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  {isEditMode && upload.albumId ? (
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                      onClick={() => updateAlbum(upload.albumId ?? "", { coverId: upload.id })}
                    >
                      set cover
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                    onClick={() => {
                      const albumItems = upload.albumId
                        ? uploadsByAlbum[upload.albumId] ?? [upload]
                        : [upload];
                      openLightbox(upload.id, albumItems);
                    }}
                  >
                    <EditableText
                      as="span"
                      value={resolveText("upload.view", "view")}
                      onChange={(value) => updateOverride("upload.view", value)}
                      className={labelEffectClass}
                      editable={false}
                    />
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                    onClick={() => requestDeleteUpload(upload)}
                  >
                    <EditableText
                      as="span"
                      value={resolveText("upload.remove", "remove")}
                      onChange={(value) => updateOverride("upload.remove", value)}
                      className={labelEffectClass}
                      editable={false}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default UploadSection;
