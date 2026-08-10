"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  MotionValue,
  Variants,
} from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { melodramaFont } from "@/lib/font";

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */
const TOTAL_FRAMES = 270;
const FRAME_FOLDER = "/frames";
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_EXT = "jpg";
const CANVAS_BG = "var(--background)";
const frameSrc = (i: number) =>
  `${FRAME_FOLDER}/${FRAME_PREFIX}${String(i).padStart(3, "0")}.${FRAME_EXT}`;

// Canvas display size (px) – keep moderate for performance
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

/* ------------------------------------------------------------------ */
/*  COPY                                                               */
/* ------------------------------------------------------------------ */
type Overlay = {
  label: string;
  heading: string;
  body: string;
  range: [number, number];
  align: "left" | "right" | "center";
};

const OVERLAYS: Overlay[] = [
  {
    label: "01 — Discover",
    heading: "Every Home, A Story.",
    body: "We start with how you actually live, then find the place built to hold it.",
    range: [0.0, 0.18],
    align: "left",
  },
  {
    label: "02 — Design",
    heading: "Crafted Interiors, Considered Details.",
    body: "From the light in the morning kitchen to the quiet of the reading corner, nothing is left to chance.",
    range: [0.22, 0.4],
    align: "right",
  },
  {
    label: "03 — Location",
    heading: "Rooted In The Right Neighborhood.",
    body: "A great home is only as good as the block it sits on. We vet both.",
    range: [0.44, 0.62],
    align: "left",
  },
  {
    label: "04 — Lifestyle",
    heading: "Spaces That Move With You.",
    body: "Homes that flex from a quiet weekday morning to a house full of guests.",
    range: [0.66, 0.82],
    align: "right",
  },
  {
    label: "05 — Begin",
    heading: "Your Next Chapter Starts Here.",
    body: "Find your dream home — and book a visit before the day is over.",
    range: [0.86, 1.0],
    align: "center",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Homes Delivered" },
  { value: 32, suffix: "", label: "Cities Covered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

/* ------------------------------------------------------------------ */
/*  REVEAL VARIANTS (unchanged)                                       */
/* ------------------------------------------------------------------ */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const wordRevealVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [framesReady, setFramesReady] = useState(false);

  // Hero section in‑view for text reveals
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-10%" });

  // Scroll progress for the canvas section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(
    scrollYProgress,
    prefersReducedMotion
      ? { stiffness: 300, damping: 40, restDelta: 0.001 }
      : { stiffness: 120, damping: 25, restDelta: 0.001 },
  );

  // Page progress for top bar
  const { scrollYProgress: pageProgress } = useScroll();

  // Parallax text offset
  const headingY = useTransform(smoothProgress, [0, 1], [60, -60]);

  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  //  OPTIMISED FRAME LOADING (lazy, batched)
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingQueue = useRef<Set<number>>(new Set());
  const loadedCountRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  // Pre‑load first few frames immediately so canvas can show something
  useEffect(() => {
    const preloadCount = 10;
    for (let i = 0; i < preloadCount && i < TOTAL_FRAMES; i++) {
      loadFrame(i);
    }
  }, []);

  const loadFrame = useCallback((index: number) => {
    if (frameCache.current.has(index) || loadingQueue.current.has(index))
      return;
    loadingQueue.current.add(index);

    const img = new Image();
    img.decoding = "async";
    img.src = frameSrc(index + 1);

    img
      .decode()
      .then(() => {
        frameCache.current.set(index, img);
        loadingQueue.current.delete(index);
        loadedCountRef.current++;
        // Batch progress updates to avoid re‑rendering on every load
        if (
          loadedCountRef.current % 5 === 0 ||
          loadedCountRef.current === TOTAL_FRAMES
        ) {
          setLoadProgress(loadedCountRef.current / TOTAL_FRAMES);
        }
        if (loadedCountRef.current === TOTAL_FRAMES) {
          setFramesReady(true);
        }
        // If this frame is currently needed, draw it
        const currentIdx = currentFrameRef.current;
        if (currentIdx === index) {
          drawFrame(index);
        }
      })
      .catch(() => {
        loadingQueue.current.delete(index);
      });
  }, []);

  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  //  CANVAS DRAWING (with frame index guard & RAF)
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  const currentFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = frameCache.current.get(index);
    if (!img) return; // not loaded yet

    // Set canvas size only once (or when needed)
    if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }

    ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    currentFrameRef.current = index;
  }, []);

  // Listen to scroll progress and request the frame
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const idx = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(v * TOTAL_FRAMES)),
        );
        if (idx === currentFrameRef.current) return;

        // Ensure this frame is loaded (or in queue)
        if (!frameCache.current.has(idx)) {
          loadFrame(idx);
          // Also load neighbours ahead
          for (let offset = 1; offset <= 3; offset++) {
            const nextIdx = idx + offset;
            if (nextIdx < TOTAL_FRAMES && !frameCache.current.has(nextIdx)) {
              loadFrame(nextIdx);
            }
            const prevIdx = idx - offset;
            if (prevIdx >= 0 && !frameCache.current.has(prevIdx)) {
              loadFrame(prevIdx);
            }
          }
        }

        // Draw if loaded
        if (frameCache.current.has(idx)) {
          drawFrame(idx);
        }
      });
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, loadFrame, drawFrame]);

  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  //  RENDER
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  return (
    <>
      <main className="relative w-full">
        {/* Ambient glow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-forest/10 blur-3xl sm:h-[440px] sm:w-[440px]"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ============ CANVAS SECTION ============ */}
        <section
          ref={containerRef}
          className="relative mt-10"
          style={{
            height: `${TOTAL_FRAMES * 1.5}vh`,
            backgroundColor: CANVAS_BG,
          }}
        >
          <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
            {/* Minimal loading indicator (only shown briefly) */}
            {!framesReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm">
                Loading frames… {Math.round(loadProgress * 100)}%
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="h-full w-auto md:w-full"
              style={{
                backgroundColor: "transparent",
                imageRendering: "pixelated", // speeds up drawing
              }}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              aria-hidden="true"
            />

            <OverlayStack progress={smoothProgress} headingY={headingY} />
          </div>
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  STAT ITEM (memoised)                                              */
/* ------------------------------------------------------------------ */
const StatItem = memo(function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let start: number | null = null;
    const duration = 1100;
    let frame: number;

    function step(ts: number) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setDisplay(Math.floor(t * value));
      if (t < 1) frame = requestAnimationFrame(step);
      else setDisplay(value);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left"
    >
      <span
        className={`${melodramaFont.className} text-3xl font-medium text-forest sm:text-4xl`}
      >
        {display}
        {suffix}
      </span>
      <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  OVERLAY STACK (memoised)                                          */
/* ------------------------------------------------------------------ */
const OverlayStack = memo(function OverlayStack({
  progress,
  headingY,
}: {
  progress: MotionValue<number>;
  headingY: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center">
      {OVERLAYS.map((o, i) => (
        <OverlayCard
          key={i}
          overlay={o}
          progress={progress}
          headingY={headingY}
        />
      ))}
    </div>
  );
});

const OverlayCard = memo(function OverlayCard({
  overlay,
  progress,
  headingY,
}: {
  overlay: Overlay;
  progress: MotionValue<number>;
  headingY: MotionValue<number>;
}) {
  const [start, end] = overlay.range;
  const mid = (start + end) / 2;
  const fadeIn = start + (mid - start) * 0.3;
  const fadeOut = mid + (end - mid) * 0.7;

  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [50, -50]);

  const alignClass =
    overlay.align === "left"
      ? "items-start text-left pl-6 sm:pl-20 md:pl-32"
      : overlay.align === "right"
        ? "items-end text-right pr-6 sm:pr-20 md:pr-32"
        : "items-center text-center px-6";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center ${alignClass}`}
    >
      <motion.div style={{ y: headingY }} className="max-w-xl">
        <div className="mb-3 text-[10px] tracking-[0.4em] text-foreground uppercase sm:mb-4">
          {overlay.label}
        </div>
        <h3
          className={`${melodramaFont.className} font-light tracking-tight text-white/90 text-3xl sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          {overlay.heading}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:mt-6 sm:text-base">
          {overlay.body}
        </p>
      </motion.div>
    </motion.div>
  );
});
