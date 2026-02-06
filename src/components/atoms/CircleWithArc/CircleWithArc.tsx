import React, { type ReactNode, useEffect, useId, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import { useColors } from "../../../utils/theme";

interface CircleWithArcProps {
  progress: number;
  size: number;
  padding?: number;
  children: ReactNode;
}

const CircleWithArc: React.FC<CircleWithArcProps> = ({
  progress,
  size,
  padding = 16,
  children,
}) => {
  const colors = useColors();
  const isMobile = useMediaQuery("(max-width:768px)");

  const gradientId = useId();
  const glowId = useId();

  const strokeWidth = isMobile ? 2 : 3;
  const glowWidth = strokeWidth * 2.5;

  const imageRadius = size / 2;
  const radius = imageRadius + padding + strokeWidth / 2;

  const svgSize = size + padding * 2 + strokeWidth * 2;
  const center = svgSize / 2;

  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  const pathRef = useRef<SVGCircleElement>(null);
  const prevProgress = useRef(progress);
  const disableTransition = useRef(false);

  useEffect(() => {
    if (progress < prevProgress.current) {
      disableTransition.current = true;
      requestAnimationFrame(() => {
        disableTransition.current = false;
      });
    }
    prevProgress.current = progress;
  }, [progress]);

  let dotX = center;
  let dotY = center;

  if (pathRef.current) {
    const length = (progress / 100) * circumference;
    const point = pathRef.current.getPointAtLength(length);
    dotX = point.x;
    dotY = point.y;
  }

  const transition = disableTransition.current
    ? "none"
    : "stroke-dashoffset 120ms linear";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: svgSize, height: svgSize }}
    >
      <div
        className="relative z-10 rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        {children}
      </div>

      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={svgSize}
            y2={svgSize}
          >
            <stop offset="0%" stopColor={colors.primary300} />
            <stop offset="40%" stopColor={colors.primary500} />
            <stop offset="100%" stopColor={colors.accent500} />
          </linearGradient>

          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.neutral700}
          strokeWidth={strokeWidth}
          opacity={0.25}
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={glowWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={0.45}
          filter={`url(#${glowId})`}
          style={{ transition }}
        />

        <circle
          ref={pathRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition }}
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
            transition: disableTransition.current
              ? "none"
              : "cx 120ms linear, cy 120ms linear",
          }}
        />
      </svg>
    </div>
  );
};

export default CircleWithArc;
