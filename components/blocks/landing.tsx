"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  TYPES & DEFAULT CONFIG                                            */
/* ------------------------------------------------------------------ */
export type Overlay = {
  label: string;
  heading: string;
  body: string;
  range: [number, number]; // [fadeInStart, fadeOutEnd]
  align: "left" | "right" | "center";
};

export type TraconLandingProps = {
  totalFrames?: number;
  frameFolder?: string;
  framePrefix?: string;
  frameExt?: string;
  bgColor?: string;
  overlays?: Overlay[];
};

const DEFAULT_OVERLAYS: Overlay[] = [
  {
    label: "01 — Design",
    heading: "Crafted for Performance",
    body: "Sleek, lightweight, and built to move with you — every curve engineered for speed.",
    range: [0.0, 0.18],
    align: "left",
  },
  {
    label: "02 — Display",
    heading: "See Beyond the Pixels",
    body: "From 4K OLED to ultra‑smooth refresh rates, your world comes alive in vivid detail.",
    range: [0.22, 0.4],
    align: "right",
  },
  {
    label: "03 — Power",
    heading: "Unleash the Core",
    body: "Next‑gen processors and graphics that redefine what a laptop can do.",
    range: [0.44, 0.62],
    align: "left",
  },
  {
    label: "04 — Battery",
    heading: "Power Through the Day",
    body: "All‑day battery life that keeps up with your hustle, from sunrise to sunset.",
    range: [0.66, 0.82],
    align: "right",
  },
  {
    label: "05 — Connectivity",
    heading: "Stay Connected, Everywhere",
    body: "Wi‑Fi 6E, Thunderbolt 4, and ports for all your peripherals.",
    range: [0.86, 1.0],
    align: "center",
  },
];

/* ------------------------------------------------------------------ */
/*  LOADING SCREEN                                                    */
/* ------------------------------------------------------------------ */
interface LoadingScreenProps {
  progress: number;
  ready: boolean;
  bgColor?: string;
}

export function LoadingScreen({
  progress,
  ready,
  bgColor = "#0a0a0a",
}: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: ready ? 0 : 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 ${
        ready ? "hidden" : ""
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-light tracking-[0.3em] text-foreground text-xs uppercase">
        Loading Experience
      </div>
      <div className="relative h-px w-64 overflow-hidden bg-background">
        <motion.div
          className="absolute inset-y-0 left-0 bg-background"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="font-black text-5xl text-foreground tabular-nums">
        <NumberFlow value={Math.round(progress * 100)} />%
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  OVERLAY STACK (memoized)                                          */
/* ------------------------------------------------------------------ */
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
  const y = useTransform(progress, [start, end], [60, -60]);

  const alignClass =
    overlay.align === "left"
      ? "items-start text-left pl-8 sm:pl-20 md:pl-32"
      : overlay.align === "right"
        ? "items-end text-right pr-8 sm:pr-20 md:pr-32"
        : "items-center text-center px-8";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center ${alignClass}`}
    >
      <motion.div style={{ y: headingY }} className="max-w-xl">
        <div className="mb-4 text-[10px] tracking-[0.4em] text-white uppercase">
          {overlay.label}
        </div>
        <h3 className="font-light tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {overlay.heading}
        </h3>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white sm:text-base">
          {overlay.body}
        </p>
      </motion.div>
    </motion.div>
  );
});

function OverlayStack({
  progress,
  headingY,
  overlays,
}: {
  progress: MotionValue<number>;
  headingY: MotionValue<number>;
  overlays: Overlay[];
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center">
      {overlays.map((o, i) => (
        <OverlayCard
          key={i}
          overlay={o}
          progress={progress}
          headingY={headingY}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                    */
/* ------------------------------------------------------------------ */
export default function Landing({
  totalFrames = 270,
  frameFolder = "/frames",
  framePrefix = "ezgif-frame-",
  frameExt = "jpg",
  bgColor = "var(--background)",
  overlays = DEFAULT_OVERLAYS,
}: TraconLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(-1);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const frameSrc = useCallback(
    (i: number) =>
      `${frameFolder}/${framePrefix}${String(i).padStart(3, "0")}.${frameExt}`,
    [frameFolder, framePrefix, frameExt],
  );

  /* ---------- Preload frames ---------- */
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        loaded++;
        setProgress(loaded / totalFrames);
        if (loaded === totalFrames) setReady(true);
      };
      images.push(img);
    }
    frameCache.current = images;

    return () => {
      frameCache.current = [];
    };
  }, [totalFrames, frameSrc]);
  useEffect(() => {
    toast("Scroll to explor 🔥");
  }, []);
  /* ---------- Scroll-linked canvas scrub ---------- */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = frameCache.current[idx];
    if (!img || !img.complete) return;

    if (
      canvas.width !== img.naturalWidth ||
      canvas.height !== img.naturalHeight
    ) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const idx = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(v * totalFrames)),
        );
        if (idx === currentFrameRef.current) return;
        currentFrameRef.current = idx;
        drawFrame(idx);
      });
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, totalFrames, drawFrame]);

  /* ---------- Parallax transforms ---------- */
  const headingY = useTransform(smoothProgress, [0, 1], [80, -80]);

  return (
    <main
      className="relative w-full my-16"
      style={{ backgroundColor: bgColor, color: "var(--background)" }}
    >
      <LoadingScreen progress={progress} ready={ready} bgColor={bgColor} />

      <section
        ref={containerRef}
        className="relative"
        style={{ height: `${totalFrames * 1.5}vh` }}
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="h-full w-auto md:w-full"
            style={{ backgroundColor: "transparent" }}
            aria-hidden="true"
          />

          <OverlayStack
            progress={smoothProgress}
            headingY={headingY}
            overlays={overlays}
          />
        </div>
      </section>
    </main>
  );
}
