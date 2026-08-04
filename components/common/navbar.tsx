"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  Home,
  LayoutGrid,
  Info,
  Phone,
  MapPin,
  Menu,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { BRAND } from "@/lib/data";
import { Button } from "@/components/ui/button"; // shadcn button

/* ─── Types ─── */
export type NavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/* ─── Navigation Links ─── */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: LayoutGrid },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "Map", href: "/map", icon: MapPin },
];

/* ─── Component ─── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile menu when viewport grows to tablet/desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "bg-ivory-50/90 shadow-[0_1px_0_0_rgba(15,42,32,0.08)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8 lg:px-10">
          <LogoIcon />

          {/* Desktop / tablet navigation */}
          <ul className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative z-10 block px-3 py-2 text-[13px] font-medium uppercase tracking-wide transition-colors lg:px-4 lg:text-sm",
                      active
                        ? "text-forest-800"
                        : "text-forest-700/55 hover:text-forest-800",
                    )}
                  >
                    {link.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-olive-300/25"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/properties">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search listings"
                className="hidden h-10 w-10 rounded-full border border-forest-700/15 text-forest-700 hover:border-forest-700/40 hover:bg-forest-700/5 lg:flex"
              >
                <Search className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </Link>

            <Link href="/contact" className="hidden md:inline-flex">
              <Button
                variant="default"
                className="rounded-full bg-forest-800 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-ivory-50 hover:bg-forest-700 lg:px-5 lg:text-[13px]"
              >
                <span className="lg:hidden">Inquire</span>
                <span className="hidden lg:inline">Get in touch</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 rounded-full text-forest-800 md:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Logo ─── */
function LogoIcon() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Meridian home"
    >
      <Logo />
      <span className="font-display text-[17px] font-semibold tracking-tight text-forest-900 md:text-[19px]">
        {BRAND.name}
      </span>
    </Link>
  );
}

/* ─── Animation Variants ─── */
const overlayVariants: Variants = {
  hidden: { clipPath: "circle(0% at calc(100% - 40px) 32px)" },
  visible: {
    clipPath: "circle(150% at calc(100% - 40px) 32px)",
    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
  },
  exit: {
    clipPath: "circle(0% at calc(100% - 40px) 32px)",
    transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  hidden: { y: 36, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { y: 12, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

/* ─── Mobile Menu ─── */
function MobileMenu({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[60] flex flex-col bg-forest-900/90 backdrop-blur-md text-ivory-50 md:hidden"
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <span className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight">
          <LogoIcon />
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close menu"
          className="h-10 w-10 rounded-full text-ivory-50/90 transition hover:bg-ivory-50/10"
        >
          <X className="h-6 w-6" strokeWidth={1.75} />
        </Button>
      </div>

      {/* Navigation links */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-1 flex-col justify-center gap-0.5 px-5"
      >
        {navLinks.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li
              key={href}
              className="overflow-hidden border-b border-ivory-50/10 py-2.5"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "font-display text-[13vw] font-semibold uppercase leading-[1.05] tracking-tight transition-colors xs:text-[52px]",
                    active
                      ? "text-olive-300"
                      : "text-ivory-50 hover:text-olive-300",
                  )}
                >
                  {label}
                </Link>
                <Icon
                  className="h-6 w-6 shrink-0 text-ivory-50/45"
                  strokeWidth={1.5}
                />
              </motion.div>
            </li>
          );
        })}
      </motion.ul>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.55, duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="flex shrink-0 flex-col gap-1 px-5 py-6 text-xs uppercase tracking-widest text-ivory-50/40 xs:flex-row xs:items-center xs:justify-between"
      >
        <span>Addis Ababa · Nairobi · Dubai</span>
        <span>+251 900 000 000</span>
      </motion.div>
    </motion.div>
  );
}
