"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem } from "../app/types";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

type FlipApi = {
  flipNext: (corner?: "top" | "bottom") => void;
  flipPrev: (corner?: "top" | "bottom") => void;
  flip: (page: number, corner?: "top" | "bottom") => void;
  getCurrentPageIndex: () => number;
};

type FlipRef = {
  pageFlip: () => FlipApi | undefined;
};

type AlbumFlipPreviewProps = {
  albumTitle: string;
  items: GalleryItem[];
  onClose: () => void;
  resolveAssetSrc: (src?: string) => string;
};

const AlbumFlipPreview = ({
  albumTitle,
  items,
  onClose,
  resolveAssetSrc,
}: AlbumFlipPreviewProps) => {
  const flipRef = useRef<FlipRef | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [muted, setMuted] = useState(false);

  const pages = useMemo(() => items.filter((item) => item.type === "image"), [items]);

  const getFlipApi = () => flipRef.current?.pageFlip();

  const playFlipSound = () => {
    if (muted) return;
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const audioCtx = audioContextRef.current ?? new AudioCtx();
    audioContextRef.current = audioCtx;

    const sampleRate = audioCtx.sampleRate;
    const duration = 0.11;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i += 1) {
      const decay = Math.exp((-7 * i) / frameCount);
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.6;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.0001;
    const now = audioCtx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + duration);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        getFlipApi()?.flipPrev("top");
        playFlipSound();
      }
      if (event.key === "ArrowRight") {
        getFlipApi()?.flipNext("top");
        playFlipSound();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="fixed inset-0 z-[85] bg-[color:var(--ink)]/85 p-4 sm:p-8">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-2xl border border-[color:var(--muted)] bg-[color:var(--paper)] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl text-[color:var(--ink)]">{albumTitle} · flip preview</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
              onClick={() => setMuted((prev) => !prev)}
            >
              {muted ? "sound off" : "sound on"}
            </button>
            <button
              type="button"
              className="rounded-full border border-[color:var(--muted)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
              onClick={onClose}
            >
              close
            </button>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-[color:var(--muted)]/60 bg-[color:var(--paper-2)]/70">
            <p className="text-sm text-[color:var(--ink)]/70">No image pages available in this album.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--muted)]/50 bg-[color:var(--paper-2)]/70 p-2 sm:p-4">
              <HTMLFlipBook
                ref={flipRef}
                style={{ margin: "0 auto" }}
                startPage={0}
                width={420}
                height={560}
                minWidth={260}
                maxWidth={620}
                minHeight={360}
                maxHeight={860}
                size="stretch"
                drawShadow
                maxShadowOpacity={0.35}
                flippingTime={650}
                usePortrait
                startZIndex={0}
                autoSize
                showCover
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={30}
                showPageCorners
                disableFlipByClick={false}
                onFlip={(event) => {
                  const index = typeof event?.data === "number" ? event.data : 0;
                  setCurrentPage(index);
                  playFlipSound();
                }}
                className=""
              >
                {pages.map((item) => (
                  <div key={item.id} className="h-full w-full bg-white">
                    <img
                      src={resolveAssetSrc(item.src)}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
                  onClick={() => {
                    getFlipApi()?.flipPrev("top");
                    playFlipSound();
                  }}
                >
                  prev
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[color:var(--muted)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
                  onClick={() => {
                    getFlipApi()?.flipNext("top");
                    playFlipSound();
                  }}
                >
                  next
                </button>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]/60">
                page {Math.min(currentPage + 1, pages.length)} / {pages.length}
              </p>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {pages.map((item, index) => (
                <button
                  key={`flip-thumb-${item.id}`}
                  type="button"
                  className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border ${
                    index === currentPage
                      ? "border-[color:var(--accent)]"
                      : "border-[color:var(--muted)]/60"
                  }`}
                  onClick={() => {
                    getFlipApi()?.flip(index, "top");
                    setCurrentPage(index);
                    playFlipSound();
                  }}
                  aria-label={`Jump to page ${index + 1}`}
                >
                  <img
                    src={resolveAssetSrc(item.src)}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlbumFlipPreview;
