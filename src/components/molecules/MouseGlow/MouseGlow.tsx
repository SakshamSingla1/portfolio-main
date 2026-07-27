import { useEffect, useRef } from "react";
import { useColors } from "../../../utils/theme";
import { subscribeMousePosition, getMousePosition } from "../../../utils/mousePosition";
import { prefersReducedMotion } from "../../../utils/motionPreference";
import React from "react";

const MouseGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const unsubscribeMouse = subscribeMousePosition();

    const animate = () => {
      const pos = getMousePosition();
      current.current.x += (pos.x - current.current.x) * 0.08;
      current.current.y += (pos.y - current.current.y) * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x - 250}px, ${current.current.y - 250}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // Fully stop the loop while the tab is hidden instead of relying on
    // browser rAF throttling of background tabs.
    const handleVisibilityChange = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unsubscribeMouse();
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-2 w-[500px] h-[500px] rounded-full blur-[150px] will-change-transform"
      style={{ backgroundColor: `${colors.primary500}06` }}
    />
  );
};

export default React.memo(MouseGlow);
