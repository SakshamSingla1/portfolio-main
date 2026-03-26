import { useEffect, useRef } from "react";
import { useColors } from "../../../utils/theme";
import React from "react";

const MouseGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);

    const animate = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.08;
      current.current.y += (pos.current.y - current.current.y) * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x - 250}px, ${current.current.y - 250}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handler);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-2 w-[500px] h-[500px] rounded-full blur-[150px] will-change-transform"
      style={{ backgroundColor: `${colors.primary500}06` }}
    />
  );
};

export default React.memo(MouseGlow);
