"use client";

import React, { useRef, useId, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { useColors } from "../../../utils/theme";

interface CircleWithArcProps {
  progress: number;
  size?: number;
}

const CircleWithArc: React.FC<CircleWithArcProps> = ({
  progress,
  size,
}) => {
  const colors = useColors();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const gradientId = useId();
  const glowId = useId();

  const containerSize = size ?? (isMobile ? 273: 400);
  const strokeWidth = isMobile ? 2 : 3;
  const glowWidth = strokeWidth * 2.5;
  const gap = isMobile ? 10 : 14;

  const radius = containerSize / 2 + gap;
  const circumference = 2 * Math.PI * radius;
  const center = containerSize / 2 + gap;

  const pathRef = useRef<SVGCircleElement>(null);
  const prevProgressRef = useRef(progress);
  const disableTransitionRef = useRef(false);

  /* ---------- Detect reset ---------- */
  useEffect(() => {
    if (progress < prevProgressRef.current) {
      // progress reset detected
      disableTransitionRef.current = true;

      // re-enable animation next frame
      requestAnimationFrame(() => {
        disableTransitionRef.current = false;
      });
    }

    prevProgressRef.current = progress;
  }, [progress]);

  /* ---------- Dot position ---------- */
  let dotX = center;
  let dotY = center;

  if (pathRef.current) {
    const length = (progress / 100) * circumference;
    const point = pathRef.current.getPointAtLength(length);
    dotX = point.x;
    dotY = point.y;
  }

  const dashOffset =
    circumference - (progress / 100) * circumference;

  const transitionStyle = disableTransitionRef.current
    ? "none"
    : "stroke-dashoffset 120ms linear";

  return (
    <svg
      width={containerSize + gap * 2}
      height={containerSize + gap * 2}
      viewBox={`0 0 ${containerSize + gap * 2} ${containerSize + gap * 2}`}
      className="absolute inset-0 pointer-events-none"
    >
      {/* ---------- defs ---------- */}
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={containerSize + gap * 2}
          y2={containerSize + gap * 2}
        >
          <stop offset="0%" stopColor={colors.primary300} />
          <stop offset="20%" stopColor={colors.primary400} />
          <stop offset="40%" stopColor={colors.primary500} />
          <stop offset="60%" stopColor={colors.accent300} />
          <stop offset="80%" stopColor={colors.accent400} />
          <stop offset="100%" stopColor={colors.accent500} />
        </linearGradient>

        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ---------- Base ring ---------- */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={colors.neutral700}
        strokeWidth={strokeWidth}
        opacity={0.3}
      />

      {/* ---------- Glow arc ---------- */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={`url(#${gradientId})`}
        strokeWidth={glowWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={0.45}
        filter={`url(#${glowId})`}
        style={{ transition: transitionStyle }}
      />

      {/* ---------- Main arc ---------- */}
      <circle
        ref={pathRef}
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: transitionStyle }}
      />
      <circle
        cx={dotX}
        cy={dotY}
        r={strokeWidth * 2.2}
        fill={colors.accent500}
        opacity={0.35}
        filter={`url(#${glowId})`}
      />
      <circle
        cx={dotX}
        cy={dotY}
        r={strokeWidth + 1}
        fill={colors.accent500}
        style={{
          transition: disableTransitionRef.current
            ? "none"
            : "cx 120ms linear, cy 120ms linear",
        }}
      />
    </svg>
  );
};

export default CircleWithArc;
