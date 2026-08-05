import React, { useState } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useColors, gradients, shadows } from "../../../utils/theme";

interface SliderProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  desktopCards?: number;
}

function Slider<T>({
  items,
  renderItem,
  desktopCards = 3,
}: SliderProps<T>) {
  const isMobile = useIsMobile();
  const colors = useColors();
  const gradient = gradients(colors);
  const shadow = shadows(colors);

  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const cardsPerView = isMobile ? 1 : desktopCards;
  const maxIndex = Math.max(0, items.length - cardsPerView);

  const handleNext = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || touchStart === null) return;

    const diff = touchStart - e.changedTouches[0].clientX;

    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();

    setTouchStart(null);
  };

  if (items.length <= cardsPerView) {
    return (
      <div className="flex gap-8">
        {items.map((item, i) => (
          <div key={i} className="flex-1">
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative mt-8 w-full">

      {!isMobile && (
        <>
          <button
            onClick={handlePrev}
            style={{
              background: gradient.ctaGradient,
              boxShadow: shadow.medium,
              color: colors.neutral50,
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 
                       h-12 w-12 rounded-full 
                       hover:scale-110 transition"
          >
            ‹
          </button>

          <button
            onClick={handleNext}
            style={{
              background: gradient.ctaGradient,
              boxShadow: shadow.medium,
              color: colors.neutral50,
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 
                       h-12 w-12 rounded-full 
                       hover:scale-110 transition"
          >
            ›
          </button>
        </>
      )}

      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / cardsPerView)}%)`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="px-4"
              style={{
                flex: `0 0 ${100 / cardsPerView}%`,
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              background:
                index === i
                  ? gradient.ctaGradient
                  : colors.neutral600,
              boxShadow:
                index === i ? shadow.soft : "none",
            }}
            className="h-3 w-3 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;