import { useEffect, useRef } from "react";
import { useColors } from "../../../utils/theme";
import { subscribeMousePosition, getMousePosition } from "../../../utils/mousePosition";
import { prefersReducedMotion } from "../../../utils/motionPreference";
import React from "react";

const GridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = useColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    const unsubscribeMouse = subscribeMousePosition();

    const DOTS = 70;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    const color = hexToRgb(colors.primary400);

    // Gradients only depend on glow radius (rounded) and the theme color, so
    // cache one per distinct radius instead of allocating a new
    // CanvasGradient for every dot on every frame. Each cached gradient is
    // built around the origin and reused via ctx.translate() per dot.
    const gradientCache = new Map<number, CanvasGradient>();
    const getGlowGradient = (glow: number) => {
      const key = Math.round(glow);
      let gradient = gradientCache.get(key);
      if (!gradient) {
        gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, key);
        gradient.addColorStop(0, `rgba(${color}, 0.6)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        gradientCache.set(key, gradient);
      }
      return gradient;
    };

    interface Dot {
      x: number;
      y: number;
      angle: number;
      speed: number;
      radius: number;
      glow: number;
    }

    const dots: Dot[] = [];

    // ✨ Create smooth moving dots
    for (let i = 0; i < DOTS; i++) {
      dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        radius: 1.5 + Math.random() * 2.5,
        glow: 8 + Math.random() * 12,
      });
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = getMousePosition();

      dots.forEach((d) => {
        // 🌊 Smooth circular / organic motion
        d.angle += d.speed * 0.01;

        d.x += Math.cos(d.angle) * 0.5;
        d.y += Math.sin(d.angle) * 0.5;

        // 🧲 subtle mouse attraction
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 150) {
          d.x += dx * 0.002;
          d.y += dy * 0.002;
        }

        // 🔁 wrap around
        if (d.x < 0) d.x = window.innerWidth;
        if (d.x > window.innerWidth) d.x = 0;
        if (d.y < 0) d.y = window.innerHeight;
        if (d.y > window.innerHeight) d.y = 0;

        // ✨ glow effect — reuse a cached gradient via translate instead of
        // building a fresh one per dot per frame
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.beginPath();
        ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = getGlowGradient(d.glow);
        ctx.fill();
        ctx.restore();
      });
    };

    const reduceMotion = prefersReducedMotion();

    const draw = () => {
      renderFrame();
      animationId = requestAnimationFrame(draw);
    };

    // Respects prefers-reduced-motion by painting one static frame instead of
    // animating forever, and stops the loop entirely while the tab is hidden
    // (rather than relying on browser rAF throttling) since this canvas
    // competes with scroll/layout work on the main thread whenever it runs.
    const start = () => {
      if (animationId) return;
      if (reduceMotion) {
        renderFrame();
        return;
      }
      draw();
    };

    const stop = () => {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = 0;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else if (!scrollTimeout) start();
    };

    // This canvas repaints 70 dots every frame, which directly competes with
    // the browser's own scroll compositing work. Pausing it while the page is
    // actively scrolling (and resuming a beat after scrolling settles) removes
    // that contention during the exact moment users feel jank, since the
    // ambient background motion isn't noticeable while the page is in motion
    // anyway.
    let scrollTimeout: ReturnType<typeof setTimeout> | 0 = 0;
    const handleScroll = () => {
      if (!scrollTimeout) stop();
      else clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollTimeout = 0;
        if (!document.hidden) start();
      }, 150);
    };

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      stop();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
      unsubscribeMouse();
    };
  }, [colors.primary400]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default React.memo(GridBackground);