// hero.tsx - Fixed version

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      return <Home size={20} />;
    case "Penthouse":
      return <TrendingUp size={20} />;
    default:
      return <Building2 size={20} />;
  }
};

// Fixed positions for floating icons (no random on each render)
const floatingIcons = [
  { emoji: "🏡", top: "15%", left: "85%", size: "44px", delay: 0 },
  { emoji: "🏢", top: "35%", left: "10%", size: "32px", delay: 0.2 },
  { emoji: "🌆", top: "55%", left: "90%", size: "46px", delay: 0.4 },
  { emoji: "🌇", top: "75%", left: "20%", size: "24px", delay: 0.6 },
  { emoji: "🏙️", top: "88%", left: "75%", size: "44px", delay: 0.8 },
  { emoji: "🌃", top: "10%", left: "25%", size: "48px", delay: 1.0 },
];

// --- Hero component ---
export default function Hero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        // Check all string properties
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
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-background">
      {/* --- Extraordinary background layers --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
      </div>

      {/* subtle grid pattern overlay */}
      <div className="absolute inset-0 -z-5 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* floating tiny icons (decorative) - fixed positions for hydration */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-muted-foreground/10"
            style={{
              top: icon.top,
              left: icon.left,
              fontSize: icon.size,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 8 + i * 2,
              ease: "easeInOut",
              delay: icon.delay,
            }}
          >
            {icon.emoji}
          </motion.div>
        ))}
      </div>

      {/* --- Main hero content --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* badge / tagline */}
        <Link href="/properties">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-primary" />
            <span>Find your dream home in Ethiopia</span>
            <ChevronRight size={14} />
          </motion.div>
        </Link>

        {/* main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
        >
          Discover <br className="sm:hidden" />
          <span className="relative inline-block">
            <span className={`${melodramaFont.className}`}>Extraordinary</span>
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full blur-sm"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </span>{" "}
          <br className="hidden sm:inline" />
          Properties
        </motion.h1>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground"
        >
          Explore curated homes, apartments, and villas across the most vibrant
          cities. Your next address starts here.
        </motion.p>

        {/* --- Search bar --- */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative w-full max-w-3xl mx-auto mt-8"
          style={{ zIndex: 999 }} // Higher z-index on the container
        >
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused
                ? "0 20px 40px -12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--primary)/0.2)"
                : "0 8px 30px rgba(0,0,0,0.05), 0 0 0 1px hsl(var(--border))",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-muted-foreground">
              <Search size={22} className="text-primary/70" />
            </div>

            <Input
              type="text"
              placeholder="Search by city, neighborhood, or features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full h-14 pl-14 pr-14 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 text-base rounded-2xl"
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --- Search dropdown results --- */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute z-[9999] w-full mt-3 bg-popover/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                {results.length > 0 ? (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>{results.length} properties found</span>
                      <span className="text-[10px] font-normal bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                        TOP
                      </span>
                    </div>
                    <div className="space-y-1">
                      {results.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/properties/${property.id}`}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                              {getPropertyIcon(property.type)}
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {property.title}
                              </h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin size={12} className="flex-shrink-0" />
                                <span className="truncate">
                                  {property.location}, {property.city}
                                </span>
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0 hidden sm:block">
                              <p className="text-sm font-bold text-foreground">
                                {formatPrice(property.price, property.status)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {property.beds} bd • {property.baths} ba
                              </p>
                            </div>

                            <ArrowRight
                              size={16}
                              className="text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0"
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-2 px-3 py-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
                      <span>Press Enter to see all</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">
                        ↵
                      </kbd>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center text-3xl mb-3">
                      🔍
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No properties found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Try "bole", "Bahir Dar", or "Pool" – we'll find something
                      amazing.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* quick action buttons / stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/40">
            <span className="font-semibold text-foreground flex gap-1 items-center">
              <HousePlus /> 500+
            </span>
            <span>luxury listings</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/40">
            <span className="font-semibold text-foreground flex gap-1 items-center">
              <Pin /> 12
            </span>
            <span>cities</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/40">
            <span className="font-semibold text-foreground flex gap-1 items-center">
              <Star /> 4.9
            </span>
            <span>average rating</span>
          </div>
        </motion.div>

        {/* decorative arrow hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-muted-foreground/40 text-xs"
        >
          <span>scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronRight size={14} className="rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
