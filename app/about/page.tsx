"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { BRAND, STATS, TEAM, VALUES, MILESTONES } from "@/lib/data";
import {
  Shield,
  Zap,
  Heart,
  Star,
  ArrowRight,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { AnimatedCounter } from "@/components/primitives/animated-counter";

// ─── Properly Typed Animation Variants ───────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ─── Icon Mapper ─────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Zap,
  Heart,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  Award,
};

// ─── Main Page ───────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      {/* Animated background mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      <HeroSection />
      <StatsSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <MilestonesSection />
      <CTASection />
    </main>
  );
}

// ─── Hero Section ────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-20 pb-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-start gap-8 md:items-center md:text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm shadow-sm"
          >
            <Building2 className="h-4 w-4 text-primary" />
            About {BRAND.name}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            We don't just sell{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">homes</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="absolute bottom-2 left-0 -z-0 h-3 w-full origin-left bg-primary/20 md:bottom-4 md:h-5"
              />
            </span>
            .<br className="hidden md:block" /> We curate{" "}
            <span className="relative inline-block text-primary">
              lifestyles
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <motion.path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary/40"
                />
              </motion.svg>
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Since {BRAND.founded}, {BRAND.name} has redefined the real estate
            experience by blending data-driven insights with deeply human
            intuition. We believe finding a home should feel as personal as the
            life you'll build inside it.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              {BRAND.location}
            </div>
            <div className="hidden h-8 w-px bg-border md:block" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Est. {BRAND.founded}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1"
        >
          <motion.div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Stats Section ───────────────────────────────────────────────

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative border-y border-border bg-muted/30 px-6 py-20 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col items-start rounded-2xl border border-transparent p-6 transition-colors hover:border-border hover:bg-background/50 md:items-center"
            >
              <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
              <motion.div
                initial={{ width: "3rem" }}
                whileHover={{ width: "5rem" }}
                className="mt-4 h-1 rounded-full bg-primary/30 transition-colors group-hover:bg-primary"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Story Section ───────────────────────────────────────────────

function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left sticky title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Origin
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                From a single desk to a city-wide presence, our journey has been
                defined by one unwavering commitment: putting people before
                properties.
              </p>
            </div>
          </motion.div>

          {/* Right content */}
          <div className="lg:col-span-8">
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="space-y-12"
            >
              <motion.p
                variants={fadeUp}
                className="text-xl leading-relaxed text-foreground md:text-2xl"
              >
                It started with a frustration. In {BRAND.founded}, our founder
                walked away from a traditional brokerage tired of impersonal
                transactions and opaque processes.
              </motion.p>

              <motion.div
                variants={scaleUp}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="aspect-[21/9] w-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-primary/40" />
                    <span className="mt-2 block text-sm font-medium text-muted-foreground">
                      Our original SOMA office, {BRAND.founded}
                    </span>
                  </div>
                </div>
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-primary/20" />
                <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-primary/20" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-primary/20" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-primary/20" />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                Today, {BRAND.name} operates at the intersection of predictive
                analytics and old-fashioned hospitality. We've built proprietary
                tools that forecast neighborhood trajectories, but our greatest
                asset remains the same: agents who listen more than they pitch.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="rounded-2xl border-l-4 border-primary bg-muted/50 p-8"
              >
                <blockquote className="text-xl font-medium italic text-foreground md:text-2xl">
                  "We don't measure success by commission checks. We measure it
                  by the families who still send us holiday cards five years
                  after closing."
                </blockquote>
                <cite className="mt-4 block text-sm font-semibold text-primary not-italic">
                  — Sarah Chen, Founder
                </cite>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Values Section ──────────────────────────────────────────────

function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-muted/30 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What Drives Us
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Principles That <span className="text-primary">Guide Us</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((value, i) => {
            const Icon = iconMap[value.icon];
            return (
              <motion.div
                key={value.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Hover glow effect */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="relative mb-2 text-lg font-semibold">
                  {value.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Team Section ────────────────────────────────────────────────

function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:flex md:items-end md:justify-between"
        >
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              The People
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Meet the <span className="text-primary">Leadership</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              A collective of industry veterans, creative strategists, and
              relentless advocates united by one goal: your success.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              custom={i}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-muted">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[4/5] w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">
                    {member.role}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Milestones Section ──────────────────────────────────────────

function MilestonesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-muted/30 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Through The Years
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Our <span className="text-primary">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line with progress animation */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-4 top-0 bottom-0 w-px origin-top bg-border md:left-1/2"
          />

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-16"
          >
            {MILESTONES.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                variants={i % 2 === 0 ? slideInLeft : slideInRight}
                className={`relative flex items-center gap-8 md:gap-16 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Animated dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    delay: i * 0.15,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-2 ring-primary md:left-1/2"
                >
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </motion.div>

                {/* Content card */}
                <div
                  className={`ml-12 w-full md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="text-3xl font-bold text-primary">
                      {milestone.year}
                    </span>
                    <p className="mt-2 text-muted-foreground">
                      {milestone.event}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="px-6 py-24 md:px-12 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24"
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative text-3xl font-bold tracking-tight md:text-5xl"
        >
          Ready to write your next chapter?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="relative mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80"
        >
          Whether you're buying your first condo, selling a family estate, or
          investing in commercial property, {BRAND.name} is your partner at
          every step.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-10 inline-flex items-center gap-3 rounded-full bg-background px-8 py-4 text-sm font-semibold text-foreground shadow-lg transition-colors hover:bg-muted"
          >
            Start a Conversation
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
