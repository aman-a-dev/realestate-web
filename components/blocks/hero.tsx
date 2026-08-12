"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import {
  Search,
  MapPin,
  X,
  Home,
  Building2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Star,
  Pin,
  HousePlus,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { properties, Property } from "@/lib/properties";
import { melodramaFont } from "@/lib/font";

// --- helpers ---
const formatPrice = (price: number, status: string) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return status === "For Rent" ? `${formatted}/mo` : formatted;
};

const getPropertyIcon = (type: string) => {
  switch (type) {
    case "Villa":
      return <Home size={18} />;
    case "Penthouse":
      return <TrendingUp size={18} />;
    default:
      return <Building2 size={18} />;
  }
};

// --- Animation variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const dropdownItemVariants: Variants = {
  hidden: { opacity: 0, x: -10, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  }),
  exit: { opacity: 0, x: -10, scale: 0.98 },
};

// --- Hero component ---
export default function Hero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring-based mouse tracking for background parallax
  const springConfig = { stiffness: 50, damping: 20 };
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter properties based on query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return properties
      .filter((p) => {
        const matchTitle = p.title?.toLowerCase().includes(lowerQuery) || false;
        const matchCity = p.city?.toLowerCase().includes(lowerQuery) || false;
        const matchLocation =
          p.location?.toLowerCase().includes(lowerQuery) || false;
        const matchType = p.type?.toLowerCase().includes(lowerQuery) || false;
        const matchTags =
          p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          false;
        return (
          matchTitle || matchCity || matchLocation || matchType || matchTags
        );
      })
      .slice(0, 5);
  }, [query]);

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center bg-background overflow-hidden">
      {/* --- Sophisticated background layers --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Primary blob - top right */}
        <motion.div
          className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[100px]"
          style={{ x: bgX, y: bgY }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        {/* Secondary blob - bottom left */}
        <motion.div
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-secondary/[0.12] blur-[120px]"
          style={{
            x: useTransform(bgX, (v) => -v * 1.5),
            y: useTransform(bgY, (v) => -v * 1.5),
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
          }}
        />
        {/* Accent blob - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.04] blur-[130px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      {/* Refined grid pattern */}
      <div className="absolute inset-0 -z-5 opacity-[0.025] bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* --- Main hero content --- */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* badge / tagline */}
        <motion.div variants={itemVariants}>
          <Link href="/properties" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-8 backdrop-blur-md shadow-sm cursor-pointer"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              >
                <Sparkles size={16} className="text-primary" />
              </motion.span>
              <span>Find your dream home in Ethiopia</span>
              <ChevronRight size={14} className="opacity-60" />
            </motion.div>
          </Link>
        </motion.div>

        {/* main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
        >
          Discover{" "}
          <span className="relative inline-block">
            <span
              className={`${melodramaFont.className} bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent`}
            >
              Extraordinary
            </span>
            <motion.span
              className="absolute -bottom-3 left-0 w-full h-3 bg-primary/15 rounded-full blur-md"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 1.1,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </span>
          <br />
          Properties
        </motion.h1>

        {/* subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground/80 leading-relaxed"
        >
          Explore curated homes, apartments, and villas across the most vibrant
          cities. Your next address starts here.
        </motion.p>

        {/* --- Search bar --- */}
        <motion.div
          ref={containerRef}
          variants={itemVariants}
          className="relative w-full max-w-2xl mx-auto mt-10"
        >
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused
                ? "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px hsl(var(--primary)/0.15)"
                : "0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px hsl(var(--border))",
            }}
            transition={{
              type: "spring" as const,
              stiffness: 400,
              damping: 25,
            }}
            className="relative w-full bg-card/90 backdrop-blur-xl rounded-2xl border border-border/40 overflow-hidden group"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <motion.div
                animate={
                  isFocused
                    ? { scale: 1.1, rotate: -10 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Search
                  size={20}
                  className="text-primary/60 group-focus-within:text-primary transition-colors duration-300"
                />
              </motion.div>
            </div>

            <Input
              type="text"
              placeholder="Search by city, neighborhood, or features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full h-[60px] pl-14 pr-32 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-base rounded-2xl"
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6, width: 0 }}
                    animate={{ opacity: 1, scale: 1, width: "auto" }}
                    exit={{ opacity: 0, scale: 0.6, width: 0 }}
                    onClick={() => setQuery("")}
                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </motion.button>
            </div>
          </motion.div>

          {/* --- Search dropdown results --- */}
          <AnimatePresence mode="wait">
            {showDropdown && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                  scale: 0.96,
                  filter: "blur(8px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, scale: 0.96, filter: "blur(8px)" }}
                transition={{
                  type: "spring" as const,
                  stiffness: 350,
                  damping: 30,
                }}
                className="absolute z-50 w-full mt-4 bg-popover/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5"
              >
                {results.length > 0 ? (
                  <div className="p-2">
                    <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {results.length} properties found
                      </span>
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/10">
                        TOP MATCHES
                      </span>
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {results.map((property, index) => (
                        <motion.div
                          key={property.id}
                          custom={index}
                          variants={dropdownItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            href={`/properties/${property.id}`}
                            className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground transition-all duration-300 shadow-sm"
                            >
                              {getPropertyIcon(property.type)}
                            </motion.div>

                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                                {property.title}
                              </h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <MapPin
                                  size={11}
                                  className="flex-shrink-0 text-muted-foreground/60"
                                />
                                <span className="truncate">
                                  {property.location}, {property.city}
                                </span>
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0 hidden sm:block">
                              <p className="text-sm font-bold text-foreground tabular-nums">
                                {formatPrice(property.price, property.status)}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                                {property.beds} bd · {property.baths} ba
                              </p>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex-shrink-0"
                            >
                              <ArrowRight
                                size={16}
                                className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                              />
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 mx-2 px-4 py-3 bg-muted/50 rounded-xl border border-border/30 text-xs text-muted-foreground flex justify-between items-center"
                    >
                      <span className="flex items-center gap-2">
                        <kbd className="px-2 py-0.5 bg-background rounded-md border border-border text-[10px] font-mono shadow-sm">
                          ↵
                        </kbd>
                        <span>Press Enter to see all results</span>
                      </span>
                      <Link
                        href="/properties"
                        className="text-primary font-medium hover:underline underline-offset-2"
                      >
                        View all
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                      className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-2xl mb-4 shadow-inner"
                    >
                      🔍
                    </motion.div>
                    <p className="text-sm font-semibold text-foreground">
                      No properties found
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                      Try searching for{" "}
                      <span className="text-primary font-medium">"Bole"</span>,{" "}
                      <span className="text-primary font-medium">
                        "Bahir Dar"
                      </span>
                      , or{" "}
                      <span className="text-primary font-medium">"Pool"</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* quick action buttons / stats */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          {[
            {
              icon: HousePlus,
              value: "500+",
              label: "luxury listings",
              color: "from-blue-500/10 to-blue-500/5",
            },
            {
              icon: Pin,
              value: "12",
              label: "cities",
              color: "from-emerald-500/10 to-emerald-500/5",
            },
            {
              icon: Star,
              value: "4.9",
              label: "average rating",
              color: "from-amber-500/10 to-amber-500/5",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-border/30 shadow-sm cursor-default`}
            >
              <stat.icon size={17} className="text-foreground/70" />
              <span className="font-bold text-foreground tabular-nums">
                {stat.value}
              </span>
              <span className="text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted by / social proof */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground/60"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-muted to-muted/60 border-2 border-background shadow-sm"
              />
            ))}
          </div>
          <span>
            Trusted by{" "}
            <span className="font-semibold text-foreground/70">2,000+</span>{" "}
            happy homeowners
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground/30"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
