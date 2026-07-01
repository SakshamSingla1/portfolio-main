import { useEffect, useRef } from "react";
import { useColors } from "../../../utils/theme";
import React from "react";

const GridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = useColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

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

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    const color = hexToRgb(colors.primary400);

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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        // ✨ glow effect
        const gradient = ctx.createRadialGradient(
          d.x,
          d.y,
          0,
          d.x,
          d.y,
          d.glow
        );

        gradient.addColorStop(0, `rgba(${color}, 0.6)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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