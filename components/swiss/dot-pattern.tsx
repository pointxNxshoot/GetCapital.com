"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type DotPatternProps = {
  variant: "footer" | "hero";
  className?: string;
};

type Ripple = {
  originRow: number;
  originCol: number;
  startedAt: number;
};

const CONFIG = {
  footer: {
    dotSize: 4,
    spacing: 24,
    baseOpacity: 0.5,
    activeOpacity: 1,
    rippleIntervalMin: 3000,
    rippleIntervalMax: 5000,
    maxRipples: 2,
    maxRadius: 12,        // dots away from origin
    edgePadding: 2,
    wavefrontSpeed: 100,  // ms per dot-spacing
    bandDuration: 300,    // ms each dot stays illuminated
    rippleLifetime: 3000, // ms before ripple is garbage-collected
  },
  hero: {
    dotSize: 3,
    spacing: 32,
    baseOpacity: 0.5,     // increased from 0.3
    activeOpacity: 0.75,  // softer peak than footer
    rippleIntervalMin: 6000,
    rippleIntervalMax: 9000,
    maxRipples: 1,
    maxRadius: 8,         // smaller range than footer
    edgePadding: 2,
    wavefrontSpeed: 130,  // slower wave
    bandDuration: 400,    // softer edges
    rippleLifetime: 3500,
  },
};

const INACTIVE_COLOR = { r: 216, g: 215, b: 210 }; // #D8D7D2
const ACTIVE_COLOR = { r: 10, g: 10, b: 10 };      // #0A0A0A

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getDotState(
  row: number,
  col: number,
  ripples: Ripple[],
  now: number,
  config: (typeof CONFIG)["footer"]
): { r: number; g: number; b: number; a: number } {
  let highestIntensity = 0;

  for (const ripple of ripples) {
    const dx = col - ripple.originCol;
    const dy = row - ripple.originRow;
    const distanceInDots = Math.sqrt(dx * dx + dy * dy);

    // Skip dots beyond max ripple radius
    if (distanceInDots > config.maxRadius) continue;

    const ageMs = now - ripple.startedAt;
    const expectedArrivalMs = distanceInDots * config.wavefrontSpeed;
    const timeRelativeToWave = ageMs - expectedArrivalMs;

    // Dot is illuminated only while wavefront band passes through it
    if (timeRelativeToWave >= 0 && timeRelativeToWave <= config.bandDuration) {
      // Distance falloff — dots further from origin are dimmer
      const distanceFalloff = Math.max(0, 1 - distanceInDots / config.maxRadius);

      // Position within the band — peaks at center (sin curve)
      const bandPosition = timeRelativeToWave / config.bandDuration;
      const bandIntensity = Math.sin(bandPosition * Math.PI);

      const totalIntensity = distanceFalloff * bandIntensity;
      highestIntensity = Math.max(highestIntensity, totalIntensity);
    }
  }

  const r = lerp(INACTIVE_COLOR.r, ACTIVE_COLOR.r, highestIntensity);
  const g = lerp(INACTIVE_COLOR.g, ACTIVE_COLOR.g, highestIntensity);
  const b = lerp(INACTIVE_COLOR.b, ACTIVE_COLOR.b, highestIntensity);
  const a = lerp(config.baseOpacity, config.activeOpacity, highestIntensity);

  return { r, g, b, a };
}

