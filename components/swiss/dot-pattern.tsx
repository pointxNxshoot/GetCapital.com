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
    rippleIntervalMax: 4000,
    maxRipples: 2,
    maxRadius: 6,
    edgePadding: 2,
  },
  hero: {
    dotSize: 3,
    spacing: 32,
    baseOpacity: 0.3,
    activeOpacity: 0.6,
    rippleIntervalMin: 5000,
    rippleIntervalMax: 7000,
    maxRipples: 1,
    maxRadius: 6,
    edgePadding: 2,
  },
};

const INACTIVE_COLOR = { r: 216, g: 215, b: 210 }; // #D8D7D2
const ACTIVE_COLOR = { r: 10, g: 10, b: 10 }; // #0A0A0A

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getDotOpacity(
  row: number,
  col: number,
  ripples: Ripple[],
  now: number,
  config: (typeof CONFIG)["footer"]
): { r: number; g: number; b: number; a: number } {
  let maxInfluence = 0;

  for (const ripple of ripples) {
    const distance = Math.sqrt(
      (row - ripple.originRow) ** 2 + (col - ripple.originCol) ** 2
    );

    if (distance > config.maxRadius) continue;

    const ageMs = now - ripple.startedAt;
    const waveArrivalMs = distance * 100;
    const timeRelativeToWave = ageMs - waveArrivalMs;

    if (timeRelativeToWave > 0 && timeRelativeToWave < 600) {
      // Active phase — ease in
      const progress = Math.min(timeRelativeToWave / 200, 1);
      maxInfluence = Math.max(maxInfluence, progress);
    } else if (timeRelativeToWave >= 600 && timeRelativeToWave < 1400) {
      // Fade out phase
      const fadeProgress = (timeRelativeToWave - 600) / 800;
      maxInfluence = Math.max(maxInfluence, 1 - fadeProgress);
    }
  }

  const r = lerp(INACTIVE_COLOR.r, ACTIVE_COLOR.r, maxInfluence);
  const g = lerp(INACTIVE_COLOR.g, ACTIVE_COLOR.g, maxInfluence);
  const b = lerp(INACTIVE_COLOR.b, ACTIVE_COLOR.b, maxInfluence);
  const a = lerp(config.baseOpacity, config.activeOpacity, maxInfluence);

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
      // Avoid the text area (left 60%, middle 60% vertically)
      const attempts = 20;
      let found = false;
      for (let i = 0; i < attempts; i++) {
        originRow = padding + Math.floor(Math.random() * (rows - padding * 2));
        originCol = padding + Math.floor(Math.random() * (cols - padding * 2));
        const colPct = originCol / cols;
        const rowPct = originRow / rows;
        // Avoid the zone where text lives (left 65%, vertical 25%-75%)
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
    }, 1500);

    return () => {
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, [reducedMotion, rows, cols, config, spawnRipple]);

  // Animation loop — update dot colors at ~15fps
  useEffect(() => {
    if (reducedMotion || rows === 0 || cols === 0) return;

    function tick() {
      const now = performance.now();

      // Throttle to ~15fps (66ms)
      if (now - lastUpdateRef.current < 66) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdateRef.current = now;

      // Clean expired ripples (older than 2.5s)
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.startedAt < 2500
      );

      const svg = svgRef.current;
      if (!svg) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const circles = svg.querySelectorAll("circle");
      const ripples = ripplesRef.current;

      circles.forEach((circle) => {
        const row = parseInt(circle.dataset.row || "0");
        const col = parseInt(circle.dataset.col || "0");
        const { r, g, b, a } = getDotOpacity(row, col, ripples, now, config);
        circle.setAttribute("fill", `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(2)})`);
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
