"use client";

/**
 * ImageRevealBackground — Desktop-only interactive image reveal effect.
 * Two full-bleed background images: base layer always visible, reveal layer
 * clipped by a soft radial gradient mask that follows the cursor with easing.
 * SVG grid overlay with parallax offset.
 */

import { useEffect, useRef, useState } from "react";

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85";

const EASE_FACTOR = 0.1;
const GRID_EASE = 0.06;

export function ImageRevealBackground() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  // State for grid cell size (initialized with a safe default, updated on client)
  const [cellSize, setCellSize] = useState(36);

  useEffect(() => {
    // Offscreen canvas for mask
    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    // Compute initial cell size
    const computeCellSize = () =>
      Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
    setCellSize(computeCellSize());

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      setCellSize(computeCellSize());
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;

      // Ease smooth toward mouse
      smooth.x += (mouse.x - smooth.x) * EASE_FACTOR;
      smooth.y += (mouse.y - smooth.y) * EASE_FACTOR;

      // Draw radial gradient mask on canvas
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const radius = Math.round(
          Math.min(420, Math.max(160, window.innerWidth * 0.16)),
        );

        const gradient = ctx.createRadialGradient(
          smooth.x,
          smooth.y,
          0,
          smooth.x,
          smooth.y,
          radius,
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.4, "rgba(255,255,255,1)");
        gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
        gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
        gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL();
        if (revealLayerRef.current) {
          revealLayerRef.current.style.maskImage = `url(${dataUrl})`;
          revealLayerRef.current.style.webkitMaskImage = `url(${dataUrl})`;
        }
      }

      // Grid parallax
      const cx = smooth.x / window.innerWidth - 0.5;
      const cy = smooth.y / window.innerHeight - 0.5;
      gridOffsetRef.current.x +=
        (cx * 16 - gridOffsetRef.current.x) * GRID_EASE;
      gridOffsetRef.current.y +=
        (cy * 16 - gridOffsetRef.current.y) * GRID_EASE;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate(${gridOffsetRef.current.x}px, ${gridOffsetRef.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_IMAGE_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Reveal layer */}
      <div
        ref={revealLayerRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_IMAGE_2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />

      {/* SVG grid overlay */}
      <svg
        ref={gridRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 }}
      >
        <defs>
          <pattern
            id="grid"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth={0.6}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