export function DotPattern({ variant, className }: DotPatternProps) {
  const config = CONFIG[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const rippleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Check reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = Math.floor(dimensions.width / config.spacing);
  const rows = Math.floor(dimensions.height / config.spacing);

  // Spawn ripples
  const spawnRipple = useCallback(() => {
    if (reducedMotion) return;
    if (ripplesRef.current.length >= config.maxRipples) return;

    const padding = config.edgePadding;
    if (rows <= padding * 2 || cols <= padding * 2) return;

    let originRow: number;
    let originCol: number;

    if (variant === "hero") {
      // Avoid the text area (left 60%, middle vertically)
      const attempts = 20;
      let found = false;
      for (let i = 0; i < attempts; i++) {
        originRow = padding + Math.floor(Math.random() * (rows - padding * 2));
        originCol = padding + Math.floor(Math.random() * (cols - padding * 2));
        const colPct = originCol / cols;
        const rowPct = originRow / rows;
        if (colPct > 0.6 || rowPct < 0.2 || rowPct > 0.8) {
          found = true;
          break;
        }
      }
      if (!found) {
        originRow = padding + Math.floor(Math.random() * (rows - padding * 2));
        originCol = Math.floor(cols * 0.7 + Math.random() * (cols * 0.25));
      }
    } else {
      originRow = padding + Math.floor(Math.random() * (rows - padding * 2));
      originCol = padding + Math.floor(Math.random() * (cols - padding * 2));
    }

    ripplesRef.current.push({
      originRow: originRow!,
      originCol: originCol!,
      startedAt: performance.now(),
    });
  }, [rows, cols, config, variant, reducedMotion]);

  // Schedule ripples
  useEffect(() => {
    if (reducedMotion || rows === 0 || cols === 0) return;

    function scheduleNext() {
      const delay =
        config.rippleIntervalMin +
        Math.random() * (config.rippleIntervalMax - config.rippleIntervalMin);
      rippleTimerRef.current = setTimeout(() => {
        spawnRipple();
        scheduleNext();
      }, delay);
    }

    // First ripple after a short delay
    rippleTimerRef.current = setTimeout(() => {
      spawnRipple();
      scheduleNext();
    }, 2000);

    return () => {
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, [reducedMotion, rows, cols, config, spawnRipple]);

  // Animation loop — update dot colors at ~20fps
  useEffect(() => {
    if (reducedMotion || rows === 0 || cols === 0) return;

    function tick() {
      const now = performance.now();

      // Throttle to ~20fps (50ms)
      if (now - lastUpdateRef.current < 50) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdateRef.current = now;

      // Clean expired ripples
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.startedAt < config.rippleLifetime
      );

      const svg = svgRef.current;
      if (!svg) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const circles = svg.querySelectorAll("circle");
      const ripples = ripplesRef.current;

      // Only update dots if there are active ripples (performance optimization)
      if (ripples.length === 0) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      circles.forEach((circle) => {
        const row = parseInt(circle.dataset.row || "0");
        const col = parseInt(circle.dataset.col || "0");

        // Quick distance check — skip dots far from all ripples
        let nearRipple = false;
        for (const ripple of ripples) {
          const dx = Math.abs(col - ripple.originCol);
          const dy = Math.abs(row - ripple.originRow);
          if (dx <= config.maxRadius + 1 && dy <= config.maxRadius + 1) {
            nearRipple = true;
            break;
          }
        }

        if (!nearRipple) {
          // Reset to base if not already
          const currentFill = circle.getAttribute("fill");
          const baseFill = `rgba(${INACTIVE_COLOR.r},${INACTIVE_COLOR.g},${INACTIVE_COLOR.b},${config.baseOpacity.toFixed(2)})`;
          if (currentFill !== baseFill) {
            circle.setAttribute("fill", baseFill);
          }
          return;
        }

        const { r, g, b, a } = getDotState(row, col, ripples, now, config);
        circle.setAttribute(
          "fill",
          `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(2)})`
        );
      });

      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [reducedMotion, rows, cols, config]);

  // Build static dot circles
  const circles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      circles.push(
        <circle
          key={`${r}-${c}`}
          data-row={r}
          data-col={c}
          cx={c * config.spacing + config.spacing / 2}
          cy={r * config.spacing + config.spacing / 2}
          r={config.dotSize / 2}
          fill={`rgba(${INACTIVE_COLOR.r},${INACTIVE_COLOR.g},${INACTIVE_COLOR.b},${config.baseOpacity})`}
        />
      );
    }
  }

  // Hero mask to fade dots near text area
  const heroMask =
    variant === "hero" ? (
      <defs>
        <mask id="heroTextMask">
          <rect width="100%" height="100%" fill="white" />
          <ellipse
            cx="35%"
            cy="50%"
            rx="38%"
            ry="32%"
            fill="black"
            opacity="0.65"
          />
        </mask>
      </defs>
    ) : null;

  return (
    <div ref={containerRef} className={cn("w-full h-full", className)}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          aria-hidden="true"
          className="w-full h-full"
        >
          {heroMask}
          <g mask={variant === "hero" ? "url(#heroTextMask)" : undefined}>
            {circles}
          </g>
        </svg>
      )}
    </div>
  );
}
