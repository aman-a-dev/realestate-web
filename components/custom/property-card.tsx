"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import type { Property } from "@/lib/properties";

interface PropertyCardProps {
  property: Property;
  index: number;
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  const isSale = property.status === "For Sale";
  const [isLiked, setIsLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── 3D Tilt Physics ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  // ── Image Parallax ──
  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });

  // ── Spotlight Position ──
  const [spotlight, setSpotlight] = useState({ x: "50%", y: "50%" });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setSpotlight({
        x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
        y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      });
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlight({ x: "50%", y: "50%" });
  }, [mouseX, mouseY]);

  // ── Animation Variants ──
  const containerVariants = {
    hidden: { opacity: 0, y: 60, rotateX: 15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  const staggerChildren = (baseDelay: number) => ({
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.12 + baseDelay,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  });

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group h-full mx-3 relative"
    >
      {/* Animated Gradient Border Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/60 via-purple-500/60 to-primary/60 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

      <div className="relative h-full flex flex-col rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
        {/* Mouse-tracking Spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `radial-gradient(600px circle at ${spotlight.x} ${spotlight.y}, rgba(255,255,255,0.07), transparent 40%)`,
          }}
        />

        {/* ═══════════════════════════════════════
            IMAGE SECTION
        ═══════════════════════════════════════ */}
        <div className="relative h-60 overflow-hidden">
          <motion.img
            src={property.image}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ x: imgX, y: imgY }}
            loading="lazy"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/30" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+")`,
            }}
          />

          {/* Status Badge — Pulsing Dot */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.12 + 0.3,
              type: "spring",
              stiffness: 200,
            }}
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
              isSale
                ? "bg-primary text-white shadow-primary"
                : "bg-card text-black shadow-card"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSale ? "bg-white" : "bg-black"
                } animate-pulse`}
              />
              {property.status}
            </span>
          </motion.div>

          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked((p) => !p);
            }}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-black/50 transition-colors z-20"
          >
            <Heart
              size={16}
              className={`transition-all duration-300 ${
                isLiked
                  ? "fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                  : ""
              }`}
            />
          </motion.button>

          {/* Floating Price Tag */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl"
          >
            <p className="text-white font-bold text-lg tracking-tight">
              ETB {property.price.toLocaleString()}
              {property.status === "For Rent" && (
                <span className="text-xs font-normal text-white/60 ml-1">
                  /mo
                </span>
              )}
            </p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════
            CONTENT SECTION
        ═══════════════════════════════════════ */}
        <div className="p-5 flex flex-col flex-1 relative z-20">
          {/* Location */}
          <motion.div
            variants={staggerChildren(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-1.5 mb-2 text-muted-foreground"
          >
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-medium tracking-wide uppercase">
              {property.city}, {property.location}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            variants={staggerChildren(0.28)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300"
          >
            {property.title}
          </motion.h3>

          {/* Animated Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.12 + 0.35,
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50 mt-4 mb-4 origin-left"
          />

          {/* Stats — Pill Style */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            {property.beds > 0 && (
              <motion.span
                variants={staggerChildren(0.42)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1.5 rounded-lg border border-border/50 backdrop-blur-sm"
              >
                <BedDouble size={15} className="text-primary" />
                <span className="font-medium">{property.beds} Beds</span>
              </motion.span>
            )}
            {property.baths > 0 && (
              <motion.span
                variants={staggerChildren(0.48)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1.5 rounded-lg border border-border/50 backdrop-blur-sm"
              >
                <Bath size={15} className="text-primary" />
                <span className="font-medium">{property.baths} Baths</span>
              </motion.span>
            )}
            <motion.span
              variants={staggerChildren(0.54)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1.5 rounded-lg border border-border/50 backdrop-blur-sm"
            >
              <Maximize size={15} className="text-primary" />
              <span className="font-medium">{property.area} m²</span>
            </motion.span>
          </div>

          {/* CTA — Magnetic Fill */}
          <Link
            href={`/properties/${property.id}`}
            className="mt-auto pt-5 block"
          >
            <motion.div
              className="relative flex items-center justify-between w-full py-3 px-5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold text-sm overflow-hidden group/btn border border-primary/20 hover:border-primary/40 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Slide-in Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              />

              <span className="relative z-10 group-hover/btn:text-primary-foreground transition-colors duration-300">
                View Details
              </span>

              <motion.span
                className="relative z-10 flex items-center"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight
                  size={16}
                  className="group-hover/btn:text-primary-foreground transition-colors duration-300"
                />
              </motion.span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
