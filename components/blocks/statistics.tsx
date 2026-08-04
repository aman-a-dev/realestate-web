"use client";

import { AnimatedCounter } from "@/components/primitives/animated-counter";
import { motion } from "framer-motion";
import { Home, Users, Building2, MapPin, Trophy, Clock } from "lucide-react";

const statistics = [
  {
    id: 1,
    value: 1250,
    suffix: "+",
    label: "Properties Sold",
    icon: Home,
    description: "Homes and commercial spaces",
  },
  {
    id: 2,
    value: 850,
    suffix: "+",
    label: "Happy Clients",
    icon: Users,
    description: "Satisfied buyers & sellers",
  },
  {
    id: 3,
    value: 98,
    suffix: "%",
    label: "Success Rate",
    icon: Trophy,
    description: "Close rate on listings",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
};

export default function Statistics() {
  return (
    <section className="py-16 px-4 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium">
              Trusted by Thousands
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Our Impact in Numbers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real results that speak for themselves — from happy homeowners to
            record-breaking sales.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {statistics.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative bg-background rounded-2xl shadow-sm hover:shadow-xl border border-border/50 p-6 md:p-8 transition-all duration-300 hover:border-primary/30"
              >
                {/* Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative mb-4 w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>

                {/* Value */}
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-1 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground/90 mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + stat.id * 0.05, duration: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-full origin-left"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
