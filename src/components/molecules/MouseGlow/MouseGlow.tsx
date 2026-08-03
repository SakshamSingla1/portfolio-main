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
    current.current = { ...getMousePosition() };
    let scrollPaused = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | 0 = 0;

    // Once the eased glow position has caught up to the cursor there is
    // nothing left to animate — keeping requestAnimationFrame running forever
    // (as before) pays for a 500px, blur(150px) compositor layer update on
    // every single frame for the entire time the page is open, even while the
    // user is just scrolling or reading with the mouse still. Stop as soon as
    // it converges and only resume on the next real mousemove.
    const CONVERGE_EPSILON = 0.05;

    const animate = () => {
      const pos = getMousePosition();
      const dx = pos.x - current.current.x;
      const dy = pos.y - current.current.y;
      current.current.x += dx * 0.08;
      current.current.y += dy * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x - 250}px, ${current.current.y - 250}px)`;
      }
      if (Math.abs(dx) < CONVERGE_EPSILON && Math.abs(dy) < CONVERGE_EPSILON) {
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (raf.current || scrollPaused) return;
      raf.current = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // Fully stop the loop while the tab is hidden instead of relying on
    // browser rAF throttling of background tabs.
    const handleVisibilityChange = () => (document.hidden ? stop() : start());

    // The glow tracking the cursor isn't meaningful while wheel/trackpad
    // scrolling anyway, so pause it for the same window GridBackground does.
    const handleScroll = () => {
      scrollPaused = true;
      stop();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollTimeout = 0;
        scrollPaused = false;
        if (!document.hidden) start();
      }, 150);
    };

    const handleMouseMove = () => start();

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      unsubscribeMouse();
      stop();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
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
