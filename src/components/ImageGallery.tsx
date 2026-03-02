"use client";

import { useState, useEffect, useCallback } from "react";

interface ImageGalleryProps {
  images: { url: string; id: string }[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    if (!fullscreen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [fullscreen, goNext, goPrev]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-xl border border-border">
        <div className="text-center text-gray-400">
          <svg className="w-20 h-20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Nema slika</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Normal gallery */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="aspect-[4/3] relative bg-gray-100 cursor-pointer" onClick={() => setFullscreen(true)}>
          <img
            src={images[activeIndex].url}
            alt={title}
            className="w-full h-full object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen icon */}
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
            className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-1 p-2">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden transition ${
                  index === activeIndex
                    ? "ring-2 ring-primary opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={() => setFullscreen(false)}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center relative px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeIndex].url}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 px-4 py-3" onClick={(e) => e.stopPropagation()}>
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden transition flex-shrink-0 ${
                    index === activeIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-40 hover:opacity-80"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
