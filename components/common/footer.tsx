"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  Home,
  Camera,
  LinkIcon,
  Flag,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { navLinks } from "./navbar";
import Logo from "./logo";
import { BRAND } from "@/lib/data";

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: Camera },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkIcon },
  { label: "Facebook", href: "https://facebook.com", icon: Flag },
];

const fadeUp: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pt-20 md:px-8 md:pt-24 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} custom={0}>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-50/55">
              {BRAND.name} across Addis Ababa, Nairobi and Dubai — considered
              listings, no noise.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-50/15 text-ivory-50/70 transition hover:border-olive-400/60 hover:text-olive-300"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigate */}
          <motion.div variants={fadeUp} custom={1}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ivory-50/40">
              Navigate
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} custom={2}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ivory-50/40">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-sm text-ivory-50/70">
              <li className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 shrink-0 text-ivory-50/40"
                  strokeWidth={1.75}
                />
                <a
                  href="mailto:hello@meridian.com"
                  className="transition hover:text-olive-300"
                >
                  hello@meridian.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="h-4 w-4 shrink-0 text-ivory-50/40"
                  strokeWidth={1.75}
                />
                <a
                  href="tel:+251900000000"
                  className="transition hover:text-olive-300"
                >
                  +251 900 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin
                  className="h-4 w-4 shrink-0 text-ivory-50/40"
                  strokeWidth={1.75}
                />
                <span>Bole, Addis Ababa</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider — draws in on scroll */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-16 h-px w-full"
        />

        {/* Bottom bar */}
        <div className="my-6 flex flex-col-reverse items-start gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ivory-50/40">
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm text-ivory-50/70 transition hover:text-ivory-50"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-olive-300 transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
}

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ivory-50/60 transition hover:text-olive-300"
    >
      Back to top
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ivory-50/15 transition group-hover:border-olive-400/60">
        <ArrowUp
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
        />
      </span>
    </button>
  );
}
