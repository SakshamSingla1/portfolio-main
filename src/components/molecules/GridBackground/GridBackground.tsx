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
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const PARTICLE_COUNT = 60;
    const MAX_DISTANCE = 140;

    const particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 💎 Make lines crisp on retina screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width *= dpr;
      canvas.height *= dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    const particleColor = hexToRgb(colors.primary400);

    // ✨ Create particles with depth
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const depth = Math.random();

      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * (0.3 + depth * 0.4),
        vy: (Math.random() - 0.5) * (0.3 + depth * 0.4),
        size: 1.5 + depth * 2,
        opacity: 0.2 + depth * 0.4,
        depth,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // 💎 Crisp lines
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔵 Draw particles
      particles.forEach((p) => {
        p.pulse += 0.03;
        const pulseSize = p.size + Math.sin(p.pulse) * 0.4;

        // 🧲 Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 180) {
          p.x += dx * 0.001;
          p.y += dy * 0.001;
        }

        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          pulseSize * 4
        );

        gradient.addColorStop(0, `rgba(${particleColor}, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(${particleColor}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // 🔗 CLEAR & SHARP CONNECTION LINES
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < MAX_DISTANCE) {
            const strength = 1 - dist / MAX_DISTANCE;

            // 🔥 higher opacity for clarity
            const opacity = 0.3 * strength;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = `rgba(${particleColor}, ${opacity})`;
            ctx.lineWidth = 1.2;

            // ✨ controlled glow (not blurry)
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${particleColor}, 0.5)`;

            ctx.stroke();

            ctx.shadowBlur = 0;
          }
        }
      });

      // 🧠 Mouse highlight lines
      particles.forEach((p) => {
        const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);

        if (dist < 160) {
          const strength = 1 - dist / 160;

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);

          ctx.strokeStyle = `rgba(${particleColor}, ${0.25 * strength})`;
          ctx.lineWidth = 1;

          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [colors.primary400]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90"
    />
  );
};

export default React.memo(GridBackground);