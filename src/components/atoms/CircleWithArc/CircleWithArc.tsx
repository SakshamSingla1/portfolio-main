import React, {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
  padding = 18,
  children,
}) => {
  const colors = useColors();
  const isMobile = useMediaQuery("(max-width:768px)");

  const gradientId = useId();
  const glowId = useId();
  const softGlowId = useId();

  const strokeWidth = isMobile ? 2 : 3;
  const glowWidth = strokeWidth * 2.5;

  /* ---------------------------------- */
  /* Geometry */
  /* ---------------------------------- */

  const imageRadius = size / 2;
  const radius = imageRadius + padding;
  const svgSize = (radius + strokeWidth) * 2;
  const center = svgSize / 2;

  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (progress / 100) * circumference;

  const pathRef = useRef<SVGCircleElement>(null);
  const prevProgress = useRef(progress);
  const disableTransition = useRef(false);

  const [dot, setDot] = useState({
    x: center,
    y: center,
  });

  /* ---------------------------------- */
  /* Smooth Reset Handling */
  /* ---------------------------------- */
  useEffect(() => {
    if (progress < prevProgress.current) {
      disableTransition.current = true;
      requestAnimationFrame(() => {
        disableTransition.current = false;
      });
    }
    prevProgress.current = progress;
  }, [progress]);

  /* ---------------------------------- */
  /* Dot Tracking (correct way) */
  /* ---------------------------------- */
  useEffect(() => {
    if (!pathRef.current) return;

    const length =
      (progress / 100) * circumference;

    const point =
      pathRef.current.getPointAtLength(length);

    setDot({
      x: point.x,
      y: point.y,
    });
  }, [progress, circumference]);

  const transition = disableTransition.current
    ? "none"
    : "stroke-dashoffset 120ms linear";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: svgSize,
        height: svgSize,
      }}
    >
      {/* Avatar */}
      <div
        className="relative z-10 rounded-full overflow-hidden transition-transform duration-500 hover:scale-105"
        style={{ width: size, height: size }}
      >
        {children}
      </div>

      {/* SVG */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute inset-0 pointer-events-none overflow-visible"
      >
        <defs>
          {/* Animated Gradient */}
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors.primary300} />
            <stop offset="50%" stopColor={colors.primary500} />
            <stop offset="100%" stopColor={colors.accent500} />

            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Main Glow */}
          <filter
            id={glowId}
            x={-svgSize}
            y={-svgSize}
            width={svgSize * 3}
            height={svgSize * 3}
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur
              stdDeviation="8"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Outer Glow */}
          <filter
            id={softGlowId}
            x={-svgSize}
            y={-svgSize}
            width={svgSize * 3}
            height={svgSize * 3}
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.neutral700}
          strokeWidth={strokeWidth}
          opacity={0.25}
        />

        {/* Secondary Orbit Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 6}
          fill="none"
          stroke={colors.primary400}
          strokeWidth={1}
          opacity={0.15}
          strokeDasharray="4 8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Soft Glow Layer */}
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
          opacity={0.4}
          filter={`url(#${softGlowId})`}
        />

        {/* Main Arc */}
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
          filter={`url(#${glowId})`}
          style={{ transition }}
        />


        {/* Core Dot */}
        <circle
          cx={dot.x}
          cy={dot.y}
          r={strokeWidth + 1.2}
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
