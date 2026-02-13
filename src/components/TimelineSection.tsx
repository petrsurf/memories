import type { Dispatch, SetStateAction } from "react";
import type { Content, EditableTextProps, GalleryItem, TimelineItem } from "../app/types";

type EditableTextComponent = (props: EditableTextProps) => React.ReactElement;

type TimelineSectionProps = {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  visibleTimeline: (TimelineItem & { isGenerated?: boolean })[];
  isEditMode: boolean;
  resolveText: (key: string, fallback: string) => string;
  updateOverride: (key: string, value: string) => void;
  updateTimelineItem: (id: string, patch: Partial<TimelineItem>) => void;
  requestDeleteTimeline: (item: TimelineItem) => void;
  openLightbox: (id: string, items?: GalleryItem[]) => void;
  resolveAssetSrc: (src?: string) => string;
  displayEffectClass: string;
  labelEffectClass: string;
  bodyEffectClass: string;
  EditableText: EditableTextComponent;
  uploads: GalleryItem[];
};

const TimelineSection = ({
  content,
  setContent,
  visibleTimeline,
  isEditMode,
  resolveText,
  updateOverride,
  updateTimelineItem,
  requestDeleteTimeline,
  openLightbox,
  resolveAssetSrc,
  displayEffectClass,
  labelEffectClass,
  bodyEffectClass,
  EditableText,
  uploads,
}: TimelineSectionProps) => {
  return (
    <section id="timeline" className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <EditableText
          as="p"
          value={resolveText("section.timeline", "timeline")}
          onChange={(value) => updateOverride("section.timeline", value)}
          className={`font-ui text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] ${labelEffectClass}`}
        />
        <EditableText
          as="h3"
          value={content.timelineTitle}
          onChange={(value) =>
            setContent((prev) => ({ ...prev, timelineTitle: value }))
          }
          className={`font-display text-3xl ${displayEffectClass}`}
        />
        <EditableText
          as="p"
          value={content.timelineDescription}
          onChange={(value) =>
            setContent((prev) => ({ ...prev, timelineDescription: value }))
          }
          multiline
          className={`text-base text-[color:var(--ink)]/75 ${bodyEffectClass}`}
        />
      </div>
      <div className="space-y-4">
        {visibleTimeline.map((moment) => (
          <div
            key={moment.id}
            className="paper-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <EditableText
                as="p"
                value={moment.date}
                onChange={(value) => updateTimelineItem(moment.id, { date: value })}
                className={`font-ui text-xs uppercase tracking-[0.2em] text-[color:var(--olive)] ${labelEffectClass}`}
                editable={!moment.isGenerated}
              />
              <EditableText
                as="p"
                value={moment.title}
                onChange={(value) => updateTimelineItem(moment.id, { title: value })}
                className={`font-display text-lg ${displayEffectClass}`}
                editable={!moment.isGenerated}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const linkedId =
                    moment.mediaId ??
                    (moment.id.startsWith("moment-")
                      ? moment.id.replace("moment-", "")
                      : moment.id);
                  const matchedUpload = uploads.find((upload) => upload.id === linkedId);
                  if (!matchedUpload) {
                    openLightbox(linkedId, uploads);
                    return;
                  }
                  const targetAlbumId = moment.albumId ?? matchedUpload.albumId;
                  if (!targetAlbumId) {
                    openLightbox(matchedUpload.id, uploads);
                    return;
                  }
                  const albumItems = uploads.filter(
                    (upload) => upload.albumId === targetAlbumId
                  );
                  openLightbox(matchedUpload.id, albumItems.length > 0 ? albumItems : uploads);
                }}
                className="group relative h-14 w-20 overflow-hidden rounded-lg"
                aria-label={`Open ${moment.title}`}
              >
                {moment.type === "video" && moment.videoSrc ? (
                  <video
                    src={resolveAssetSrc(moment.videoSrc)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    preload="metadata"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={resolveAssetSrc(moment.src)}
                    alt={moment.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                )}
              </button>
              {isEditMode && !moment.isGenerated ? (
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-1 font-ui text-[11px] uppercase tracking-[0.2em]"
                  onClick={() => requestDeleteTimeline(moment)}
                >
                  delete
                </button>
              ) : null}
              <EditableText
                as="p"
                value={moment.detail}
                onChange={(value) => updateTimelineItem(moment.id, { detail: value })}
                className={`text-sm text-[color:var(--ink)]/70 ${bodyEffectClass}`}
                editable={!moment.isGenerated}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;
