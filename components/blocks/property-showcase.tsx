"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EstateFeature {
  id: number;
  image: string;
  title: string;
}

const features: EstateFeature[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    title: "Gated Security",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    title: "Modern Architecture",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    title: "Infinity Pool",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80",
    title: "Smart Home",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1920&q=80",
    title: "Rooftop Lounge",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80",
    title: "Green Spaces",
  },
];

export default function PropertyShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // ✅ type guard to filter out nulls
    const cards = cardsRef.current.filter(
      (el): el is HTMLDivElement => el !== null,
    );
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        const image = card.querySelector(".feature-image") as HTMLElement;
        const heading = card.querySelector(".feature-heading") as HTMLElement;
        const line = card.querySelector(".diagonal-line") as HTMLElement;

        // Initial: image clipped to bottom-right corner (diagonal hidden)
        gsap.set(image, {
          clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
          scale: 1.15,
        });

        // Heading starts below
        gsap.set(heading, {
          y: 60,
          opacity: 0,
        });

        // Diagonal accent line off-screen
        gsap.set(line, {
          x: "120%",
        });

        // Entrance timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 15%",
            scrub: 1.2,
          },
        });

        // Diagonal wipe: opens from bottom-right to full screen
        tl.to(
          image,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scale: 1,
            ease: "none",
          },
          0,
        );

        // Heading slides up
        tl.to(
          heading,
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          0.15,
        );

        // Diagonal line sweeps across
        tl.to(
          line,
          {
            x: "-120%",
            ease: "power2.inOut",
          },
          0,
        );

        // Stack effect: previous card shrinks & dims as next one arrives
        if (index < cards.length - 1) {
          ScrollTrigger.create({
            trigger: cards[index + 1],
            start: "top 85%",
            end: "top 35%",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(card, {
                scale: 1 - progress * 0.06,
                filter: `brightness(${1 - progress * 0.35})`,
                duration: 0.1,
              });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-5 px-6 py-6 md:px-12 md:py-8 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Features
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
              Estate Living
            </h2>
          </div>
          <span className="hidden md:block text-muted-foreground text-sm font-medium">
            {features.length} Amenities
          </span>
        </div>
      </div>

      {/* Full-Screen Stacking Cards */}
      <div className="relative">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="sticky top-[65px] md:top-[73px] h-[calc(100dvh-65px)] md:h-[calc(100dvh-73px)] w-full will-change-transform"
            style={{ zIndex: index + 1 }}
          >
            <div className="relative h-full w-full overflow-hidden">
              {/* Full-Screen Image with Diagonal Clip Reveal */}
              <div className="feature-image absolute inset-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </div>

              {/* Diagonal Accent Sweep Line */}
              <div
                ref={(el) => {
                  if (el) el.classList.add("diagonal-line");
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 45%, hsl(var(--primary) / 0.2) 45%, hsl(var(--primary) / 0.2) 47%, transparent 47%)",
                }}
              />

              {/* Bold Heading Only */}
              <div className="feature-heading absolute inset-0 flex items-end p-8 md:p-16 lg:p-24">
                <div className="flex items-end gap-4 md:gap-6">
                  <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white/10 leading-none select-none">
                    0{index + 1}
                  </span>

                  <div className="pb-2 md:pb-4">
                    <div
                      className={`h-1 w-12 md:w-16 bg-primary mb-3 md:mb-4 rounded-full`}
                    />
                    <h3 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Top-Right Corner Diagonal Accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20"
                style={{
                  background: `linear-gradient(225deg, hsl(var(--primary) / 0.5) 0%, transparent 60%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Spacer to let last card scroll out */}
      <div className="h-[10vh] bg-background" />
    </section>
  );
}
