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
    maxRadius: 12,
    edgePadding: 2,
    wavefrontSpeed: 100,   // ms per dot-spacing
    bandDuration: 300,     // ms — smooth sin curve
    rippleLifetime: 3000,
    mode: "smooth" as const,
  },
  hero: {
    dotSize: 5,            // Change 2: larger dots
    spacing: 36,           // Change 2: wider spacing
    baseOpacity: 0.5,
    activeOpacity: 0.75,
    rippleIntervalMin: 6000,
    rippleIntervalMax: 9000,
    maxRipples: 1,
    maxRadius: 22,         // Change 4B: wave travels ~22 dots before dissipating
    edgePadding: 2,
    wavefrontSpeed: 110,   // ms per dot-spacing
    bandDuration: 430,     // Change 3: shutter total cycle (80 activate + 150 hold + 200 release)
    rippleLifetime: 5000,  // longer lifetime for the longer travel distance
    mode: "shutter" as const,
  },
};

const INACTIVE_COLOR = { r: 216, g: 215, b: 210 }; // #D8D7D2
const ACTIVE_COLOR = { r: 10, g: 10, b: 10 };      // #0A0A0A

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

// Shutter easing: fast snap to dark, hold, smooth release
function shutterIntensity(timeInBand: number, bandDuration: number): number {
  const activateEnd = 80;
  const holdEnd = 230;    // 80 + 150
  // releaseEnd = bandDuration (430)

  if (timeInBand < activateEnd) {
    // Sharp snap to dark — cubic-bezier(0.7, 0, 0.84, 0) approximation
    const t = timeInBand / activateEnd;
    return t * t * (3 - 2 * t); // smooth but quick
  } else if (timeInBand < holdEnd) {
    // Hold at peak
    return 1;
  } else {
    // Smooth release — ease-out
    const t = (timeInBand - holdEnd) / (bandDuration - holdEnd);
    return 1 - t * t; // quadratic ease-out
  }
}

// Footer: smooth sin curve
function smoothIntensity(timeInBand: number, bandDuration: number): number {
  return Math.sin((timeInBand / bandDuration) * Math.PI);
}

function getDotStateFooter(
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
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > config.maxRadius) continue;

    const ageMs = now - ripple.startedAt;
    const arrivalMs = dist * config.wavefrontSpeed;
    const t = ageMs - arrivalMs;

    if (t >= 0 && t <= config.bandDuration) {
      const falloff = Math.max(0, 1 - dist / config.maxRadius);
      const band = smoothIntensity(t, config.bandDuration);
      highestIntensity = Math.max(highestIntensity, falloff * band);
    }
  }

  return {
    r: lerp(INACTIVE_COLOR.r, ACTIVE_COLOR.r, highestIntensity),
    g: lerp(INACTIVE_COLOR.g, ACTIVE_COLOR.g, highestIntensity),
    b: lerp(INACTIVE_COLOR.b, ACTIVE_COLOR.b, highestIntensity),
    a: lerp(config.baseOpacity, config.activeOpacity, highestIntensity),
  };
}

function getDotStateHero(
  row: number,
  col: number,
  ripples: Ripple[],
  now: number,
  config: (typeof CONFIG)["hero"]
): { r: number; g: number; b: number; a: number } {
  let highestIntensity = 0;

  for (const ripple of ripples) {
    const dx = col - ripple.originCol;
    const dy = row - ripple.originRow;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > config.maxRadius) continue;

    const ageMs = now - ripple.startedAt;
    const arrivalMs = dist * config.wavefrontSpeed;
    const t = ageMs - arrivalMs;

    if (t >= 0 && t <= config.bandDuration) {
      // Change 4B: steep exponential falloff — most dissipation in last third
      const falloff = Math.pow(Math.max(0, 1 - dist / config.maxRadius), 1.5);
      const band = shutterIntensity(t, config.bandDuration);
      highestIntensity = Math.max(highestIntensity, falloff * band);
    }
  }

  return {
    r: lerp(INACTIVE_COLOR.r, ACTIVE_COLOR.r, highestIntensity),
    g: lerp(INACTIVE_COLOR.g, ACTIVE_COLOR.g, highestIntensity),
    b: lerp(INACTIVE_COLOR.b, ACTIVE_COLOR.b, highestIntensity),
    a: lerp(config.baseOpacity, config.activeOpacity, highestIntensity),
  };
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

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
    if (rows <= 0 || cols <= 0) return;

    let originRow: number;
    let originCol: number;

    if (variant === "hero") {
      // Change 1: Fixed off-screen origin — right edge, vertically centered
      originRow = Math.floor(rows / 2);
      originCol = cols + 5; // 5 dot-spacings beyond right edge
    } else {
      // Footer: random origin within grid
      const padding = config.edgePadding;
      originRow = padding + Math.floor(Math.random() * (rows - padding * 2));
      originCol = padding + Math.floor(Math.random() * (cols - padding * 2));
    }

    ripplesRef.current.push({
      originRow,
      originCol,
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

    rippleTimerRef.current = setTimeout(() => {
      spawnRipple();
      scheduleNext();
    }, 2000);

    return () => {
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, [reducedMotion, rows, cols, config, spawnRipple]);

  // Animation loop — ~20fps
  useEffect(() => {
    if (reducedMotion || rows === 0 || cols === 0) return;

    const getDotState = variant === "hero" ? getDotStateHero : getDotStateFooter;

    function tick() {
      const now = performance.now();

      if (now - lastUpdateRef.current < 50) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdateRef.current = now;

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

      if (ripples.length === 0) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const baseFill = `rgba(${INACTIVE_COLOR.r},${INACTIVE_COLOR.g},${INACTIVE_COLOR.b},${config.baseOpacity.toFixed(2)})`;

      circles.forEach((circle) => {
        const row = parseInt(circle.dataset.row || "0");
        const col = parseInt(circle.dataset.col || "0");

        // Quick bounding-box check
        let nearRipple = false;
        for (const ripple of ripples) {
          const dx = Math.abs(col - ripple.originCol);
          const dy = Math.abs(row - ripple.originRow);
          if (dx <= config.maxRadius + 2 && dy <= config.maxRadius + 2) {
            nearRipple = true;
            break;
          }
        }

        if (!nearRipple) {
          const currentFill = circle.getAttribute("fill");
          if (currentFill !== baseFill) {
            circle.setAttribute("fill", baseFill);
          }
          return;
        }

        const { r, g, b, a } = getDotState(row, col, ripples, now, config as any);
        circle.setAttribute(
          "fill",
          `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(2)})`
        );
      });

      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [reducedMotion, rows, cols, config, variant]);

  // Build dot circles
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

  // Change 4A: No text mask — dots appear uniformly everywhere
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
          {circles}
        </svg>
      )}
    </div>
  );
}
